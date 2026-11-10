from __future__ import annotations

import html
import os
import re
from pathlib import Path

from reportlab.graphics.shapes import Drawing, Line, Polygon, Rect, String
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    ListFlowable,
    ListItem,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "week-2-3" / "REPORT.md"
OUTPUT = ROOT / "output" / "pdf" / "newsren-week2-3-architecture-feasibility.pdf"

NAVY = HexColor("#0B1F3A")
BLUE = HexColor("#174A7E")
RED = HexColor("#B4232D")
PAPER = HexColor("#F7F4ED")
INK = HexColor("#18212B")
MUTED = HexColor("#5C6670")
LINE_COLOR = HexColor("#C8CED5")
LIGHT_BLUE = HexColor("#EAF1F7")
LIGHT_RED = HexColor("#F8E9E9")


def inline_markup(value: str) -> str:
    escaped = html.escape(value.strip())
    escaped = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", escaped)
    escaped = re.sub(r"`([^`]+)`", r"<font name='Courier'>\1</font>", escaped)
    escaped = re.sub(
        r"(https?://[^\s<]+)",
        r"<link href='\1' color='#174A7E'>\1</link>",
        escaped,
    )
    return escaped


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="BodyNewsren",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.2,
        leading=13.2,
        textColor=INK,
        spaceAfter=7,
    )
)
styles.add(
    ParagraphStyle(
        name="H1Newsren",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=22,
        textColor=NAVY,
        spaceBefore=7,
        spaceAfter=10,
        keepWithNext=True,
    )
)
styles.add(
    ParagraphStyle(
        name="H2Newsren",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=16,
        textColor=BLUE,
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True,
    )
)
styles.add(
    ParagraphStyle(
        name="H3Newsren",
        parent=styles["Heading3"],
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=13,
        textColor=RED,
        spaceBefore=8,
        spaceAfter=5,
        keepWithNext=True,
    )
)
styles.add(
    ParagraphStyle(
        name="SmallNewsren",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=7.4,
        leading=9.6,
        textColor=MUTED,
    )
)
styles.add(
    ParagraphStyle(
        name="CodeNewsren",
        parent=styles["Code"],
        fontName="Courier",
        fontSize=7.5,
        leading=10,
        textColor=NAVY,
        backColor=LIGHT_BLUE,
        borderColor=LINE_COLOR,
        borderWidth=0.5,
        borderPadding=7,
        spaceBefore=4,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="ProblemStatement",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=11,
        leading=16,
        textColor=NAVY,
        backColor=LIGHT_BLUE,
        borderColor=BLUE,
        borderWidth=1,
        borderPadding=12,
        spaceAfter=16,
    )
)


class NumberedDocTemplate(BaseDocTemplate):
    pass


def cover_page(canvas, doc):
    canvas.saveState()
    width, height = letter
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    canvas.setFillColor(NAVY)
    canvas.rect(0, height - 0.42 * inch, width, 0.42 * inch, fill=1, stroke=0)
    canvas.setFillColor(RED)
    canvas.rect(0, height - 0.49 * inch, width, 0.07 * inch, fill=1, stroke=0)
    canvas.setFont("Helvetica-Bold", 10)
    canvas.setFillColor(NAVY)
    canvas.drawString(0.72 * inch, 0.47 * inch, "THE NEWSREN")
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(width - 0.72 * inch, 0.47 * inch, "49-772 A2 | FALL 2026")
    canvas.restoreState()


def body_page(canvas, doc):
    canvas.saveState()
    width, height = letter
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    canvas.setStrokeColor(LINE_COLOR)
    canvas.line(0.62 * inch, height - 0.55 * inch, width - 0.62 * inch, height - 0.55 * inch)
    canvas.setFont("Helvetica-Bold", 7.5)
    canvas.setFillColor(NAVY)
    canvas.drawString(0.62 * inch, height - 0.4 * inch, "THE NEWSREN")
    canvas.setFont("Helvetica", 7.2)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(width - 0.62 * inch, height - 0.4 * inch, "ARCHITECTURE & FEASIBILITY")
    canvas.line(0.62 * inch, 0.52 * inch, width - 0.62 * inch, 0.52 * inch)
    canvas.drawString(0.62 * inch, 0.32 * inch, "CMU Silicon Valley | Software Engineering Management")
    canvas.drawRightString(width - 0.62 * inch, 0.32 * inch, f"Page {doc.page}")
    canvas.restoreState()


