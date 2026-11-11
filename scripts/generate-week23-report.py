from __future__ import annotations

import html
import os
import re
from pathlib import Path

from reportlab.graphics.shapes import Circle, Drawing, Line, Polygon, Rect, String
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

NAVY = HexColor("#102A43")
NAVY_2 = HexColor("#163A5F")
BLUE = HexColor("#245B8A")
RED = HexColor("#B4232A")
PAPER = HexColor("#FAF8F2")
INK = HexColor("#17212B")
MUTED = HexColor("#66717C")
LINE_COLOR = HexColor("#D4D9DE")
LIGHT_BLUE = HexColor("#EAF2F8")
LIGHT_RED = HexColor("#F8E9E8")
LIGHT_GOLD = HexColor("#F2E8CF")
WHITE = HexColor("#FFFFFF")


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
        fontSize=9.35,
        leading=14.1,
        textColor=INK,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="H1Newsren",
        parent=styles["Heading1"],
        fontName="Times-Bold",
        fontSize=22,
        leading=25,
        textColor=NAVY,
        spaceBefore=9,
        spaceAfter=12,
        keepWithNext=True,
    )
)
styles.add(
    ParagraphStyle(
        name="H2Newsren",
        parent=styles["Heading2"],
        fontName="Times-Bold",
        fontSize=15.5,
        leading=19,
        textColor=NAVY,
        spaceBefore=12,
        spaceAfter=7,
        keepWithNext=True,
    )
)
styles.add(
    ParagraphStyle(
        name="H3Newsren",
        parent=styles["Heading3"],
        fontName="Helvetica-Bold",
        fontSize=10.2,
        leading=13,
        textColor=RED,
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True,
    )
)
styles.add(
    ParagraphStyle(
        name="SmallNewsren",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=7.6,
        leading=10.2,
        textColor=MUTED,
    )
)
styles.add(
    ParagraphStyle(
        name="CodeNewsren",
        parent=styles["Code"],
        fontName="Courier",
        fontSize=7.7,
        leading=10.8,
        textColor=NAVY,
        backColor=LIGHT_BLUE,
        borderColor=BLUE,
        borderWidth=0,
        borderPadding=10,
        leftIndent=5,
        spaceBefore=4,
        spaceAfter=10,
    )
)
styles.add(
    ParagraphStyle(
        name="ProblemStatement",
        parent=styles["BodyText"],
        fontName="Times-Roman",
        fontSize=12.2,
        leading=18,
        textColor=NAVY,
        backColor=LIGHT_BLUE,
        borderColor=BLUE,
        borderWidth=0.8,
        borderPadding=14,
        spaceAfter=16,
    )
)
styles.add(
    ParagraphStyle(
        name="ExecutiveSummary",
        parent=styles["BodyText"],
        fontName="Times-Roman",
        fontSize=11,
        leading=16.5,
        textColor=NAVY,
        backColor=LIGHT_GOLD,
        borderColor=HexColor("#D9C59A"),
        borderWidth=0.6,
        borderPadding=13,
        spaceAfter=15,
    )
)
styles.add(
    ParagraphStyle(
        name="SectionNumber",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=14,
        leading=17,
        alignment=TA_CENTER,
        textColor=WHITE,
    )
)
styles.add(
    ParagraphStyle(
        name="SectionTitle",
        parent=styles["BodyText"],
        fontName="Times-Bold",
        fontSize=18,
        leading=21,
        textColor=NAVY,
    )
)
styles.add(
    ParagraphStyle(
        name="WeightPill",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        alignment=TA_CENTER,
        textColor=RED,
    )
)


class NumberedDocTemplate(BaseDocTemplate):
    pass


def cover_page(canvas, doc):
    canvas.saveState()
    width, height = letter
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    canvas.setFillColor(RED)
    canvas.rect(0, 0, 0.12 * inch, height, fill=1, stroke=0)
    canvas.rect(0.12 * inch, height - 0.12 * inch, width - 0.12 * inch, 0.12 * inch, fill=1, stroke=0)
    canvas.setFillColor(NAVY_2)
    canvas.setFont("Helvetica-Bold", 118)
    canvas.drawRightString(width - 0.55 * inch, 0.92 * inch, "02/03")
    canvas.setFont("Helvetica-Bold", 10)
    canvas.setFillColor(WHITE)
    canvas.drawString(0.72 * inch, 0.45 * inch, "THE NEWSREN")
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(HexColor("#B8C6D4"))
    canvas.drawRightString(width - 0.72 * inch, 0.47 * inch, "49-772 A2 | FALL 2026")
    canvas.restoreState()


