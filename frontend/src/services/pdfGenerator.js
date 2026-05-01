import { jsPDF } from "jspdf";

const BLUE   = "#2980B9";
const ORANGE = "#E8962A";
const DARK   = "#2C3E50";
const MID    = "#555E6D";
const RULE   = "#CCCCCC";
const LINK   = "#2980B9";

const PAGE_W = 210;
const PAGE_H = 297;
const ML = 18;
const MR = 18;
const CW = PAGE_W - ML - MR;

function hexRgb(hex) {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}
function sc(doc, hex, type = "text") {
  const [r,g,b] = hexRgb(hex);
  type === "text" ? doc.setTextColor(r,g,b) : doc.setFillColor(r,g,b);
}
function sd(doc, hex) { const [r,g,b] = hexRgb(hex); doc.setDrawColor(r,g,b); }
function tw(doc, text) { return (doc.getStringUnitWidth(text) * doc.getFontSize()) / doc.internal.scaleFactor; }
function wrap(doc, text, maxW, size) { doc.setFontSize(size); return doc.splitTextToSize(text, maxW); }

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
  try { return JSON.parse(str); } catch { return null; }
}

function flattenJson(value, depth = 0) {
  const lines = [];
  if (typeof value === "string") {
    const t = value.trim();
    if (t) lines.push((depth > 0 ? "- " : "") + t);
  } else if (Array.isArray(value)) {
    value.forEach(v => flattenJson(v, depth+1).forEach(l => lines.push(l)));
  } else if (typeof value === "object" && value !== null) {
    Object.entries(value).forEach(([key, val]) => {
      const label = key.replace(/_or_/gi," / ").replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase());
      if (typeof val === "string") {
        if (!["overall_intro","overall_strategy","requirement_analysis"].includes(key)) lines.push(label+":");
        if (val.trim()) lines.push(val.trim());
      } else if (Array.isArray(val)) {
        lines.push(label+":");
        val.forEach(v => flattenJson(v,depth+1).forEach(l=>lines.push(l)));
      } else if (typeof val === "object" && val !== null) {
        lines.push(label+":");
        flattenJson(val,depth+1).forEach(l=>lines.push(l));
      } else {
        lines.push(String(val??"").trim());
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
      let depth=0, j=i;
      while (j < text.length) {
        if (text[j]==="{") depth++;
        else if (text[j]==="}") { depth--; if (depth===0) break; }
        j++;
      }
      const candidate = text.slice(i,j+1);
      const parsed = tryJson(candidate);
      if (parsed) { out.push(flattenJson(parsed).join("\n")); i=j+1; continue; }
    }
    out.push(text[i]);
    i++;
  }
  return out.join("");
}

// ── Template helpers ──────────────────────────────────────────────────────────
function imgFmt(dataUrl) { return dataUrl.startsWith("data:image/png") ? "PNG" : "JPEG"; }

function loadImg(dataUrl) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

async function drawTemplateBg(doc, tmpl) {
  if (!tmpl || tmpl.id === "default") return;
  const { id, bgColor, slotImages } = tmpl;
  if (id === "rich" && bgColor && bgColor !== "#ffffff") {
    const [r,g,b] = hexRgb(bgColor);
    doc.setFillColor(r,g,b); doc.rect(0,0,PAGE_W,PAGE_H,"F");
  }
  if (id === "rich" && slotImages) {
    if (slotImages.fullBg?.dataUrl)       { await loadImg(slotImages.fullBg.dataUrl);      doc.addImage(slotImages.fullBg.dataUrl,      imgFmt(slotImages.fullBg.dataUrl),      0,            0,         PAGE_W, PAGE_H); }
    if (slotImages.headerBanner?.dataUrl) { await loadImg(slotImages.headerBanner.dataUrl); doc.addImage(slotImages.headerBanner.dataUrl,imgFmt(slotImages.headerBanner.dataUrl), 0,            0,         PAGE_W, 20);     }
    if (slotImages.rightSidebar?.dataUrl) { await loadImg(slotImages.rightSidebar.dataUrl); doc.addImage(slotImages.rightSidebar.dataUrl,imgFmt(slotImages.rightSidebar.dataUrl), PAGE_W-15,    0,         15,     PAGE_H); }
    if (slotImages.topRight?.dataUrl)     { await loadImg(slotImages.topRight.dataUrl);     doc.addImage(slotImages.topRight.dataUrl,    imgFmt(slotImages.topRight.dataUrl),     PAGE_W-MR-30, 3,         30,     25);     }
    if (slotImages.bottomLeft?.dataUrl)   { await loadImg(slotImages.bottomLeft.dataUrl);   doc.addImage(slotImages.bottomLeft.dataUrl,  imgFmt(slotImages.bottomLeft.dataUrl),   ML,           PAGE_H-28, 30,     25);     }
  }
}

function drawTemplateBorder(doc, tmpl) {
  if (!tmpl || (tmpl.id !== "border" && tmpl.id !== "rich") || !tmpl.borderStyle) return;
  const bc = tmpl.borderColor || "#2980B9";
  const [r,g,b] = hexRgb(bc);
  const M = 6;
  switch (tmpl.borderStyle) {
    case "simple":
      doc.setDrawColor(r,g,b); doc.setLineWidth(0.6); doc.rect(M,M,PAGE_W-M*2,PAGE_H-M*2); break;
    case "double":
      doc.setDrawColor(r,g,b); doc.setLineWidth(0.8); doc.rect(M,M,PAGE_W-M*2,PAGE_H-M*2);
      doc.setLineWidth(0.35); doc.rect(M+3,M+3,PAGE_W-(M+3)*2,PAGE_H-(M+3)*2); break;
    case "corner": {
      doc.setDrawColor(r,g,b); const arm=16; doc.setLineWidth(1.2);
      doc.line(M,M+arm,M,M); doc.line(M,M,M+arm,M);
      doc.line(PAGE_W-M-arm,M,PAGE_W-M,M); doc.line(PAGE_W-M,M,PAGE_W-M,M+arm);
      doc.line(PAGE_W-M,PAGE_H-M-arm,PAGE_W-M,PAGE_H-M); doc.line(PAGE_W-M,PAGE_H-M,PAGE_W-M-arm,PAGE_H-M);
      doc.line(M+arm,PAGE_H-M,M,PAGE_H-M); doc.line(M,PAGE_H-M,M,PAGE_H-M-arm); break;
    }
    case "accent":
      doc.setFillColor(r,g,b); doc.setDrawColor(r,g,b);
      doc.rect(M,M,3.5,PAGE_H-M*2,"F"); doc.setLineWidth(0.4);
      doc.line(M,M,PAGE_W-M,M); doc.line(M,PAGE_H-M,PAGE_W-M,PAGE_H-M); break;
  }
}

function drawHeader(doc) {
  doc.setFontSize(9); doc.setFont("helvetica","bold"); sc(doc,BLUE);
  const vw = tw(doc,"VIRTUAL");
  doc.text("VIRTUAL",ML,13); sc(doc,DARK); doc.text("EMPLOYEE",ML+vw,13);
  sd(doc,RULE); doc.setLineWidth(0.3); doc.line(ML,17,PAGE_W-MR,17);
}

function drawCover(doc, { projectTitle, preparedBy, date }) {
  doc.setFontSize(36); doc.setFont("helvetica","bold");
  const vw=tw(doc,"VIRTUAL"), ew=tw(doc,"EMPLOYEE");
  const logoX=(PAGE_W-vw-ew)/2;
  sc(doc,BLUE); doc.text("VIRTUAL",logoX,38);
  sc(doc,DARK); doc.text("EMPLOYEE",logoX+vw,38);
  doc.setFontSize(15); doc.setFont("helvetica","bold"); sc(doc,BLUE);
  const pf="PROPOSAL FOR";
  doc.text(pf,(PAGE_W-tw(doc,pf))/2,88);
  let ty=101;
  if (projectTitle?.trim()) {
    doc.setFontSize(16); doc.setFont("helvetica","bold"); sc(doc,ORANGE);
    const titleLines=wrap(doc,sanitize(projectTitle.trim()),CW-10,16);
    titleLines.forEach(line=>{ doc.text(line,(PAGE_W-tw(doc,line))/2,ty); ty+=9; });
  }
  doc.setFillColor(28,43,74); doc.rect(ML,ty+5,CW,7,"F");
  const infoY=ty+22;
  doc.setFontSize(10.5); doc.setFont("helvetica","normal");
  sc(doc,DARK); doc.text("Prepared By:",ML+18,infoY);
  sc(doc,BLUE); doc.text(sanitize(preparedBy||"Virtual Employee Pvt. Ltd."),ML+55,infoY);
  sc(doc,DARK); doc.text("Date:",ML+18,infoY+10); sc(doc,BLUE);
  const d=date?new Date(date):new Date();
  const day=d.getDate();
  const suffix=day>=11&&day<=13?"th":["th","st","nd","rd","th"][Math.min(day%10,4)];
  doc.text(`${day}${suffix} ${d.toLocaleDateString("en-GB",{month:"long",year:"numeric"})}`,ML+55,infoY+10);
  doc.setFillColor(28,43,74); doc.rect(ML,infoY+16,CW,7,"F");
}

const H1_RE     = /^(\d+)\s+([A-Z][A-Z\s&/,]+)$/;
const BULLET_RE = /^[-•*]\s+/;

function isColonSubheading(t) {
  if (!t.endsWith(":")) return false;
  const w=t.slice(0,-1).trim();
  return /^[A-Z]/.test(w) && w.split(/\s+/).length<=6;
}

function parseLines(text) {
  return text.split("\n").map(raw=>{
    const t=raw.trim();
    if (!t) return {kind:"empty"};
    if (H1_RE.test(t)) { const [,num,title]=t.match(H1_RE); return {kind:"h1",num,title:sanitize(title)}; }
    if (BULLET_RE.test(t)) return {kind:"bullet",text:sanitize(t.replace(/^[-•*]\s+/,""))};
    if (isColonSubheading(t)) return {kind:"sub",text:sanitize(t.slice(0,-1))};
    if (/^([A-Z][\.\)]\s+.+|\d+[\.\)]\s+[A-Z].+)/.test(t)) return {kind:"sub",text:sanitize(t)};
    return {kind:"body",text:sanitize(t)};
  });
}

