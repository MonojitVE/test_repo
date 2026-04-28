import { jsPDF } from "jspdf";

const BLUE = "#2980B9";
const ORANGE = "#E8962A";
const DARK = "#2C3E50";
const MID = "#555E6D";
const RULE = "#CCCCCC";

const PAGE_W = 210;
const PAGE_H = 297;
const ML = 18;
const MR = 18;
const CW = PAGE_W - ML - MR;

function hexRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}
function sc(doc, hex, type = "text") {
  const [r, g, b] = hexRgb(hex);
  type === "text" ? doc.setTextColor(r, g, b) : doc.setFillColor(r, g, b);
}
function sd(doc, hex) {
  const [r, g, b] = hexRgb(hex);
  doc.setDrawColor(r, g, b);
}
function tw(doc, text) {
  return (
    (doc.getStringUnitWidth(text) * doc.getFontSize()) /
    doc.internal.scaleFactor
  );
}
function wrap(doc, text, maxW, size) {
  doc.setFontSize(size);
  return doc.splitTextToSize(text, maxW);
}

function sanitize(text) {
  if (!text) return "";
  return text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2013/g, "-")
    .replace(/\u2014/g, "--")
    .replace(/\u2026/g, "...")
    .replace(/\u00A0/g, " ")
    .replace(/[^\x00-\xFF]/g, "");
}

function tryJson(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function flattenJson(value, depth = 0) {
  const lines = [];
  if (typeof value === "string") {
    const t = value.trim();
    if (t) lines.push((depth > 0 ? "- " : "") + t);
  } else if (Array.isArray(value)) {
    value.forEach((v) =>
      flattenJson(v, depth + 1).forEach((l) => lines.push(l)),
    );
  } else if (typeof value === "object" && value !== null) {
    Object.entries(value).forEach(([key, val]) => {
      const label = key
        .replace(/_or_/gi, " / ")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      if (typeof val === "string") {
        if (
          ![
            "overall_intro",
            "overall_strategy",
            "requirement_analysis",
          ].includes(key)
        )
          lines.push(label + ":");
        if (val.trim()) lines.push(val.trim());
      } else if (Array.isArray(val)) {
        lines.push(label + ":");
        val.forEach((v) =>
          flattenJson(v, depth + 1).forEach((l) => lines.push(l)),
        );
      } else if (typeof val === "object" && val !== null) {
        lines.push(label + ":");
        flattenJson(val, depth + 1).forEach((l) => lines.push(l));
      } else {
        lines.push(String(val ?? "").trim());
      }
    });
  }
  return lines;
}

function stripJsonBlocks(text) {
  const out = [];
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
        out.push(flattenJson(parsed).join("\n"));
        i = j + 1;
        continue;
      }
    }
    out.push(text[i]);
    i++;
  }
  return out.join("");
}

function drawHeader(doc) {
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  sc(doc, BLUE);
  const vw = tw(doc, "VIRTUAL");
  doc.text("VIRTUAL", ML, 13);
  sc(doc, DARK);
  doc.text("EMPLOYEE", ML + vw, 13);
  sd(doc, RULE);
  doc.setLineWidth(0.3);
  doc.line(ML, 17, PAGE_W - MR, 17);
}

function drawCover(doc, { projectTitle, preparedBy, date }) {
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  const vw = tw(doc, "VIRTUAL"),
    ew = tw(doc, "EMPLOYEE");
  const logoX = (PAGE_W - vw - ew) / 2;
  sc(doc, BLUE);
  doc.text("VIRTUAL", logoX, 38);
  sc(doc, DARK);
  doc.text("EMPLOYEE", logoX + vw, 38);

  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  sc(doc, BLUE);
  const pf = "PROPOSAL FOR";
  doc.text(pf, (PAGE_W - tw(doc, pf)) / 2, 88);

  let ty = 101;
  if (projectTitle && projectTitle.trim()) {
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    sc(doc, ORANGE);
    const titleLines = wrap(doc, sanitize(projectTitle.trim()), CW - 10, 16);
    titleLines.forEach((line) => {
      doc.text(line, (PAGE_W - tw(doc, line)) / 2, ty);
      ty += 9;
    });
  }

  doc.setFillColor(28, 43, 74);
  doc.rect(ML, ty + 5, CW, 7, "F");
  const infoY = ty + 22;
  doc.setFontSize(10.5);
  doc.setFont("helvetica", "normal");
  sc(doc, DARK);
  doc.text("Prepared By:", ML + 18, infoY);
  sc(doc, BLUE);
  doc.text(
    sanitize(preparedBy || "Virtual Employee Pvt. Ltd."),
    ML + 55,
    infoY,
  );
  sc(doc, DARK);
  doc.text("Date:", ML + 18, infoY + 10);
  sc(doc, BLUE);
  const d = date ? new Date(date) : new Date();
  const day = d.getDate();
  const suffix =
    day >= 11 && day <= 13
      ? "th"
      : ["th", "st", "nd", "rd", "th"][Math.min(day % 10, 4)];
  doc.text(
    `${day}${suffix} ${d.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`,
    ML + 55,
    infoY + 10,
  );
  doc.setFillColor(28, 43, 74);
  doc.rect(ML, infoY + 16, CW, 7, "F");
}

