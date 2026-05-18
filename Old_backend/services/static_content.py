# ── Text Constants ───────────────────────────────────────────
contents = """
"""

company_overview = """
1 COMPANY OVERVIEW
VirtualEmployee.com is a leading remote staffing company, headquartered near New Delhi, India with multiple branch offices across the country. The company specializes in providing dedicated remote professionals to global clients across various industries. With a strong focus on quality, scalability, and cost-effectiveness, VirtualEmployee.com enables businesses to build efficient remote teams tailored to their needs.
"""

# ── Imports ──────────────────────────────────────────────────
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import Paragraph, Spacer, HRFlowable, PageBreak
from reportlab.lib import colors
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
import reportlab
import os
import re

# ── Constants ────────────────────────────────────────────────
L_MARGIN = 60
R_MARGIN = 60
RULE_BLUE = "#1A5FA8"

# ── Font Registration (fixes garbled text) ───────────────────
def _register_fonts():
    try:
        rl_dir = os.path.dirname(reportlab.__file__)
        r = os.path.join(rl_dir, "fonts", "Vera.ttf")
        b = os.path.join(rl_dir, "fonts", "VeraBd.ttf")
        print(f"[FONT DEBUG] Looking for fonts at: {r}")
        if os.path.exists(r) and os.path.exists(b):
            pdfmetrics.registerFont(TTFont("ProposalFont", r))
            pdfmetrics.registerFont(TTFont("ProposalFontBold", b))
            print("[FONT DEBUG] Using: ProposalFont, ProposalFontBold")
            return "ProposalFont", "ProposalFontBold"
        else:
            print("[FONT DEBUG] Vera fonts not found, falling back to Helvetica")
    except Exception as e:
        print(f"[FONT ERROR] {e}")
    return "Helvetica", "Helvetica-Bold"

BODY_FONT, BOLD_FONT = _register_fonts()

# ── build_styles ─────────────────────────────────────────────
def build_styles() -> dict:
    return {
        "cover_title": ParagraphStyle(
            "cover_title",
            fontName=BOLD_FONT,
            fontSize=22,
            leading=28,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#1A5FA8"),
            spaceAfter=10,
        ),
        "cover_sub": ParagraphStyle(
            "cover_sub",
            fontName=BODY_FONT,
            fontSize=12,
            leading=18,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#444444"),
            spaceAfter=6,
        ),
        "section_heading": ParagraphStyle(
            "section_heading",
            fontName=BOLD_FONT,
            fontSize=13,
            leading=18,
            alignment=TA_LEFT,
            textColor=colors.HexColor("#1A5FA8"),
            spaceBefore=8,
            spaceAfter=4,
        ),
        "body": ParagraphStyle(
            "body",
            fontName=BODY_FONT,
            fontSize=10,
            leading=15,
            alignment=TA_LEFT,
            textColor=colors.HexColor("#222222"),
            spaceAfter=4,
        ),
        "numbered_point": ParagraphStyle(
            "numbered_point",
            fontName=BODY_FONT,
            fontSize=10,
            leading=15,
            leftIndent=16,
            alignment=TA_LEFT,
            textColor=colors.HexColor("#222222"),
            spaceAfter=3,
        ),
    }

# ── build_cover ──────────────────────────────────────────────
def build_cover(story: list, styles: dict, client_name: str, project_title: str, date_str: str):
    story.append(Spacer(1, 1.2 * inch))
    story.append(Paragraph("PROJECT PROPOSAL", styles["cover_title"]))
    story.append(Spacer(1, 0.2 * inch))
    story.append(HRFlowable(width="80%", thickness=1.5, color=colors.HexColor("#1A5FA8"), hAlign="CENTER"))
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph(project_title, styles["cover_sub"]))
    if client_name:
        story.append(Spacer(1, 0.1 * inch))
        story.append(Paragraph(f"Prepared for: <b>{client_name}</b>", styles["cover_sub"]))
    story.append(Spacer(1, 0.1 * inch))
    story.append(Paragraph(f"Date: {date_str}", styles["cover_sub"]))
    story.append(Spacer(1, 0.3 * inch))
    story.append(HRFlowable(width="80%", thickness=0.5, color=colors.HexColor("#AAAAAA"), hAlign="CENTER"))
    story.append(PageBreak())

# ── classify_line ────────────────────────────────────────────
def classify_line(raw_line: str):
    stripped = raw_line.strip()

    if not stripped:
        return "empty", ""

    # Heading: e.g. "1 COMPANY OVERVIEW" or "7 TECHNOLOGY STACK"
    if re.match(r"^\d+\s+[A-Z][A-Z\s&]{3,}$", stripped):
        return "heading", stripped

    # Numbered point: e.g. "1. something" or "1) something"
    if re.match(r"^\d+[\.\)]\s+", stripped):
        return "numbered", stripped

    # Bullet point
    if re.match(r"^[-•*]\s+", stripped):
        return "bullet", stripped

    return "body", stripped

# ── _make_page_number_cb ─────────────────────────────────────
def _make_page_number_cb():
    def draw_page_number(canvas, doc):
        canvas.saveState()
        canvas.setFont(BODY_FONT, 8)
        canvas.setFillColor(colors.HexColor("#888888"))
        page_num = canvas.getPageNumber()
        text = f"Page {page_num}"
        canvas.drawRightString(doc.pagesize[0] - R_MARGIN, 40, text)
        canvas.restoreState()
    return draw_page_number