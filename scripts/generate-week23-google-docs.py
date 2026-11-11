#!/usr/bin/env python3
"""Build an editable, Google Docs-friendly DOCX from the approved report Markdown."""

from __future__ import annotations

import re
import sys
from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK, WD_LINE_SPACING
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "week-2-3" / "REPORT.md"

NAVY = "102A43"
RED = "C62828"
PALE_BLUE = "F1F6FA"
PALE_GRAY = "F7F8FA"
MID_GRAY = "5F6B76"
LIGHT_GRAY = "D9D9D9"
BLACK = "000000"
WHITE = "FFFFFF"


def set_repeat_table_header(row) -> None:
    tr_pr = row._tr.get_or_add_trPr()
    tbl_header = OxmlElement("w:tblHeader")
    tbl_header.set(qn("w:val"), "true")
    tr_pr.append(tbl_header)


def set_cell_fill(cell, color: str) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), color)


def set_cell_margins(cell, top=100, start=120, bottom=100, end=120) -> None:
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for margin_name, margin_value in (
        ("top", top),
        ("start", start),
        ("bottom", bottom),
        ("end", end),
    ):
        node = tc_mar.find(qn(f"w:{margin_name}"))
        if node is None:
            node = OxmlElement(f"w:{margin_name}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(margin_value))
        node.set(qn("w:type"), "dxa")


def set_table_borders(table, color=LIGHT_GRAY, size="6") -> None:
    tbl_pr = table._tbl.tblPr
    borders = tbl_pr.first_child_found_in("w:tblBorders")
    if borders is None:
        borders = OxmlElement("w:tblBorders")
        tbl_pr.append(borders)
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        tag = f"w:{edge}"
        element = borders.find(qn(tag))
        if element is None:
            element = OxmlElement(tag)
            borders.append(element)
        element.set(qn("w:val"), "single")
        element.set(qn("w:sz"), size)
        element.set(qn("w:space"), "0")
        element.set(qn("w:color"), color)


def set_cell_width(cell, width_inches: float) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_w = tc_pr.find(qn("w:tcW"))
    if tc_w is None:
        tc_w = OxmlElement("w:tcW")
        tc_pr.append(tc_w)
    tc_w.set(qn("w:w"), str(int(width_inches * 1440)))
    tc_w.set(qn("w:type"), "dxa")


def set_run_font(run, name: str, size: float | None = None) -> None:
    run.font.name = name
    run._element.get_or_add_rPr().get_or_add_rFonts().set(qn("w:ascii"), name)
    run._element.get_or_add_rPr().get_or_add_rFonts().set(qn("w:hAnsi"), name)
    if size is not None:
        run.font.size = Pt(size)


def add_hyperlink(paragraph, text: str, url: str, color=NAVY) -> None:
    relationship_id = paragraph.part.relate_to(
        url,
        "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",
        is_external=True,
    )
    hyperlink = OxmlElement("w:hyperlink")
    hyperlink.set(qn("r:id"), relationship_id)
    run = OxmlElement("w:r")
    run_pr = OxmlElement("w:rPr")
    run_color = OxmlElement("w:color")
    run_color.set(qn("w:val"), color)
    underline = OxmlElement("w:u")
    underline.set(qn("w:val"), "single")
    run_pr.extend([run_color, underline])
    run.append(run_pr)
    text_node = OxmlElement("w:t")
    text_node.text = text
    run.append(text_node)
    hyperlink.append(run)
    paragraph._p.append(hyperlink)


INLINE_TOKEN = re.compile(r"(\*\*[^*]+\*\*|`[^`]+`|https?://[^\s)]+)")


def add_inline(paragraph, text: str, default_size: float = 10.8) -> None:
    position = 0
    for match in INLINE_TOKEN.finditer(text):
        if match.start() > position:
            run = paragraph.add_run(text[position : match.start()])
            set_run_font(run, "Aptos", default_size)
        token = match.group(0)
        if token.startswith("**"):
            run = paragraph.add_run(token[2:-2])
            set_run_font(run, "Aptos", default_size)
            run.bold = True
        elif token.startswith("`"):
            run = paragraph.add_run(token[1:-1])
            set_run_font(run, "Aptos Mono", default_size - 0.4)
            run.font.color.rgb = RGBColor.from_string(NAVY)
        else:
            add_hyperlink(paragraph, token, token)
        position = match.end()
    if position < len(text):
        run = paragraph.add_run(text[position:])
        set_run_font(run, "Aptos", default_size)


def shade_paragraph(paragraph, fill: str) -> None:
    p_pr = paragraph._p.get_or_add_pPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), fill)
    p_pr.append(shd)