def body_page(canvas, doc):
    canvas.saveState()
    width, height = letter
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    canvas.setFillColor(NAVY)
    canvas.rect(0, height - 0.14 * inch, width, 0.14 * inch, fill=1, stroke=0)
    canvas.setFillColor(RED)
    canvas.rect(0, height - 0.14 * inch, 1.18 * inch, 0.14 * inch, fill=1, stroke=0)
    canvas.setStrokeColor(LINE_COLOR)
    canvas.line(0.62 * inch, height - 0.63 * inch, width - 0.62 * inch, height - 0.63 * inch)
    canvas.setFont("Helvetica-Bold", 7.5)
    canvas.setFillColor(NAVY)
    canvas.drawString(0.62 * inch, height - 0.47 * inch, "THE NEWSREN / TEAM PROJECT")
    canvas.setFont("Helvetica", 7.2)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(width - 0.62 * inch, height - 0.47 * inch, "WEEKS 02-03 / ARCHITECTURE & FEASIBILITY")
    canvas.line(0.62 * inch, 0.52 * inch, width - 0.62 * inch, 0.52 * inch)
    canvas.drawString(0.62 * inch, 0.32 * inch, "CMU Silicon Valley | Software Engineering Management")
    canvas.setFillColor(RED)
    canvas.circle(width - 0.77 * inch, 0.34 * inch, 0.16 * inch, fill=1, stroke=0)
    canvas.setFillColor(WHITE)
    canvas.setFont("Helvetica-Bold", 7.2)
    canvas.drawCentredString(width - 0.77 * inch, 0.315 * inch, str(doc.page))
    canvas.restoreState()


def architecture_drawing() -> Drawing:
    drawing = Drawing(500, 226)
    drawing.add(Rect(0, 0, 500, 226, rx=8, ry=8, fillColor=HexColor("#F1F5F7"), strokeColor=LINE_COLOR, strokeWidth=0.7))
    drawing.add(Rect(0, 202, 500, 24, rx=8, ry=8, fillColor=NAVY, strokeColor=NAVY))
    drawing.add(String(15, 210, "TARGET ARCHITECTURE / HUMAN-REVIEWED EVIDENCE FLOW", fontName="Helvetica-Bold", fontSize=8, fillColor=WHITE))
    drawing.add(String(18, 184, "SOURCES", fontName="Helvetica-Bold", fontSize=7, fillColor=RED))
    drawing.add(String(188, 184, "EVIDENCE LAYER", fontName="Helvetica-Bold", fontSize=7, fillColor=RED))
    drawing.add(String(354, 184, "DECISION LAYER", fontName="Helvetica-Bold", fontSize=7, fillColor=RED))
    boxes = [
        (18, 135, 130, 32, "Federal Register API", LIGHT_BLUE),
        (18, 92, 130, 32, "Agency guidance", LIGHT_BLUE),
        (18, 49, 130, 32, "Controlled media corpus", LIGHT_RED),
        (185, 118, 128, 38, "Canonical document schema", WHITE),
        (185, 56, 128, 38, "Entity + temporal matching", WHITE),
        (351, 118, 130, 38, "Claim-level evidence bundle", WHITE),
        (351, 56, 130, 38, "Bounded agent + validator", WHITE),
        (351, 10, 130, 28, "Human editorial review", LIGHT_RED),
    ]
    for x, y, w, h, label, fill in boxes:
        drawing.add(Rect(x, y, w, h, rx=5, ry=5, fillColor=fill, strokeColor=BLUE, strokeWidth=0.9))
        drawing.add(String(x + w / 2, y + h / 2 - 3, label, fontName="Helvetica-Bold", fontSize=6.8, textAnchor="middle", fillColor=NAVY))

    def arrow(x1, y1, x2, y2):
        drawing.add(Line(x1, y1, x2, y2, strokeColor=MUTED, strokeWidth=1))
        drawing.add(Polygon([x2, y2, x2 - 6, y2 + 3, x2 - 6, y2 - 3], fillColor=MUTED, strokeColor=MUTED))

    arrow(148, 151, 185, 137)
    arrow(148, 108, 185, 137)
    arrow(148, 65, 185, 75)
    arrow(249, 118, 249, 94)
    arrow(313, 75, 351, 137)
    arrow(416, 118, 416, 94)
    arrow(416, 56, 416, 38)
    return drawing