def architecture_drawing() -> Drawing:
    drawing = Drawing(500, 200)
    boxes = [
        (10, 142, 140, 34, "Federal Register API", LIGHT_BLUE),
        (10, 92, 140, 34, "Agency guidance", LIGHT_BLUE),
        (10, 42, 140, 34, "Optional media corpus", LIGHT_RED),
        (190, 117, 125, 38, "Canonical schema", colors.white),
        (190, 55, 125, 38, "Matching + time", colors.white),
        (355, 117, 135, 38, "Evidence bundle", colors.white),
        (355, 55, 135, 38, "Agent + validator", colors.white),
        (355, 5, 135, 30, "Human review", LIGHT_RED),
    ]
    for x, y, w, h, label, fill in boxes:
        drawing.add(Rect(x, y, w, h, rx=5, ry=5, fillColor=fill, strokeColor=BLUE, strokeWidth=1))
        drawing.add(String(x + w / 2, y + h / 2 - 3, label, fontName="Helvetica-Bold", fontSize=7.5, textAnchor="middle", fillColor=NAVY))

    def arrow(x1, y1, x2, y2):
        drawing.add(Line(x1, y1, x2, y2, strokeColor=MUTED, strokeWidth=1))
        drawing.add(Polygon([x2, y2, x2 - 6, y2 + 3, x2 - 6, y2 - 3], fillColor=MUTED, strokeColor=MUTED))

    arrow(150, 159, 190, 136)
    arrow(150, 109, 190, 136)
    arrow(150, 59, 190, 74)
    arrow(252, 117, 252, 93)
    arrow(315, 74, 355, 136)
    arrow(422, 117, 422, 93)
    arrow(422, 55, 422, 35)
    drawing.add(String(250, 186, "FEASIBILITY ARCHITECTURE", fontName="Helvetica-Bold", fontSize=9, textAnchor="middle", fillColor=RED))
    return drawing


def parse_table(lines: list[str]) -> Table:
    rows: list[list[Paragraph]] = []
    for line in lines:
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if all(re.fullmatch(r":?-{3,}:?", cell.replace(" ", "")) for cell in cells):
            continue
        rows.append([Paragraph(inline_markup(cell), styles["SmallNewsren"]) for cell in cells])
    cols = len(rows[0])
    available = 7.15 * inch
    if cols == 2:
        widths = [available * 0.28, available * 0.72]
    elif cols == 3:
        widths = [available * 0.22, available * 0.39, available * 0.39]
    elif cols == 4:
        widths = [available * 0.34] + [available * 0.22] * 3
    else:
        widths = [available / cols] * cols
    table = Table(rows, colWidths=widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), NAVY),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("GRID", (0, 0), (-1, -1), 0.35, LINE_COLOR),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, HexColor("#F3F6F8")]),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    return table


def markdown_story(markdown: str):
    lines = markdown.splitlines()
    start = next(i for i, line in enumerate(lines) if line.startswith("## Executive summary"))
    lines = lines[start:]
    story = []
    paragraph_lines: list[str] = []
    list_lines: list[str] = []
    code_lines: list[str] = []
    in_code = False
    problem_next = False

    def flush_paragraph():
        nonlocal paragraph_lines, problem_next
        if paragraph_lines:
            text = " ".join(line.strip() for line in paragraph_lines)
            style = styles["ProblemStatement"] if problem_next else styles["BodyNewsren"]
            story.append(Paragraph(inline_markup(text), style))
            paragraph_lines = []
            problem_next = False

    def flush_list():
        nonlocal list_lines
        if list_lines:
            ordered = bool(re.match(r"^\d+\.\s", list_lines[0]))
            rows = []
            for position, item in enumerate(list_lines, start=1):
                value = re.sub(r"^(?:[-*]|\d+\.)\s+", "", item)
                marker = f"{position}." if ordered else "•"
                rows.append([
                    Paragraph(marker, ParagraphStyle("ListMarker", parent=styles["SmallNewsren"], fontName="Helvetica-Bold", textColor=RED, alignment=TA_CENTER)),
                    Paragraph(inline_markup(value), styles["BodyNewsren"]),
                ])
            listing = Table(rows, colWidths=[0.22 * inch, 6.75 * inch], hAlign="LEFT")
            listing.setStyle(TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 3),
                ("TOPPADDING", (0, 0), (-1, -1), 1),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
            ]))
            story.append(listing)
            story.append(Spacer(1, 5))
            list_lines = []

    index = 0
    while index < len(lines):
        line = lines[index]
        if line.startswith("```"):
            flush_paragraph()
            flush_list()
            if in_code:
                story.append(Paragraph("<br/>".join(html.escape(value) for value in code_lines), styles["CodeNewsren"]))
                code_lines = []
                in_code = False
            else:
                in_code = True
            index += 1
            continue
        if in_code:
            code_lines.append(line)
            index += 1
            continue
        if line.startswith("|") and index + 1 < len(lines) and lines[index + 1].startswith("|"):
            flush_paragraph()
            flush_list()
            table_lines = []
            while index < len(lines) and lines[index].startswith("|"):
                table_lines.append(lines[index])
                index += 1
            story.append(parse_table(table_lines))
            story.append(Spacer(1, 8))
            continue
        if re.match(r"^(?:[-*]|\d+\.)\s+", line):
            flush_paragraph()
            list_lines.append(line)
            index += 1
            continue
        flush_list()
        if line.startswith("### "):
            flush_paragraph()
            story.append(Paragraph(inline_markup(line[4:]), styles["H3Newsren"]))
        elif line.startswith("## "):
            flush_paragraph()
            title = line[3:]
            if title.startswith("5. Prototyping"):
                story.append(Spacer(1, 4))
                story.append(architecture_drawing())
                story.append(PageBreak())
            story.append(Paragraph(inline_markup(title), styles["H1Newsren"]))
            problem_next = title.startswith("4. Project problem statement")
        elif line.strip():
            paragraph_lines.append(line)
        else:
            flush_paragraph()
        index += 1
    flush_paragraph()
    flush_list()
    return story