def add_page_number(paragraph) -> None:
    paragraph.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run = paragraph.add_run("NEWSREN   |   ")
    set_run_font(run, "Aptos", 8.5)
    run.font.color.rgb = RGBColor.from_string(MID_GRAY)
    begin_run = OxmlElement("w:r")
    fld_begin = OxmlElement("w:fldChar")
    fld_begin.set(qn("w:fldCharType"), "begin")
    begin_run.append(fld_begin)
    instruction_run = OxmlElement("w:r")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = " PAGE "
    instruction_run.append(instr)
    separator_run = OxmlElement("w:r")
    fld_sep = OxmlElement("w:fldChar")
    fld_sep.set(qn("w:fldCharType"), "separate")
    separator_run.append(fld_sep)
    result_run = OxmlElement("w:r")
    text = OxmlElement("w:t")
    text.text = "1"
    result_run.append(text)
    end_run = OxmlElement("w:r")
    fld_end = OxmlElement("w:fldChar")
    fld_end.set(qn("w:fldCharType"), "end")
    end_run.append(fld_end)
    paragraph._p.extend([begin_run, instruction_run, separator_run, result_run, end_run])


def configure_document(doc: Document) -> None:
    section = doc.sections[0]
    section.page_width = Inches(8.5)
    section.page_height = Inches(11)
    section.top_margin = Inches(0.72)
    section.bottom_margin = Inches(0.7)
    section.left_margin = Inches(0.8)
    section.right_margin = Inches(0.8)
    section.header_distance = Inches(0.3)
    section.footer_distance = Inches(0.35)

    normal = doc.styles["Normal"]
    normal.font.name = "Aptos"
    normal._element.rPr.rFonts.set(qn("w:ascii"), "Aptos")
    normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Aptos")
    normal.font.size = Pt(10.8)
    normal.font.color.rgb = RGBColor.from_string(BLACK)
    normal.paragraph_format.space_after = Pt(6)
    normal.paragraph_format.line_spacing = 1.13

    title = doc.styles["Title"]
    title.font.name = "Aptos Display"
    title._element.rPr.rFonts.set(qn("w:ascii"), "Aptos Display")
    title._element.rPr.rFonts.set(qn("w:hAnsi"), "Aptos Display")
    title.font.size = Pt(32)
    title.font.bold = True
    title.font.color.rgb = RGBColor.from_string(BLACK)
    title.paragraph_format.space_after = Pt(12)

    for name, size, before, after in (
        ("Heading 1", 19, 13, 7),
        ("Heading 2", 14, 10, 5),
        ("Heading 3", 11.5, 8, 4),
    ):
        style = doc.styles[name]
        style.font.name = "Aptos Display"
        style._element.rPr.rFonts.set(qn("w:ascii"), "Aptos Display")
        style._element.rPr.rFonts.set(qn("w:hAnsi"), "Aptos Display")
        style.font.size = Pt(size)
        style.font.bold = True
        style.font.color.rgb = RGBColor.from_string(BLACK)
        style.paragraph_format.space_before = Pt(before)
        style.paragraph_format.space_after = Pt(after)
        style.paragraph_format.keep_with_next = True

    for section in doc.sections:
        add_page_number(section.footer.paragraphs[0])