def ownership_drawing() -> Drawing:
    drawing = Drawing(500, 98)
    drawing.add(Rect(0, 0, 500, 98, rx=8, ry=8, fillColor=LIGHT_BLUE, strokeColor=LINE_COLOR, strokeWidth=0.6))
    drawing.add(String(16, 78, "EQUAL RESPONSIBILITY TARGET / 33.3% EACH", fontName="Helvetica-Bold", fontSize=7.5, fillColor=RED))
    cards = [
        (16, "MOHAMMED", "Integration + architecture"),
        (177, "ANKIT", "Data access + quality"),
        (338, "NIKHIL", "Retrieval + evaluation"),
    ]
    for x, name, role in cards:
        drawing.add(Rect(x, 16, 146, 46, rx=5, ry=5, fillColor=WHITE, strokeColor=BLUE, strokeWidth=0.7))
        drawing.add(Circle(x + 18, 39, 10, fillColor=NAVY, strokeColor=NAVY))
        drawing.add(String(x + 18, 36.5, name[0], fontName="Helvetica-Bold", fontSize=7.5, textAnchor="middle", fillColor=WHITE))
        drawing.add(String(x + 35, 43, name, fontName="Helvetica-Bold", fontSize=7.2, fillColor=NAVY))
        drawing.add(String(x + 35, 28, role, fontName="Helvetica", fontSize=6.8, fillColor=MUTED))
    return drawing


def extension_drawing() -> Drawing:
    drawing = Drawing(500, 106)
    drawing.add(Rect(0, 0, 500, 106, rx=8, ry=8, fillColor=NAVY, strokeColor=NAVY))
    drawing.add(String(16, 85, "FROM INDIVIDUAL PROTOTYPE TO TEAM PROJECT", fontName="Helvetica-Bold", fontSize=7.5, fillColor=HexColor("#D4E0EA")))
    stages = [
        (16, 24, 126, 42, "WEEK 1 BASELINE", "Evidence-led product"),
        (188, 24, 126, 42, "TEAM EXTENSION", "Multi-source + schema"),
        (358, 24, 126, 42, "FEASIBILITY PROOF", "Evaluation + risks"),
    ]
    for x, y, w, h, label, detail in stages:
        drawing.add(Rect(x, y, w, h, rx=5, ry=5, fillColor=NAVY_2, strokeColor=HexColor("#54718C"), strokeWidth=0.7))
        drawing.add(String(x + 10, y + 25, label, fontName="Helvetica-Bold", fontSize=7.2, fillColor=WHITE))
        drawing.add(String(x + 10, y + 11, detail, fontName="Helvetica", fontSize=6.8, fillColor=HexColor("#C5D2DE")))
    drawing.add(Line(142, 45, 188, 45, strokeColor=RED, strokeWidth=1.5))
    drawing.add(Polygon([188, 45, 181, 49, 181, 41], fillColor=RED, strokeColor=RED))
    drawing.add(Line(314, 45, 358, 45, strokeColor=RED, strokeWidth=1.5))
    drawing.add(Polygon([358, 45, 351, 49, 351, 41], fillColor=RED, strokeColor=RED))
    return drawing