// ── drawTOC: renders TOC rows and records link slot positions ─────────────────
// tocLinkSlots is filled here; targets are filled during content pass.
function drawTOC(doc, sections, tocLinkSlots) {
  drawHeader(doc);
  let y = 28;
  doc.setFontSize(18); doc.setFont("helvetica","bold"); sc(doc,BLUE);
  doc.text("Contents",ML,y);
  y += 10;

  sections.forEach(({ num, title, page, indent, key }) => {
    const isMajor = indent === 0;
    doc.setFontSize(isMajor ? 10.5 : 9.5);
    doc.setFont("helvetica", isMajor ? "bold" : "normal");
    sc(doc, DARK);
    const label = num ? `${num}  ${title}` : title;
    const wrapped = doc.splitTextToSize(sanitize(label), CW - indent - 12);

    if (y + wrapped.length * 5.2 > PAGE_H - 18) {
      doc.addPage(); drawHeader(doc); y = 28;
    }

    const rowStartY = y;
    const rowH = wrapped.length * 5.2 + (isMajor ? 1.5 : 0.8);

    wrapped.forEach((line, li) => doc.text(line, ML + indent, y + li * 5.2));
    doc.text(String(page), PAGE_W - MR, y, { align: "right" });

    // Only major sections (h1) get clickable links — key is their title
    if (key) {
      tocLinkSlots.push({
        tocPageNumber: doc.getCurrentPageInfo().pageNumber,
        x: ML,
        y: rowStartY - 4,
        w: CW,
        h: rowH + 2,
        key,
      });
    }

    y += rowH;
  });
}

