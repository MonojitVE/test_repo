/**
 * proposalParser.js
 *
 * Parses the full_proposal JSON object from the backend into:
 * 1. sections[] — structured array for ProposalViewer HTML rendering
 * 2. plainText   — clean string for pdfGenerator
 */

// ── Section order matching the backend response keys ─────────────────────────
const SECTION_MAP = [
  { key: "company_overview", num: "1", title: "COMPANY OVERVIEW" },
  { key: "purpose_of_document", num: "2", title: "PURPOSE OF THE DOCUMENT" },
  { key: "key_deliverables", num: "3", title: "KEY DELIVERABLES" },
  { key: "objectives", num: "4", title: "OBJECTIVES" },
  {
    key: "features_and_functionality",
    num: "5",
    title: "FEATURES AND FUNCTIONALITY",
  },
  { key: "technical_approach", num: "6", title: "TECHNICAL APPROACH" },
  { key: "technology_stack", num: "7", title: "TECHNOLOGY STACK" },
  {
    key: "time_and_budget_estimate",
    num: "8",
    title: "TIME AND BUDGET ESTIMATE",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function labelFromKey(key) {
  return key
    .replace(/_or_/gi, " / ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Keys to treat as plain body paragraphs without a subsection label
const SKIP_LABEL_KEYS = new Set([
  "instruction",
  "section_intro",
  "architecture_overview",
  "executive_summary_of_deliverables",
  "admin_panel",
  "total_timeline",
  "handover_plan",
]);

/**
 * Recursively convert any JSON value into typed content items.
 */
function valueToItems(value, depth = 0) {
  const items = [];

  if (typeof value === "string") {
    const t = value.trim();
    if (t) items.push({ type: depth === 0 ? "body" : "bullet", text: t });
  } else if (typeof value === "number" || typeof value === "boolean") {
    items.push({ type: "body", text: String(value) });
  } else if (Array.isArray(value)) {
    value.forEach((v) =>
      valueToItems(v, depth + 1).forEach((i) => items.push(i)),
    );
  } else if (typeof value === "object" && value !== null) {
    Object.entries(value).forEach(([key, val]) => {
      if (SKIP_LABEL_KEYS.has(key)) {
        // Render value directly as body, no label
        if (typeof val === "string" && val.trim())
          items.push({ type: "body", text: val.trim() });
        else valueToItems(val, depth).forEach((i) => items.push(i));
        return;
      }

      const label = labelFromKey(key);

      if (typeof val === "string" && val.trim()) {
        items.push({ type: "subsection", text: label });
        items.push({ type: "body", text: val.trim() });
      } else if (typeof val === "number" || typeof val === "boolean") {
        items.push({ type: "subsection", text: label });
        items.push({ type: "body", text: String(val) });
      } else if (Array.isArray(val)) {
        const allStrings = val.every((v) => typeof v === "string");
        items.push({ type: "subsection", text: label });
        if (allStrings) {
          val.forEach((s) => items.push({ type: "bullet", text: s.trim() }));
        } else {
          val.forEach((v) =>
            valueToItems(v, depth + 1).forEach((i) => items.push(i)),
          );
        }
      } else if (typeof val === "object" && val !== null) {
        // Check for sub_features pattern
        if (val.sub_features && Array.isArray(val.sub_features)) {
          items.push({ type: "subsection", text: label });
          val.sub_features.forEach((s) =>
            items.push({ type: "bullet", text: String(s).trim() }),
          );
        } else {
          items.push({ type: "subsection", text: label });
          valueToItems(val, depth + 1).forEach((i) => items.push(i));
        }
      }
    });
  }

  return items;
}

/**
 * Convert a single section's value into items, with special handling
 * for known section structures.
 */
function sectionToItems(key, value) {
  // company_overview is always a plain string
  if (key === "company_overview" && typeof value === "string") {
    return [{ type: "body", text: value.trim() }];
  }

  // For all others, use the generic recursive converter
  return valueToItems(value, 0);
}

/**
 * Convert items to plain text lines for PDF generator.
 */
function itemsToPlainLines(items) {
  return items
    .map((item) => {
      switch (item.type) {
        case "subsection":
          return `\n${item.text}:`;
        case "bullet":
          return `- ${item.text}`;
        case "body":
          return item.text;
        default:
          return "";
      }
    })
    .filter(Boolean);
}

// ── Main exports ──────────────────────────────────────────────────────────────

/**
 * Parse full_proposal JSON object into sections for viewer + plain text for PDF.
 * @param {Object|string} input — full_proposal object OR raw text (legacy fallback)
 * @returns {{ sections: Array, plainText: string }}
 */
export function parseProposal(input) {
  if (!input) return { sections: [], plainText: "" };

  // ── Handle legacy plain text (fallback) ───────────────────────────────────
  if (typeof input === "string") {
    return parseLegacyText(input);
  }

  // ── Handle full_proposal JSON object ─────────────────────────────────────
  const sections = [];
  const plainLines = [];

  SECTION_MAP.forEach(({ key, num, title }) => {
    const value = input[key];
    if (value === undefined || value === null) return;

    const items = sectionToItems(key, value);
    if (!items.length) return;

    sections.push({ num, title, items });
    plainLines.push(`\n${num} ${title}`);
    itemsToPlainLines(items).forEach((l) => plainLines.push(l));
  });

  const plainText = plainLines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { sections, plainText };
}

/**
 * Returns only plain text (for PDF generator + copy).
 */
export function parseProposalText(input) {
  return parseProposal(input).plainText;
}

// ── Legacy plain text parser (kept as fallback) ───────────────────────────────
const H1_RE = /^(\d+)\s+([A-Z][A-Z\s&/,]+)$/;

function isColonSubheading(t) {
  if (!t.endsWith(":")) return false;
  const withoutColon = t.slice(0, -1).trim();
  if (!/^[A-Z]/.test(withoutColon)) return false;
  if (withoutColon.split(/\s+/).length > 6) return false;
  return true;
}

function parseLegacyText(rawText) {
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

  rawText.split("\n").forEach((raw) => {
    const t = raw.trim();
    if (!t) {
      addItem({ type: "spacer" });
      return;
    }

    const h1 = t.match(H1_RE);
    if (h1) {
      ensureSection(h1[1], h1[2]);
      plainLines.push(`\n${t}`);
      return;
    }

    if (/^[-•*]\s+/.test(t)) {
      const text = t.replace(/^[-•*]\s+/, "");
      addItem({ type: "bullet", text });
      plainLines.push(`- ${text}`);
      return;
    }

    if (isColonSubheading(t)) {
      addItem({ type: "subsection", text: t.slice(0, -1) });
      plainLines.push(`\n${t}`);
      return;
    }

    addItem({ type: "body", text: t });
    plainLines.push(t);
  });

  if (current) sections.push(current);
  const filtered = sections.filter(
    (s) => s.title || s.items.some((i) => i.type !== "spacer"),
  );
  return {
    sections: filtered,
    plainText: plainLines
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim(),
  };
}