def build_pdf():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = NumberedDocTemplate(
        str(OUTPUT),
        pagesize=letter,
        leftMargin=0.62 * inch,
        rightMargin=0.62 * inch,
        topMargin=0.72 * inch,
        bottomMargin=0.68 * inch,
        title="Newsren Team Project Architecture Design and Technical Feasibility Assessment",
        author="Mohammed Haider Abbas, Ankit Ojha, Nikhil Gaurav",
        subject="49-772 A2 Software Engineering Management, Fall 2026",
    )
    cover_frame = Frame(0.72 * inch, 0.72 * inch, 7.06 * inch, 9.55 * inch, id="cover")
    body_frame = Frame(0.62 * inch, 0.62 * inch, 7.26 * inch, 9.74 * inch, id="body")
    doc.addPageTemplates(
        [
            PageTemplate(id="Cover", frames=[cover_frame], onPage=cover_page),
            PageTemplate(id="Body", frames=[body_frame], onPage=body_page),
        ]
    )

    cover = [Spacer(1, 0.72 * inch)]
    cover.append(Paragraph("THE NEWSREN", ParagraphStyle("CoverBrand", fontName="Helvetica-Bold", fontSize=13, leading=16, textColor=RED, alignment=TA_LEFT, spaceAfter=18)))
    cover.append(Paragraph("Team Project Architecture Design &amp; Technical Feasibility Assessment", ParagraphStyle("CoverTitle", fontName="Helvetica-Bold", fontSize=29, leading=33, textColor=NAVY, alignment=TA_LEFT, spaceAfter=18)))
    cover.append(Paragraph("From a Week 1 evidence-grounded news prototype to a shared, testable team architecture.", ParagraphStyle("CoverDeck", fontName="Helvetica", fontSize=13, leading=19, textColor=MUTED, alignment=TA_LEFT, spaceAfter=28)))
    cover.append(Table([["WEEKS 2-3", "PROBLEM + PROTOTYPE", "PUBLIC-DATA FEASIBILITY"]], colWidths=[1.35 * inch, 2.25 * inch, 2.5 * inch], style=TableStyle([("BACKGROUND", (0,0), (-1,-1), NAVY), ("TEXTCOLOR", (0,0), (-1,-1), colors.white), ("FONTNAME", (0,0), (-1,-1), "Helvetica-Bold"), ("FONTSIZE", (0,0), (-1,-1), 8), ("ALIGN", (0,0), (-1,-1), "CENTER"), ("TOPPADDING", (0,0), (-1,-1), 9), ("BOTTOMPADDING", (0,0), (-1,-1), 9), ("GRID", (0,0), (-1,-1), 0.5, colors.white)])))
    cover.append(Spacer(1, 0.42 * inch))
    team_data = [
        ["Mohammed Haider Abbas", os.environ.get("NEWSREN_HAIDER_EMAIL", "")],
        ["Ankit Ojha", os.environ.get("NEWSREN_ANKIT_EMAIL", "")],
        ["Nikhil Gaurav", os.environ.get("NEWSREN_NIKHIL_EMAIL", "")],
    ]
    cover.append(Paragraph("TEAM", ParagraphStyle("CoverLabel", fontName="Helvetica-Bold", fontSize=8, leading=10, textColor=RED, spaceAfter=7)))
    cover.append(Table([[Paragraph(f"<b>{html.escape(name)}</b>", styles["BodyNewsren"]), Paragraph(email, styles["SmallNewsren"])] for name, email in team_data], colWidths=[2.65 * inch, 3.45 * inch], style=TableStyle([("LINEBELOW", (0,0), (-1,-1), 0.35, LINE_COLOR), ("VALIGN", (0,0), (-1,-1), "MIDDLE"), ("TOPPADDING", (0,0), (-1,-1), 7), ("BOTTOMPADDING", (0,0), (-1,-1), 7)])))
    cover.append(Spacer(1, 0.28 * inch))
    cover.append(Paragraph("49-772 A2 Software Engineering Management<br/>Fall 2026 | Carnegie Mellon University - Silicon Valley<br/><br/><b>Repository</b>: github.com/haider-06418/newsren-agentic-news-portal<br/><b>Assessment date</b>: November 10, 2026", ParagraphStyle("CoverMeta", fontName="Helvetica", fontSize=9.5, leading=15, textColor=INK)))
    cover.append(NextPageTemplate("Body"))
    cover.append(PageBreak())

    markdown = SOURCE.read_text(encoding="utf-8")
    story = cover + markdown_story(markdown)
    doc.build(story)
    print(OUTPUT)


if __name__ == "__main__":
    build_pdf()