def section_banner(title: str) -> Table | Paragraph:
    match = re.match(r"^(\d+)\.\s*(.*?)(?:\s+\((\d+%)\))?$", title)
    if not match:
        return Paragraph(inline_markup(title), styles["H1Newsren"])
    number, label, weight = match.groups()
    data = [[
        Paragraph(number.zfill(2), styles["SectionNumber"]),
        Paragraph(inline_markup(label), styles["SectionTitle"]),
        Paragraph(weight or "", styles["WeightPill"]),
    ]]
    banner = Table(data, colWidths=[0.54 * inch, 5.86 * inch, 0.72 * inch], hAlign="LEFT")
    banner.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, 0), RED),
        ("BACKGROUND", (2, 0), (2, 0), LIGHT_RED),
        ("BOX", (2, 0), (2, 0), 0.5, HexColor("#E7BFC0")),
        ("LINEBELOW", (1, 0), (1, 0), 0.8, NAVY),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (0, 0), 2),
        ("RIGHTPADDING", (0, 0), (0, 0), 2),
        ("LEFTPADDING", (1, 0), (1, 0), 10),
        ("RIGHTPADDING", (1, 0), (1, 0), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return banner


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
                ("LINEBELOW", (0, 0), (-1, 0), 1.2, RED),
                ("LINEBELOW", (0, 1), (-1, -1), 0.35, LINE_COLOR),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, HexColor("#F2F5F7")]),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    if rows and rows[0] and rows[0][0].getPlainText() == "Method":
        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 2), (-1, 2), LIGHT_BLUE),
            ("FONTNAME", (0, 2), (-1, 2), "Helvetica-Bold"),
            ("TEXTCOLOR", (1, 2), (-1, 2), BLUE),
        ]))
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
    executive_next = False
    current_section = ""

    def flush_paragraph():
        nonlocal paragraph_lines, problem_next, executive_next
        if paragraph_lines:
            text = " ".join(line.strip() for line in paragraph_lines)
            if problem_next:
                story.append(Paragraph("WORKING PROBLEM STATEMENT", ParagraphStyle("ProblemKicker", parent=styles["SmallNewsren"], fontName="Helvetica-Bold", fontSize=7.5, textColor=RED, spaceAfter=4)))
                story.append(Spacer(1, 7))
                style = styles["ProblemStatement"]
            elif executive_next:
                style = styles["ExecutiveSummary"]
            else:
                style = styles["BodyNewsren"]
            story.append(Paragraph(inline_markup(text), style))
            paragraph_lines = []
            problem_next = False
            executive_next = False

    def flush_list():
        nonlocal list_lines, current_section
        if list_lines:
            ordered = bool(re.match(r"^\d+\.\s", list_lines[0]))
            values = [re.sub(r"^(?:[-*]|\d+\.)\s+", "", item) for item in list_lines]
            if current_section.startswith("3."):
                card_style = ParagraphStyle(
                    "PromotedCard",
                    parent=styles["SmallNewsren"],
                    fontName="Helvetica",
                    fontSize=8.1,
                    leading=11.2,
                    textColor=NAVY,
                )
                cells = [
                    Paragraph(f"<font color='#B4232A'><b>{position:02d}</b></font>&nbsp;&nbsp;{inline_markup(value)}", card_style)
                    for position, value in enumerate(values, start=1)
                ]
                rows = [cells[position:position + 2] for position in range(0, len(cells), 2)]
                if len(rows[-1]) == 1:
                    rows[-1].append("")
                grid = Table(rows, colWidths=[3.48 * inch, 3.48 * inch], hAlign="LEFT")
                grid.setStyle(TableStyle([
                    ("BACKGROUND", (0, 0), (-1, -1), LIGHT_BLUE),
                    ("BOX", (0, 0), (-1, -1), 0.4, HexColor("#C5D7E5")),
                    ("INNERGRID", (0, 0), (-1, -1), 3, PAPER),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 9),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                    ("TOPPADDING", (0, 0), (-1, -1), 9),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
                ]))
                story.append(grid)
                story.append(Spacer(1, 8))
                list_lines = []
                return
            rows = []
            for position, value in enumerate(values, start=1):
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
            if title.startswith("3. Individual work"):
                story.append(Spacer(1, 6))
                story.append(ownership_drawing())
                story.append(PageBreak())
            if title.startswith("4. Project problem statement"):
                story.append(Spacer(1, 10))
                story.append(extension_drawing())
                story.append(PageBreak())
            if title.startswith("5. Prototyping"):
                story.append(Spacer(1, 4))
                story.append(architecture_drawing())
                story.append(PageBreak())
            story.append(section_banner(title))
            story.append(Spacer(1, 8))
            current_section = title
            problem_next = title.startswith("4. Project problem statement")
            executive_next = title == "Executive summary"
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
        topMargin=0.78 * inch,
        bottomMargin=0.68 * inch,
        title="Newsren Team Project Architecture Design and Technical Feasibility Assessment",
        author="Mohammed Haider Abbas, Ankit Ojha, Nikhil Gaurav",
        subject="49-772 A2 Software Engineering Management, Fall 2026",
    )
    cover_frame = Frame(0.72 * inch, 0.72 * inch, 7.06 * inch, 9.55 * inch, id="cover")
    body_frame = Frame(0.62 * inch, 0.62 * inch, 7.26 * inch, 9.58 * inch, id="body")
    doc.addPageTemplates(
        [
            PageTemplate(id="Cover", frames=[cover_frame], onPage=cover_page),
            PageTemplate(id="Body", frames=[body_frame], onPage=body_page),
        ]
    )

    cover = [Spacer(1, 0.48 * inch)]
    cover.append(Paragraph("THE NEWSREN / TEAM PROJECT", ParagraphStyle("CoverBrand", fontName="Helvetica-Bold", fontSize=10, leading=13, textColor=HexColor("#D4E0EA"), alignment=TA_LEFT, spaceAfter=20, tracking=1.4)))
    cover.append(Paragraph("Architecture Design<br/>&amp; Technical Feasibility", ParagraphStyle("CoverTitle", fontName="Times-Bold", fontSize=34, leading=36, textColor=WHITE, alignment=TA_LEFT, spaceAfter=17)))
    cover.append(Paragraph("A bounded, evidence-grounded approach to agentic news synthesis for evolving international-student policy.", ParagraphStyle("CoverDeck", fontName="Helvetica", fontSize=12.5, leading=18.5, textColor=HexColor("#C5D2DE"), alignment=TA_LEFT, spaceAfter=23)))
    cover.append(Table([["WEEKS 02-03", "40% PROBLEM", "40% PROTOTYPE"]], colWidths=[1.6 * inch, 1.75 * inch, 1.85 * inch], style=TableStyle([("BACKGROUND", (0,0), (0,-1), RED), ("BACKGROUND", (1,0), (-1,-1), NAVY_2), ("TEXTCOLOR", (0,0), (-1,-1), WHITE), ("FONTNAME", (0,0), (-1,-1), "Helvetica-Bold"), ("FONTSIZE", (0,0), (-1,-1), 8), ("ALIGN", (0,0), (-1,-1), "CENTER"), ("TOPPADDING", (0,0), (-1,-1), 9), ("BOTTOMPADDING", (0,0), (-1,-1), 9), ("LINEAFTER", (0,0), (1,-1), 0.5, HexColor("#6E8499"))])))
    cover.append(Spacer(1, 0.34 * inch))
    team_data = [
        ["Mohammed Haider Abbas", os.environ.get("NEWSREN_HAIDER_EMAIL", "")],
        ["Ankit Ojha", os.environ.get("NEWSREN_ANKIT_EMAIL", "")],
        ["Nikhil Gaurav", os.environ.get("NEWSREN_NIKHIL_EMAIL", "")],
    ]
    cover.append(Paragraph("PROJECT TEAM", ParagraphStyle("CoverLabel", fontName="Helvetica-Bold", fontSize=7.5, leading=10, textColor=RED, spaceAfter=7)))
    cover_name = ParagraphStyle("CoverName", parent=styles["BodyNewsren"], fontName="Helvetica-Bold", fontSize=9, textColor=WHITE)
    cover_email = ParagraphStyle("CoverEmail", parent=styles["SmallNewsren"], fontSize=7.5, textColor=HexColor("#B8C6D4"))
    cover.append(Table([[Paragraph(html.escape(name), cover_name), Paragraph(email, cover_email)] for name, email in team_data], colWidths=[2.65 * inch, 3.45 * inch], style=TableStyle([("LINEBELOW", (0,0), (-1,-1), 0.35, HexColor("#3B5670")), ("VALIGN", (0,0), (-1,-1), "MIDDLE"), ("TOPPADDING", (0,0), (-1,-1), 7), ("BOTTOMPADDING", (0,0), (-1,-1), 7), ("LEFTPADDING", (0,0), (-1,-1), 0)])))
    cover.append(Spacer(1, 0.28 * inch))
    cover.append(Paragraph("49-772 A2 SOFTWARE ENGINEERING MANAGEMENT", ParagraphStyle("CoverCourse", fontName="Helvetica-Bold", fontSize=8.5, leading=12, textColor=WHITE, spaceAfter=5)))
    cover.append(Paragraph("Fall 2026 / Carnegie Mellon University - Silicon Valley<br/>github.com/haider-06418/newsren-agentic-news-portal<br/>Assessment date: November 10, 2026", ParagraphStyle("CoverMeta", fontName="Helvetica", fontSize=8.5, leading=14, textColor=HexColor("#B8C6D4"))))
    cover.append(NextPageTemplate("Body"))
    cover.append(PageBreak())

    markdown = SOURCE.read_text(encoding="utf-8")
    story = cover + markdown_story(markdown)
    doc.build(story)
    print(OUTPUT)


if __name__ == "__main__":
    build_pdf()