const H1_RE = /^(\d+)\s+([A-Z][A-Z\s&/,]+)$/;
const BULLET_RE = /^[-•*]\s+/;
const SUBHEAD_RE = /^([A-Z][\.\)]\s+.+|\d+[\.\)]\s+[A-Z].+)/;

function parseLines(text) {
  return text.split("\n").map((raw) => {
    const t = raw.trim();
    if (!t) return { kind: "empty" };
    if (H1_RE.test(t)) {
      const [, num, title] = t.match(H1_RE);
      return { kind: "h1", num, title: sanitize(title) };
    }
    if (BULLET_RE.test(t))
      return { kind: "bullet", text: sanitize(t.replace(/^[-•*]\s+/, "")) };
    if (SUBHEAD_RE.test(t)) return { kind: "sub", text: sanitize(t) };
    return { kind: "body", text: sanitize(t) };
  });
}

function drawTOC(doc, sections) {
  drawHeader(doc);
  let y = 28;
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  sc(doc, BLUE);
  doc.text("Contents", ML, y);
  y += 10;
  sections.forEach(({ num, title, page, indent }) => {
    const isMajor = indent === 0;
    doc.setFontSize(isMajor ? 10.5 : 9.5);
    doc.setFont("helvetica", isMajor ? "bold" : "normal");
    sc(doc, DARK);
    const label = num ? `${num}  ${title}` : title;
    const wrapped = doc.splitTextToSize(sanitize(label), CW - indent - 12);
    if (y + wrapped.length * 5.2 > PAGE_H - 18) {
      doc.addPage();
      drawHeader(doc);
      y = 28;
    }
    wrapped.forEach((line, li) => doc.text(line, ML + indent, y + li * 5.2));
    doc.text(String(page), PAGE_W - MR, y, { align: "right" });
    y += wrapped.length * 5.2 + (isMajor ? 1.5 : 0.8);
  });
}

async function drawImage(doc, dataUrl, y, pageBreakFn) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const maxW = CW,
        maxH = 120;
      let imgW = maxW,
        imgH = imgW / aspectRatio;
      if (imgH > maxH) {
        imgH = maxH;
        imgW = imgH * aspectRatio;
      }
      pageBreakFn(imgH + 8);
      const imgX = ML + (CW - imgW) / 2;
      const fmt = dataUrl.startsWith("data:image/png") ? "PNG" : "JPEG";
      doc.addImage(dataUrl, fmt, imgX, y, imgW, imgH);
      resolve(imgH);
    };
    img.onerror = () => resolve(0);
    img.src = dataUrl;
  });
}

function drawSectionHeading(doc, num, title, y, ruleFn) {
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  sc(doc, BLUE);
  doc.text(`${num}  ${title}`, ML, y);
  ruleFn();
}

