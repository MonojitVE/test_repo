from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable,
    PageBreak, Table, TableStyle
)
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER
import io
import re

def create_proposal_pdf(
    proposal_text: str,
    client_name: str = "",
    project_title: str = "",
) -> bytes:

    from datetime import datetime

    buffer = io.BytesIO()

    # ✅ Clean text (important for LLM outputs)
    proposal_text = proposal_text.replace("\r", "").strip()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=L_MARGIN,
        rightMargin=R_MARGIN,
        topMargin=50,
        bottomMargin=60,
        title="Project Proposal",
        author="VirtualEmployee.com",
    )

    styles = build_styles()
    story = []

    # ✅ Date formatting
    now = datetime.now()
    day = now.day
    suffix = (
        "th" if 11 <= day <= 13
        else {1: "st", 2: "nd", 3: "rd"}.get(day % 10, "th")
    )
    date_str = f"{day}<super>{suffix}</super> {now.strftime('%B %Y')}."

    # ✅ Improved title extraction
    if not project_title:
        lines = proposal_text.split("\n")
        for ln in lines:
            s = ln.strip()
            if s and len(s) < 100:  # avoid long sentences
                project_title = s
                break

    if not project_title:
        project_title = "Project Proposal"

    # ✅ Build cover
    build_cover(story, styles, client_name, project_title, date_str)

    # ── Render body ───────────────────────────────────────────
    lines = proposal_text.split("\n")

    for raw_line in lines:
        kind, text = classify_line(raw_line)

        try:
            if kind == "empty":
                story.append(Spacer(1, 4))

            elif kind == "heading":
                story.append(Spacer(1, 6))
                story.append(HRFlowable(width="100%", thickness=0.4, color=RULE_BLUE))
                story.append(
                    Paragraph(
                        f'<font color="#1A5FA8"><b>{text}</b></font>',
                        styles["section_heading"],
                    )
                )

            elif kind == "numbered":
                story.append(Paragraph(text, styles["numbered_point"]))

            elif kind == "bullet":
                clean = re.sub(r"^[-•\*]\s+", "", text)
                story.append(Paragraph(f"• {clean}", styles["numbered_point"]))

            else:
                if text.strip():
                    story.append(Paragraph(text.strip(), styles["body"]))

        except Exception:
            # ✅ Safety fallback (prevents crash on bad LLM text)
            story.append(Paragraph(text, styles["body"]))

    cb = _make_page_number_cb()
    doc.build(story, onFirstPage=cb, onLaterPages=cb)

    return buffer.getvalue()
