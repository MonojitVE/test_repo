/**
 * proposalParser.js
 *
 * Parses the backend proposal_text (mixed plain text + embedded JSON blocks)
 * into structured sections for rendering as HTML, and clean plain text for PDF.
 */

// ── Try parse JSON safely ─────────────────────────────────────────────────────
function tryJson(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

// ── Extract all top-level { } JSON blocks from a string ───────────────────────
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

// ── Split text into alternating text/json segments ────────────────────────────
function splitSegments(text) {
  const blocks = extractJsonBlocks(text);
  const segments = [];
  let cursor = 0;

  for (const block of blocks) {
    if (cursor < block.start) {
      segments.push({ type: "text", content: text.slice(cursor, block.start) });
    }
    segments.push({ type: "json", parsed: block.parsed });
    cursor = block.end;
  }
  if (cursor < text.length) {
    segments.push({ type: "text", content: text.slice(cursor) });
  }
  return segments;
}

// ── Convert any JSON value into typed content items ───────────────────────────
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
    // Unwrap single-key wrapper e.g. { "purpose_of_document": [...] }
    const keys = Object.keys(value);

    // Special: if only key and value is string/array, unwrap
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
        // Treat as body paragraph, no subsection label
        if (typeof val === "string")
          items.push({ type: "body", text: val.trim() });
        return;
      }

      if (typeof val === "string") {
        items.push({ type: "subsection", text: label });
        items.push({ type: "body", text: val.trim() });
      } else if (Array.isArray(val)) {
        // Check if it's an array of strings → bullets
        const allStrings = val.every((v) => typeof v === "string");
        if (allStrings) {
          items.push({ type: "subsection", text: label });
          val.forEach((s) => items.push({ type: "bullet", text: s.trim() }));
        } else {
          // Array of objects
          items.push({ type: "subsection", text: label });
          val.forEach((v) =>
            jsonToItems(v, depth + 1).forEach((i) => items.push(i)),
          );
        }
      } else if (typeof val === "object" && val !== null) {
        // Nested object — check for sub_features pattern
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

// ── Section heading regex ─────────────────────────────────────────────────────
const H1_RE = /^(\d+)\s+([A-Z][A-Z\s&/,]+)$/;

// ── Main parser ───────────────────────────────────────────────────────────────
/**
 * @param {string} rawText
 * @returns {{ sections: Array, plainText: string }}
 */
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

        const h1 = t.match(H1_RE);
        if (h1) {
          ensureSection(h1[1], h1[2]);
          plainLines.push(`\n${t}`);
          continue;
        }
        if (/^[-•*]\s+/.test(t)) {
          const text = t.replace(/^[-•*]\s+/, "");
          addItem({ type: "bullet", text });
          plainLines.push(`- ${text}`);
          continue;
        }
        addItem({ type: "body", text: t });
        plainLines.push(t);
      }
    } else {
      // JSON segment
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

  // Remove empty spacer-only sections
  const filtered = sections.filter(
    (s) => s.title || s.items.some((i) => i.type !== "spacer"),
  );

  const plainText = plainLines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { sections: filtered, plainText };
}

/**
 * Returns only the plain text version (for PDF generator + copy).
 */
export function parseProposalText(rawText) {
  return parseProposal(rawText).plainText;
}