async function drawImage(doc, dataUrl, yRef, syncPageBreak) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const ar=img.width/img.height, maxW=CW, maxH=120;
      let imgW=maxW, imgH=imgW/ar;
      if (imgH>maxH) { imgH=maxH; imgW=imgH*ar; }
      syncPageBreak(imgH+8);
      const imgX=ML+(CW-imgW)/2;
      doc.addImage(dataUrl,dataUrl.startsWith("data:image/png")?"PNG":"JPEG",imgX,yRef.y,imgW,imgH);
      resolve(imgH);
    };
    img.onerror = () => resolve(0);
    img.src = dataUrl;
  });
}

export async function generateProposalPdf(
  proposalText,
  {
    projectTitle = "",
    preparedBy   = "Virtual Employee Pvt. Ltd.",
    clientName   = "",
    date         = "",
    screenshots  = [],
    demoLink     = "",
    demoLabel    = "",
    template     = { id: "default" },
  } = {},
) {
  const doc  = new jsPDF({ unit: "mm", format: "a4" });
  doc.setFont("helvetica");
  const tmpl = template?.id ? template : { id: "default" };

  const jsonStripped = stripJsonBlocks(proposalText);
  const cleaned = jsonStripped.replace(
    /(\n|^)(CONTENTS|\d+\s+CONTENTS)[^\n]*\n([\s\S]*?)(?=(\n|^)\d+\s+[A-Z][A-Z])/gm,"\n",
  );
  const parsed = parseLines(cleaned);

  const h1Indices = parsed.reduce((acc,e,i)=>e.kind==="h1"?[...acc,i]:acc,[]);
  const futureScopeIdx = parsed.findIndex(e=>e.kind==="h1"&&/future\s*scope/i.test(e.title));

  const screenshotH1Index = screenshots.length>0
    ? futureScopeIdx>=0 ? futureScopeIdx
      : h1Indices.length>=2 ? h1Indices[h1Indices.length-2]
      : (h1Indices[h1Indices.length-1]??-1)
    : -1;

  const demoLinkH1Index = demoLink.trim()
    ? futureScopeIdx>=0 ? futureScopeIdx
      : h1Indices.length>=2 ? h1Indices[h1Indices.length-2]
      : (h1Indices[h1Indices.length-1]??-1)
    : -1;

  const PAGE_BOTTOM = PAGE_H - 18;
  let simPage=3, simY=26;
  const tocEntries = [];
  function simBreak(n) { if (simY+n>PAGE_BOTTOM) { simPage++; simY=26; } }
  let screenshotTocPage=simPage, screenshotSectionNum="";

  for (let idx=0; idx<parsed.length; idx++) {
    const e=parsed[idx];
    if (idx===screenshotH1Index) {
      simBreak(14); screenshotTocPage=simPage;
      simY+=20+screenshots.length*80;
      if (simY>PAGE_BOTTOM) { simPage++; simY=26; }
    }
    switch (e.kind) {
      case "empty": simY+=2; break;
      case "h1":
        simBreak(14); simY+=5;
        tocEntries.push({ num:e.num, title:e.title, page:simPage, indent:0, key:e.title });
        simY+=6; break;
      case "sub":
        simBreak(8); simY+=2;
        tocEntries.push({ num:"", title:e.text, page:simPage, indent:8, key:null });
        simY+=6; break;
      case "bullet": { const n=Math.ceil(e.text.length/80)||1; simBreak(n*4.8+2); simY+=n*4.8+1; break; }
      case "body":   { const n=Math.ceil(e.text.length/90)||1; simBreak(n*4.8+2); simY+=n*4.8+2; break; }
    }
  }

  function findTocInsertAt() {
    const fi=tocEntries.findIndex(t=>t.indent===0&&/future\s*scope/i.test(t.title));
    if (fi>=0) return fi;
    const maj=tocEntries.map((t,i)=>t.indent===0?i:-1).filter(i=>i>=0);
    return maj.length>=2?maj[maj.length-2]:(maj[maj.length-1]??tocEntries.length);
  }

  if (screenshots.length>0&&tocEntries.length>0) {
    const insertAt=findTocInsertAt();
    const insertNum=parseInt(tocEntries[insertAt]?.num||"0");
    screenshotSectionNum=String(insertNum);
    for (let i=insertAt;i<tocEntries.length;i++)
      if (tocEntries[i].indent===0&&tocEntries[i].num)
        tocEntries[i].num=String(parseInt(tocEntries[i].num)+1);
    tocEntries.splice(insertAt,0,{
      num:screenshotSectionNum, title:"DEMO SCREENSHOTS",
      page:screenshotTocPage, indent:0, key:"DEMO SCREENSHOTS",
    });
  }

  if (demoLink.trim()) {
    const ssIdx=tocEntries.findIndex(t=>t.title==="DEMO SCREENSHOTS");
    const demoInsertAt=ssIdx>=0?ssIdx+1:findTocInsertAt();
    const demoLinkSectionNum=parseInt(tocEntries[demoInsertAt]?.num||"0");
    for (let i=demoInsertAt;i<tocEntries.length;i++)
      if (tocEntries[i].indent===0&&tocEntries[i].num)
        tocEntries[i].num=String(parseInt(tocEntries[i].num)+1);
    tocEntries.splice(demoInsertAt,0,{
      num:String(demoLinkSectionNum), title:"DEMO LINK",
      page:simPage, indent:0, key:"DEMO LINK",
    });
  }

  // ── Cover ─────────────────────────────────────────────────────────────────
  drawCover(doc,{projectTitle,preparedBy,date});

  // ── TOC ───────────────────────────────────────────────────────────────────
  doc.addPage();
  await drawTemplateBg(doc,tmpl);
  const tocLinkSlots = [];   // filled by drawTOC
  drawTOC(doc, tocEntries, tocLinkSlots);

  // sectionPageMap: title → { pageNumber, yMm }  — filled during content pass
  const sectionPageMap = {};

  // ── Content pages ─────────────────────────────────────────────────────────
  doc.addPage();
  await drawTemplateBg(doc,tmpl);
  drawHeader(doc);
  let y=26;
  const yRef={ get y() { return y; } };

  async function pageBreak(n=10) {
    if (y+n>PAGE_BOTTOM) {
      doc.addPage(); await drawTemplateBg(doc,tmpl); drawHeader(doc); y=26;
    }
  }
  const pagesNeedingBg=new Set();
  function syncPageBreak(n=10) {
    if (y+n>PAGE_BOTTOM) {
      doc.addPage();
      pagesNeedingBg.add(doc.getCurrentPageInfo().pageNumber);
      drawHeader(doc); y=26;
    }
  }
  async function rule() {
    await pageBreak(5); sd(doc,RULE); doc.setLineWidth(0.25);
    doc.line(ML,y,PAGE_W-MR,y); y+=4;
  }

  const insertedBefore =
    (screenshots.length>0&&screenshotH1Index>=0?1:0)+
    (demoLink.trim()&&demoLinkH1Index>=0?1:0);
  const bodyShiftAnchorIdx=screenshotH1Index>=0?screenshotH1Index:demoLinkH1Index;

  async function renderDemoLinkBlock() {
    const entry=tocEntries.find(t=>t.title==="DEMO LINK");
    const num=entry?.num||"";
    await pageBreak(14); y+=5;
    sectionPageMap["DEMO LINK"]={ pageNumber:doc.getCurrentPageInfo().pageNumber, yMm:y };
    doc.setFontSize(12); doc.setFont("helvetica","bold"); sc(doc,BLUE);
    doc.text(`${num}  DEMO LINK`,ML,y);
    y+=2; await rule();
    await pageBreak(10);
    doc.setFontSize(10); doc.setFont("helvetica","bold"); sc(doc,DARK);
    doc.text(sanitize(demoLabel.trim()||"Project Demo")+":",ML,y); y+=6;
    await pageBreak(10);
    const safeUrl=sanitize(demoLink.trim());
    doc.setFontSize(10); doc.setFont("helvetica","normal"); sc(doc,LINK);
    const urlLines=doc.splitTextToSize(safeUrl,CW);
    urlLines.forEach((line,li)=>{
      const lineY=y+li*5.5;
      doc.text(line,ML,lineY);
      sd(doc,LINK); doc.setLineWidth(0.2);
      doc.line(ML,lineY+0.8,ML+tw(doc,line),lineY+0.8);
    });
    doc.link(ML,y-4,CW,urlLines.length*5.5+1,{url:demoLink.trim()});
    y+=urlLines.length*5.5+4;
    await pageBreak(8);
    doc.setFontSize(9); doc.setFont("helvetica","italic"); sc(doc,MID);
    doc.text("Click the link above or copy it into your browser to access the live demo.",ML,y);
    y+=6;
  }

  for (let idx=0; idx<parsed.length; idx++) {
    const e=parsed[idx];

    if (idx===screenshotH1Index) {
      await pageBreak(14); y+=5;
      sectionPageMap["DEMO SCREENSHOTS"]={ pageNumber:doc.getCurrentPageInfo().pageNumber, yMm:y };
      doc.setFontSize(12); doc.setFont("helvetica","bold"); sc(doc,BLUE);
      doc.text(`${screenshotSectionNum}  DEMO SCREENSHOTS`,ML,y);
      y+=2; await rule();
      for (let si=0; si<screenshots.length; si++) {
        const s=screenshots[si];
        if (!s.dataUrl) continue;
        const imgH=await drawImage(doc,s.dataUrl,yRef,syncPageBreak);
        if (imgH>0) {
          y+=imgH+2;
          doc.setFontSize(9); doc.setFont("helvetica","normal"); sc(doc,MID);
          doc.text(sanitize(s.name||`Screenshot ${si+1}`),PAGE_W/2,y,{align:"center"});
          y+=10;
        }
      }
      if (demoLink.trim()) await renderDemoLinkBlock();
    }

    if (demoLink.trim()&&screenshotH1Index<0&&idx===demoLinkH1Index) {
      await renderDemoLinkBlock();
    }

    switch (e.kind) {
      case "empty": y+=2; break;
      case "h1": {
        await pageBreak(14); y+=5;
        let displayNum=e.num;
        if (insertedBefore>0&&bodyShiftAnchorIdx>=0) {
          const thisPos=h1Indices.indexOf(idx);
          const anchorPos=h1Indices.indexOf(bodyShiftAnchorIdx);
          if (thisPos>=anchorPos) displayNum=String(parseInt(e.num)+insertedBefore);
        }
        // Record actual page + y for this heading
        sectionPageMap[e.title]={ pageNumber:doc.getCurrentPageInfo().pageNumber, yMm:y };
        doc.setFontSize(12); doc.setFont("helvetica","bold"); sc(doc,BLUE);
        doc.text(`${displayNum}  ${e.title}`,ML,y);
        y+=2; await rule();
        break;
      }
      case "sub": {
        await pageBreak(8); y+=4;
        doc.setFontSize(10.5); doc.setFont("helvetica","bold"); sc(doc,DARK);
        const wl=wrap(doc,e.text,CW-4,10.5);
        wl.forEach((line,li)=>doc.text(line,ML+2,y+li*5.5));
        y+=wl.length*5.5+2; break;
      }
      case "bullet": {
        const wl=wrap(doc,e.text,CW-8,10);
        await pageBreak(wl.length*4.8+2);
        doc.setFontSize(10); doc.setFont("helvetica","normal"); sc(doc,DARK);
        const [r,g,b]=hexRgb(DARK); doc.setFillColor(r,g,b);
        doc.circle(ML+2.2,y-1.4,0.8,"F");
        wl.forEach((line,li)=>doc.text(line,ML+5,y+li*4.8));
        y+=wl.length*4.8+1; break;
      }
      case "body": {
        doc.setFontSize(10); doc.setFont("helvetica","normal"); sc(doc,DARK);
        const wl=wrap(doc,e.text,CW,10);
        await pageBreak(wl.length*4.8+2);
        wl.forEach((line,li)=>doc.text(line,ML,y+li*4.8));
        y+=wl.length*4.8+2; break;
      }
    }
  }

  // ── Apply bg to pages created by syncPageBreak ────────────────────────────
  const currentPage=doc.getCurrentPageInfo().pageNumber;
  for (const pNum of pagesNeedingBg) {
    doc.setPage(pNum); await drawTemplateBg(doc,tmpl); drawHeader(doc);
  }
  doc.setPage(currentPage);

  // ── Borders ───────────────────────────────────────────────────────────────
  const total=doc.getNumberOfPages();
  for (let p=2;p<=total;p++) { doc.setPage(p); drawTemplateBorder(doc,tmpl); }

  // ── Footers ───────────────────────────────────────────────────────────────
  for (let p=2;p<=total;p++) {
    doc.setPage(p);
    doc.setFontSize(8); doc.setFont("helvetica","normal"); sc(doc,MID);
    const footerY=PAGE_H-11;
    if (clientName) doc.text(sanitize(`Prepared for: ${clientName}`),ML+4,footerY);
    if (p>=3) doc.text(String(p-2),PAGE_W/2,footerY,{align:"center"});
    if (preparedBy) doc.text(sanitize(preparedBy),PAGE_W-MR-4,footerY,{align:"right"});
  }

  // ── Wire TOC clickable links — done LAST, all positions now known ─────────
  // jsPDF doc.link with { pageNumber, y } creates an internal PDF link.
  // y in this API is measured in pt from the top of the target page.
  const MM_TO_PT = 2.8346;

  for (const slot of tocLinkSlots) {
    const target = sectionPageMap[slot.key];
    if (!target) continue;
    doc.setPage(slot.tocPageNumber);
    doc.link(slot.x, slot.y, slot.w, slot.h, {
      pageNumber: target.pageNumber,
      y: (target.yMm - 8) * MM_TO_PT,  // scroll a little above the heading
    });
  }

  return doc.output("blob");
}