export async function generateProposalPdf(
  proposalText,
  {
    projectTitle = "",
    preparedBy = "Virtual Employee Pvt. Ltd.",
    clientName = "",
    date = "",
    screenshots = [],
  } = {},
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.setFont("helvetica");

  const jsonStripped = stripJsonBlocks(proposalText);
  const cleaned = jsonStripped.replace(
    /(\n|^)(CONTENTS|\d+\s+CONTENTS)[^\n]*\n([\s\S]*?)(?=(\n|^)\d+\s+[A-Z][A-Z])/gm,
    "\n",
  );
  const parsed = parseLines(cleaned);

  // Separate last h1 from the rest so we can insert screenshots before it
  const h1Indices = parsed.reduce(
    (acc, e, i) => (e.kind === "h1" ? [...acc, i] : acc),
    [],
  );
  const lastH1Index =
    h1Indices.length > 0 ? h1Indices[h1Indices.length - 1] : -1;

  const PAGE_BOTTOM = PAGE_H - 18;
  let simPage = 3,
    simY = 26;
  const tocEntries = [];
  function simBreak(n) {
    if (simY + n > PAGE_BOTTOM) {
      simPage++;
      simY = 26;
    }
  }

  // Simulate pages to get TOC page numbers — inject screenshots before last h1
  let screenshotTocPage = simPage;
  let screenshotSectionNum = "";

  for (let idx = 0; idx < parsed.length; idx++) {
    const e = parsed[idx];

    // Inject screenshots sim before the last h1
    if (idx === lastH1Index && screenshots.length > 0) {
      simBreak(14);
      screenshotTocPage = simPage;
      simY += 20 + screenshots.length * 80; // rough estimate
      if (simY > PAGE_BOTTOM) {
        simPage++;
        simY = 26;
      }
    }

    switch (e.kind) {
      case "empty":
        simY += 2;
        break;
      case "h1":
        simBreak(14);
        simY += 5;
        tocEntries.push({
          num: e.num,
          title: e.title,
          page: simPage,
          indent: 0,
        });
        simY += 6;
        break;
      case "sub":
        simBreak(8);
        simY += 2;
        tocEntries.push({ num: "", title: e.text, page: simPage, indent: 8 });
        simY += 6;
        break;
      case "bullet": {
        const n = Math.ceil(e.text.length / 80) || 1;
        simBreak(n * 4.8 + 2);
        simY += n * 4.8 + 1;
        break;
      }
      case "body": {
        const n = Math.ceil(e.text.length / 90) || 1;
        simBreak(n * 4.8 + 2);
        simY += n * 4.8 + 2;
        break;
      }
    }
  }

  // Insert screenshots into TOC before last major entry
  if (screenshots.length > 0 && tocEntries.length > 0) {
    const lastMajorIdx = tocEntries
      .map((t, i) => (t.indent === 0 ? i : -1))
      .filter((i) => i >= 0)
      .pop();
    const lastMajorNum = parseInt(tocEntries[lastMajorIdx]?.num || "0");
    screenshotSectionNum = String(lastMajorNum); // same number, will shift last section +1
    // Renumber last section
    tocEntries[lastMajorIdx].num = String(lastMajorNum + 1);
    tocEntries.splice(lastMajorIdx, 0, {
      num: String(lastMajorNum),
      title: "DEMO SCREENSHOTS",
      page: screenshotTocPage,
      indent: 0,
    });
  }

  // ── Cover ──────────────────────────────────────────────────────────────────
  drawCover(doc, { projectTitle, preparedBy, date });

  // ── TOC ────────────────────────────────────────────────────────────────────
  doc.addPage();
  drawTOC(doc, tocEntries);

  // ── Content pages ──────────────────────────────────────────────────────────
  doc.addPage();
  drawHeader(doc);
  let y = 26;

  function pageBreak(n = 10) {
    if (y + n > PAGE_BOTTOM) {
      doc.addPage();
      drawHeader(doc);
      y = 26;
    }
  }
  function rule() {
    pageBreak(5);
    sd(doc, RULE);
    doc.setLineWidth(0.25);
    doc.line(ML, y, PAGE_W - MR, y);
    y += 4;
  }

  for (let idx = 0; idx < parsed.length; idx++) {
    const e = parsed[idx];

    // Inject screenshots before the last h1
    if (idx === lastH1Index && screenshots.length > 0) {
      pageBreak(14);
      y += 5;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      sc(doc, BLUE);
      doc.text(`${screenshotSectionNum}  DEMO SCREENSHOTS`, ML, y);
      y += 2;
      rule();

      for (let si = 0; si < screenshots.length; si++) {
        const s = screenshots[si];
        if (!s.dataUrl) continue;
        const imgH = await drawImage(doc, s.dataUrl, y, (needed) => {
          if (y + needed > PAGE_BOTTOM) {
            doc.addPage();
            drawHeader(doc);
            y = 26;
          }
        });
        if (imgH > 0) {
          y += imgH + 2;
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          sc(doc, MID);
          doc.text(sanitize(s.name || `Screenshot ${si + 1}`), PAGE_W / 2, y, {
            align: "center",
          });
          y += 10;
        }
      }
    }

    switch (e.kind) {
      case "empty":
        y += 2;
        break;
      case "h1":
        pageBreak(14);
        y += 5;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        sc(doc, BLUE);
        // Use renumbered TOC num if this is the last section
        const displayNum =
          idx === lastH1Index && screenshots.length > 0
            ? String(parseInt(e.num) + 1)
            : e.num;
        doc.text(`${displayNum}  ${e.title}`, ML, y);
        y += 2;
        rule();
        break;
      case "sub": {
        pageBreak(8);
        y += 2;
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        sc(doc, DARK);
        const wl = wrap(doc, e.text, CW - 4, 10);
        wl.forEach((line, li) => doc.text(line, ML + 2, y + li * 5));
        y += wl.length * 5 + 1;
        break;
      }
      case "bullet": {
        const wl = wrap(doc, e.text, CW - 8, 10);
        pageBreak(wl.length * 4.8 + 2);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        sc(doc, DARK);
        const [r, g, b] = hexRgb(DARK);
        doc.setFillColor(r, g, b);
        doc.circle(ML + 2.2, y - 1.4, 0.8, "F");
        wl.forEach((line, li) => doc.text(line, ML + 5, y + li * 4.8));
        y += wl.length * 4.8 + 1;
        break;
      }
      case "body": {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        sc(doc, DARK);
        const wl = wrap(doc, e.text, CW, 10);
        pageBreak(wl.length * 4.8 + 2);
        wl.forEach((line, li) => doc.text(line, ML, y + li * 4.8));
        y += wl.length * 4.8 + 2;
        break;
      }
    }
  }

  // ── Footers ────────────────────────────────────────────────────────────────
  const total = doc.getNumberOfPages();
  for (let p = 2; p <= total; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    sc(doc, MID);
    if (clientName)
      doc.text(sanitize(`Prepared for: ${clientName}`), ML, PAGE_H - 8);
    if (p >= 3)
      doc.text(String(p - 2), PAGE_W / 2, PAGE_H - 8, { align: "center" });
    if (preparedBy)
      doc.text(sanitize(preparedBy), PAGE_W - MR, PAGE_H - 8, {
        align: "right",
      });
  }

  return doc.output("blob");
}
