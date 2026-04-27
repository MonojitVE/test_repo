/**
 * proposalParser.js
 *
 * Converts the backend proposal text (which contains embedded JSON blocks
 * mixed with plain text) into clean plain text suitable for the PDF generator.
 */

/**
 * Recursively flatten a JSON object/array into bullet lines.
 * Skips keys that are just container labels, extracts all string leaf values.
 */
function flattenJson(value, depth = 0) {
  const lines = [];

  if (typeof value === "string") {
    // Plain string — return as a bullet or body line
    const trimmed = value.trim();
    if (trimmed) lines.push(depth === 0 ? trimmed : `- ${trimmed}`);
  } else if (Array.isArray(value)) {
    value.forEach((item) => {
      flattenJson(item, depth + 1).forEach((l) => lines.push(l));
    });
  } else if (typeof value === "object" && value !== null) {
    Object.entries(value).forEach(([key, val]) => {
      const label = key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      if (typeof val === "string") {
        // Key: value — emit as subheading + body
        lines.push(`${label}:`);
        val
          .trim()
          .split(/\n+/)
          .forEach((line) => {
            if (line.trim()) lines.push(line.trim());
          });
      } else if (Array.isArray(val)) {
        lines.push(`${label}:`);
        val.forEach((item) => {
          if (typeof item === "string") lines.push(`- ${item.trim()}`);
          else flattenJson(item, depth + 1).forEach((l) => lines.push(l));
        });
      } else if (typeof val === "object" && val !== null) {
        lines.push(`${label}:`);
        flattenJson(val, depth + 1).forEach((l) => lines.push(l));
      }
    });
  }

  return lines;
}

/**
 * Try to parse a string as JSON. Returns parsed object or null.
 */
function tryParseJson(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

/**
 * Given a block of text that may contain one or more JSON objects,
 * replace each JSON block with its flattened plain-text equivalent.
 */
function replaceJsonBlocks(text) {
  // Match top-level JSON objects: { ... } — handles nested braces
  const result = [];
  let i = 0;

  while (i < text.length) {
    if (text[i] === "{") {
      // Try to find matching closing brace
      let depth = 0;
      let j = i;
      while (j < text.length) {
        if (text[j] === "{") depth++;
        else if (text[j] === "}") {
          depth--;
          if (depth === 0) break;
        }
        j++;
      }
      const jsonCandidate = text.slice(i, j + 1);
      const parsed = tryParseJson(jsonCandidate);
      if (parsed) {
        // Replace JSON block with flattened text
        const flat = flattenJson(parsed);
        result.push(flat.join("\n"));
        i = j + 1;
      } else {
        result.push(text[i]);
        i++;
      }
    } else {
      result.push(text[i]);
      i++;
    }
  }

  return result.join("");
}

/**
 * Main export — cleans the full proposal text.
 * Call this before passing proposalText to generateProposalPdf or ProposalViewer.
 */
export function parseProposalText(rawText) {
  if (!rawText) return "";

  // Step 1: Replace all embedded JSON blocks with flattened plain text
  let cleaned = replaceJsonBlocks(rawText);

  // Step 2: Normalise excessive blank lines (max 2 in a row)
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  // Step 3: Ensure bullet lines start with "- " consistently
  cleaned = cleaned.replace(/^[•*]\s+/gm, "- ");

  return cleaned.trim();
}
