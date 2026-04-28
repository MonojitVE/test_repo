/**
 * proposalParser.js
 *
 * Parses the backend proposal_text (mixed plain text + embedded JSON blocks)
 * into structured sections for rendering as HTML, and clean plain text for PDF.
 */

function tryJson(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function extractJsonBlocks(text) {
  const blocks = [];
  let i = 0;
  while (i < text.length) {
    if (text[i] === "{") {
      let depth = 0,
        j = i;
      while (j < text.length) {
        if (text[j] === "{") depth++;
        else if (text[j] === "}") {
          depth--;
          if (depth === 0) break;
        }
        j++;
      }
      const candidate = text.slice(i, j + 1);
      const parsed = tryJson(candidate);
      if (parsed) {
        blocks.push({ start: i, end: j + 1, parsed });
        i = j + 1;
        continue;
      }
    }
    i++;
  }
  return blocks;
}

function splitSegments(text) {
  const blocks = extractJsonBlocks(text);
  const segments = [];
  let cursor = 0;
  for (const block of blocks) {
    if (cursor < block.start)
      segments.push({ type: "text", content: text.slice(cursor, block.start) });
    segments.push({ type: "json", parsed: block.parsed });
    cursor = block.end;
  }
  if (cursor < text.length)
    segments.push({ type: "text", content: text.slice(cursor) });
  return segments;
}

function jsonToItems(value, depth = 0) {
  const items = [];
  if (typeof value === "string") {
    const t = value.trim();
    if (t) items.push({ type: depth === 0 ? "body" : "bullet", text: t });
  } else if (Array.isArray(value)) {
    value.forEach((v) =>
      jsonToItems(v, depth + 1).forEach((i) => items.push(i)),
    );
  } else if (typeof value === "object" && value !== null) {
    const keys = Object.keys(value);
    if (keys.length === 1) {
      const inner = value[keys[0]];
      if (typeof inner === "string") {
        items.push({ type: "body", text: inner.trim() });
        return items;
      }
      if (Array.isArray(inner)) {
        inner.forEach((v) =>
          jsonToItems(v, depth).forEach((i) => items.push(i)),
        );
        return items;
      }
    }
    keys.forEach((key) => {
      const val = value[key];
      const label = key
        .replace(/_or_/gi, " / ")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      if (
        key === "overall_intro" ||
        key === "overall_strategy" ||
        key === "requirement_analysis"
      ) {
        if (typeof val === "string")
          items.push({ type: "body", text: val.trim() });
        return;
      }
      if (typeof val === "string") {
        items.push({ type: "subsection", text: label });
        items.push({ type: "body", text: val.trim() });
      } else if (Array.isArray(val)) {
        const allStrings = val.every((v) => typeof v === "string");
        items.push({ type: "subsection", text: label });
        if (allStrings) {
          val.forEach((s) => items.push({ type: "bullet", text: s.trim() }));
        } else {
          val.forEach((v) =>
            jsonToItems(v, depth + 1).forEach((i) => items.push(i)),
          );
        }
      } else if (typeof val === "object" && val !== null) {
        if (val.sub_features && Array.isArray(val.sub_features)) {
          items.push({ type: "subsection", text: label });
          val.sub_features.forEach((s) =>
            items.push({ type: "bullet", text: String(s).trim() }),
          );
        } else {
          items.push({ type: "subsection", text: label });
          jsonToItems(val, depth + 1).forEach((i) => items.push(i));
        }
      }
    });
  }
  return items;
}

const H1_RE = /^(\d+)\s+([A-Z][A-Z\s&/,]+)$/;

/**
 * Detects lines like "Overview:", "Frontend:", "Backend Services:", "System Architecture:"
 * Rules:
 * - Ends with a colon
 * - No more than 6 words
 * - Starts with a capital letter
 * - Not a bullet or heading
 */
function isColonSubheading(t) {
  if (!t.endsWith(":")) return false;
  const withoutColon = t.slice(0, -1).trim();
  // Must start with capital
  if (!/^[A-Z]/.test(withoutColon)) return false;
  // No more than 6 words
  const wordCount = withoutColon.split(/\s+/).length;
  if (wordCount > 6) return false;
  // Must not be a full sentence (no lowercase words in middle except short connectors)
  // i.e. most words should be capitalised or it's short
  return true;
}

export function parseProposal(rawText) {
  if (!rawText) return { sections: [], plainText: "" };

  const segments = splitSegments(rawText);
  const sections = [];
  const plainLines = [];
  let current = null;

  function ensureSection(num, title) {
    if (current) sections.push(current);
    current = { num, title, items: [] };
  }
  function addItem(item) {
    if (!current) ensureSection("", "");
    current.items.push(item);
  }

  for (const seg of segments) {
    if (seg.type === "text") {
      const lines = seg.content.split("\n");
      for (const raw of lines) {
        const t = raw.trim();
        if (!t) {
          addItem({ type: "spacer" });
          continue;
        }

        // Major section heading e.g. "1 COMPANY OVERVIEW"
        const h1 = t.match(H1_RE);
        if (h1) {
          ensureSection(h1[1], h1[2]);
          plainLines.push(`\n${t}`);
          continue;
        }

        // Bullet
        if (/^[-•*]\s+/.test(t)) {
          const text = t.replace(/^[-•*]\s+/, "");
          addItem({ type: "bullet", text });
          plainLines.push(`- ${text}`);
          continue;
        }

        // ── Colon subheading e.g. "Frontend:", "System Architecture:" ──────
        if (isColonSubheading(t)) {
          addItem({ type: "subsection", text: t.slice(0, -1) }); // strip trailing colon
          plainLines.push(`\n${t}`);
          continue;
        }

        // Body
        addItem({ type: "body", text: t });
        plainLines.push(t);
      }
    } else {
      const items = jsonToItems(seg.parsed);
      items.forEach((item) => {
        addItem(item);
        if (item.type === "subsection") plainLines.push(`\n${item.text}:`);
        else if (item.type === "bullet") plainLines.push(`- ${item.text}`);
        else if (item.type === "body") plainLines.push(item.text);
      });
    }
  }

  if (current) sections.push(current);

  const filtered = sections.filter(
    (s) => s.title || s.items.some((i) => i.type !== "spacer"),
  );

  const plainText = plainLines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { sections: filtered, plainText };
}

export function parseProposalText(rawText) {
  return parseProposal(rawText).plainText;
}