def add_cover(doc: Document, metadata: dict[str, str]) -> None:
    kicker = doc.add_paragraph()
    kicker.paragraph_format.space_before = Pt(18)
    kicker.paragraph_format.space_after = Pt(28)
    run = kicker.add_run("NEWSREN   •   COURSE PROJECT EXTENSION")
    set_run_font(run, "Aptos", 10)
    run.bold = True
    run.font.color.rgb = RGBColor.from_string(RED)

    title = doc.add_paragraph(style="Title")
    title.add_run("Architecture Design and Technical Feasibility Assessment")

    subtitle = doc.add_paragraph()
    subtitle.paragraph_format.space_after = Pt(28)
    run = subtitle.add_run("Weeks 2 and 3 Team Deliverable")
    set_run_font(run, "Aptos Display", 16)
    run.font.color.rgb = RGBColor.from_string(MID_GRAY)

    intro = doc.add_paragraph()
    intro.paragraph_format.space_after = Pt(24)
    add_inline(
        intro,
        "An evidence-grounded architecture and feasibility assessment for synthesizing evolving international-student policy news while preserving provenance, time, disagreement and uncertainty.",
        12,
    )

    table = doc.add_table(rows=1, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.LEFT
    table.autofit = False
    header = table.rows[0].cells[0].merge(table.rows[0].cells[1])
    set_cell_fill(header, NAVY)
    set_cell_margins(header, 80, 110, 80, 110)
    header_paragraph = header.paragraphs[0]
    header_paragraph.paragraph_format.space_after = Pt(0)
    header_run = header_paragraph.add_run("Document information")
    set_run_font(header_run, "Aptos", 9)
    header_run.bold = True
    header_run.font.color.rgb = RGBColor.from_string(WHITE)
    set_repeat_table_header(table.rows[0])
    rows = [
        ("Course", metadata.get("Course", "")),
        ("Institution", metadata.get("Institution", "")),
        ("Team", metadata.get("Team", "")),
        ("Assessment date", metadata.get("Assessment date", "")),
        ("Repository", metadata.get("Repository", "")),
    ]
    for index, (label, value) in enumerate(rows):
        cells = table.add_row().cells
        set_cell_width(cells[0], 1.35)
        set_cell_width(cells[1], 5.55)
        for cell in cells:
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            set_cell_margins(cell, 90, 110, 90, 110)
            set_cell_fill(cell, PALE_BLUE if index % 2 == 0 else WHITE)
        p0 = cells[0].paragraphs[0]
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(label)
        set_run_font(r0, "Aptos", 9.2)
        r0.bold = True
        r0.font.color.rgb = RGBColor.from_string(NAVY)
        p1 = cells[1].paragraphs[0]
        p1.paragraph_format.space_after = Pt(0)
        if value.startswith("http"):
            add_hyperlink(p1, "Open the Newsren repository", value)
        else:
            r1 = p1.add_run(value)
            set_run_font(r1, "Aptos", 9.5)
    set_table_borders(table)

    note = doc.add_paragraph()
    note.paragraph_format.space_before = Pt(28)
    note.paragraph_format.space_after = Pt(0)
    run = note.add_run("Carnegie Mellon University Silicon Valley")
    set_run_font(run, "Aptos", 9.5)
    run.bold = True
    run.font.color.rgb = RGBColor.from_string(NAVY)
    doc.add_page_break()


def add_section_header(doc: Document, text: str) -> None:
    paragraph = doc.add_paragraph(style="Heading 1")
    match = re.match(r"(\d+\.)\s+(.+?)(\s+\(\d+%\))?$", text)
    if match:
        number, label, weight = match.groups()
        run = paragraph.add_run(f"{number} {label}")
        set_run_font(run, "Aptos Display", 19)
        run.bold = True
        if weight:
            weight_run = paragraph.add_run(weight)
            set_run_font(weight_run, "Aptos", 10)
            weight_run.bold = True
            weight_run.font.color.rgb = RGBColor.from_string(RED)
    else:
        run = paragraph.add_run(text)
        set_run_font(run, "Aptos Display", 19)
        run.bold = True


def add_body_paragraph(doc: Document, text: str, style: str | None = None) -> None:
    paragraph = doc.add_paragraph(style=style)
    add_inline(paragraph, text)


def add_markdown_table(doc: Document, rows: list[list[str]]) -> None:
    if not rows:
        return
    table = doc.add_table(rows=1, cols=len(rows[0]))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = True
    set_table_borders(table)
    for column_index, header in enumerate(rows[0]):
        cell = table.rows[0].cells[column_index]
        set_cell_fill(cell, NAVY)
        set_cell_margins(cell)
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        paragraph = cell.paragraphs[0]
        paragraph.paragraph_format.space_after = Pt(0)
        run = paragraph.add_run(header)
        set_run_font(run, "Aptos", 9)
        run.bold = True
        run.font.color.rgb = RGBColor.from_string(WHITE)
    set_repeat_table_header(table.rows[0])

    for row_index, row_data in enumerate(rows[1:]):
        cells = table.add_row().cells
        for column_index, value in enumerate(row_data):
            cell = cells[column_index]
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            set_cell_margins(cell)
            set_cell_fill(cell, PALE_BLUE if row_index % 2 else WHITE)
            paragraph = cell.paragraphs[0]
            paragraph.paragraph_format.space_after = Pt(0)
            paragraph.paragraph_format.line_spacing = 1.05
            if re.fullmatch(r"\d+\.\d{3}", value):
                paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
            add_inline(paragraph, value, 8.8)
    spacer = doc.add_paragraph()
    spacer.paragraph_format.space_after = Pt(2)


def add_responsibility_matrix(doc: Document) -> None:
    heading = doc.add_paragraph(style="Heading 2")
    heading.add_run("Equal ownership plan")
    rows = [
        ["Team member", "Primary ownership", "Secondary ownership", "Target"],
        [
            "Mohammed Haider Abbas",
            "Product integration, architecture, repository and deployment",
            "Dataset integration review and report assembly",
            "33.3%",
        ],
        [
            "Ankit Ojha",
            "Dataset discovery, access validation, normalization and quality",
            "Ingestion and architecture review",
            "33.3%",
        ],
        [
            "Nikhil Gaurav",
            "Retrieval experiment, evaluation and technical-risk analysis",
            "Validation code and findings review",
            "33.3%",
        ],
    ]
    add_markdown_table(doc, rows)


def add_architecture_flow(doc: Document) -> None:
    heading = doc.add_paragraph(style="Heading 2")
    heading.add_run("Architecture at a glance")
    rows = [
        ["Stage", "System responsibility", "Control"],
        ["1  Sources", "Federal Register, agency guidance and optional media", "Public and attributable"],
        ["2  Normalize", "Source adapters populate the canonical document schema", "Dates and provenance preserved"],
        ["3  Match", "Keyword, TF-IDF and structured features generate candidates", "Similarity is not event identity"],
        ["4  Synthesize", "The agent selects validated evidence and claim IDs", "Unknown or altered claims rejected"],
        ["5  Publish", "Human review produces the story and Ask Newsren context", "High-impact policy claims reviewed"],
    ]
    add_markdown_table(doc, rows)


def add_promotion_path(doc: Document) -> None:
    heading = doc.add_paragraph(style="Heading 2")
    heading.add_run("From individual prototype to team feasibility proof")
    rows = [
        ["Project layer", "Promoted value", "Team extension"],
        ["Week 1 foundation", "Evidence map, cited claims and deterministic demo", "Selected as the shared baseline"],
        ["Team architecture", "Canonical schema, source adapters and validation", "Adds multi-dataset integration"],
        ["Feasibility proof", "Labeled pairs, retrieval metrics and risk evidence", "Tests the highest-risk assumptions"],
    ]
    add_markdown_table(doc, rows)


def add_code_block(doc: Document, lines: list[str]) -> None:
    paragraph = doc.add_paragraph()
    paragraph.paragraph_format.left_indent = Inches(0.25)
    paragraph.paragraph_format.right_indent = Inches(0.25)
    paragraph.paragraph_format.space_before = Pt(4)
    paragraph.paragraph_format.space_after = Pt(8)
    paragraph.paragraph_format.line_spacing = 1.0
    shade_paragraph(paragraph, PALE_GRAY)
    for index, line in enumerate(lines):
        run = paragraph.add_run(line)
        set_run_font(run, "Aptos Mono", 9.2)
        run.font.color.rgb = RGBColor.from_string(NAVY)
        if index < len(lines) - 1:
            run.add_break()


def parse_source(doc: Document, source_text: str) -> None:
    lines = source_text.splitlines()
    metadata: dict[str, str] = {}
    start = 0
    for index, line in enumerate(lines):
        if line.startswith("**") and ":**" in line:
            match = re.match(r"\*\*(.+?):\*\*\s*(.+?)(?:\s{2})?$", line)
            if match:
                metadata[match.group(1)] = match.group(2)
        if line.startswith("## Executive summary"):
            start = index
            break
    add_cover(doc, metadata)

    page_break_before = {
        "2. Pair programming and knowledge transfer (5%)",
        "4. Project problem statement (40%)",
        "5. Prototyping and technical feasibility (40%)",
        "Architecture decision",
        "References",
    }
    responsibility_added = False
    architecture_added = False
    current_section = ""
    index = start
    while index < len(lines):
        raw = lines[index]
        stripped = raw.strip()
        if not stripped:
            index += 1
            continue

        if stripped.startswith("## "):
            heading_text = stripped[3:]
            if heading_text in page_break_before and doc.paragraphs:
                doc.add_page_break()
            current_section = heading_text
            add_section_header(doc, heading_text)
            if heading_text == "Architecture decision" and not architecture_added:
                add_architecture_flow(doc)
                architecture_added = True
            index += 1
            continue

        if stripped.startswith("### "):
            heading = doc.add_paragraph(style="Heading 2")
            heading.add_run(stripped[4:])
            index += 1
            continue

        if stripped.startswith("```"):
            code_lines: list[str] = []
            index += 1
            while index < len(lines) and not lines[index].strip().startswith("```"):
                code_lines.append(lines[index])
                index += 1
            add_code_block(doc, code_lines)
            index += 1
            continue

        if stripped.startswith("|"):
            table_lines: list[str] = []
            while index < len(lines) and lines[index].strip().startswith("|"):
                table_lines.append(lines[index].strip())
                index += 1
            parsed_rows: list[list[str]] = []
            for line in table_lines:
                values = [value.strip() for value in line.strip("|").split("|")]
                if all(re.fullmatch(r":?-{3,}:?", value) for value in values):
                    continue
                parsed_rows.append(values)
            add_markdown_table(doc, parsed_rows)
            continue

        list_match = re.match(r"^(\d+)\.\s+(.+)$", stripped)
        bullet_match = re.match(r"^-\s+(.+)$", stripped)
        if list_match or bullet_match:
            paragraph = doc.add_paragraph()
            paragraph.paragraph_format.left_indent = Inches(0.28)
            paragraph.paragraph_format.first_line_indent = Inches(-0.2)
            paragraph.paragraph_format.space_after = Pt(3.5)
            marker = f"{list_match.group(1)}. " if list_match else "•  "
            run = paragraph.add_run(marker)
            set_run_font(run, "Aptos", 10.5)
            run.bold = True
            run.font.color.rgb = RGBColor.from_string(RED if list_match else NAVY)
            item_text = list_match.group(2) if list_match else bullet_match.group(1)
            add_inline(paragraph, item_text, 10.5)
            index += 1
            continue

        paragraph_lines = [stripped]
        index += 1
        while index < len(lines):
            candidate = lines[index].strip()
            if (
                not candidate
                or candidate.startswith("#")
                or candidate.startswith("|")
                or candidate.startswith("```")
                or candidate.startswith("- ")
                or re.match(r"^\d+\.\s+", candidate)
            ):
                break
            paragraph_lines.append(candidate)
            index += 1
        text = " ".join(paragraph_lines)
        if text.startswith("Word count:"):
            paragraph = doc.add_paragraph()
            paragraph.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            run = paragraph.add_run(text)
            set_run_font(run, "Aptos", 8.5)
            run.italic = True
            run.font.color.rgb = RGBColor.from_string(MID_GRAY)
        else:
            add_body_paragraph(doc, text)
        if text.startswith("The team-level extension is not another UI redesign"):
            add_promotion_path(doc)
        if current_section.startswith("1. Individual responsibility") and not responsibility_added:
            add_responsibility_matrix(doc)
            responsibility_added = True


def finalize_sections(doc: Document) -> None:
    for section in doc.sections:
        section.page_width = Inches(8.5)
        section.page_height = Inches(11)
        section.top_margin = Inches(0.72)
        section.bottom_margin = Inches(0.7)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)
        section.header_distance = Inches(0.3)
        section.footer_distance = Inches(0.35)
        if not section.footer.paragraphs[0].text and len(section.footer.paragraphs[0]._p) == 0:
            add_page_number(section.footer.paragraphs[0])


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: generate-week23-google-docs.py OUTPUT.docx", file=sys.stderr)
        return 2
    output = Path(sys.argv[1]).resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    source_text = SOURCE.read_text(encoding="utf-8")
    doc = Document()
    configure_document(doc)
    parse_source(doc, source_text)
    finalize_sections(doc)
    doc.core_properties.title = "Newsren Architecture Design and Technical Feasibility Assessment"
    doc.core_properties.subject = "Weeks 2 and 3 team project deliverable"
    doc.core_properties.author = "Mohammed Haider Abbas, Ankit Ojha, Nikhil Gaurav"
    doc.core_properties.keywords = "Newsren, software engineering management, architecture, feasibility"
    doc.save(output)
    print(output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
