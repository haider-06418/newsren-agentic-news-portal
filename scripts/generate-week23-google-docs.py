#!/usr/bin/env python3
"""Generate a high-fidelity editable DOCX counterpart to the approved PDF report."""

from __future__ import annotations

import os
import sys
from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_ROW_HEIGHT_RULE, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


NAVY = "102D46"
NAVY_2 = "1D466C"
RED = "C6232A"
PALE_RED = "FAE8E8"
PALE_BLUE = "EAF3F9"
PALE_BLUE_2 = "F2F6F8"
GOLD = "F4E9C9"
GOLD_BORDER = "D6BB77"
CREAM = "FBFAF6"
SLATE = "5F6E7B"
LINE = "C9D7E1"
WHITE = "FFFFFF"
BLACK = "17212A"


def set_font(run, name="Arial", size=10.5, color=BLACK, bold=False, italic=False):
    run.font.name = name
    r_pr = run._element.get_or_add_rPr()
    r_fonts = r_pr.get_or_add_rFonts()
    r_fonts.set(qn("w:ascii"), name)
    r_fonts.set(qn("w:hAnsi"), name)
    run.font.size = Pt(size)
    run.font.color.rgb = RGBColor.from_string(color)
    run.bold = bold
    run.italic = italic
    return run


def shade_cell(cell, color):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), color)


def cell_margins(cell, top=90, start=110, bottom=90, end=110):
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for side, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = tc_mar.find(qn(f"w:{side}"))
        if node is None:
            node = OxmlElement(f"w:{side}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(value))
        node.set(qn("w:type"), "dxa")


def set_cell_width(cell, inches):
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_w = tc_pr.find(qn("w:tcW"))
    if tc_w is None:
        tc_w = OxmlElement("w:tcW")
        tc_pr.append(tc_w)
    tc_w.set(qn("w:w"), str(int(inches * 1440)))
    tc_w.set(qn("w:type"), "dxa")


def set_table_widths(table, widths):
    table.autofit = False
    for index, width in enumerate(widths):
        table.columns[index].width = Inches(width)
        for row in table.rows:
            set_cell_width(row.cells[index], width)


def table_borders(table, color=LINE, size="6", top=None, bottom=None, left=None, right=None):
    tbl_pr = table._tbl.tblPr
    borders = tbl_pr.first_child_found_in("w:tblBorders")
    if borders is None:
        borders = OxmlElement("w:tblBorders")
        tbl_pr.append(borders)
    overrides = {"top": top, "bottom": bottom, "left": left, "right": right}
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        edge_color, edge_size = color, size
        if overrides.get(edge):
            edge_color, edge_size = overrides[edge]
        element = borders.find(qn(f"w:{edge}"))
        if element is None:
            element = OxmlElement(f"w:{edge}")
            borders.append(element)
        element.set(qn("w:val"), "single")
        element.set(qn("w:sz"), str(edge_size))
        element.set(qn("w:space"), "0")
        element.set(qn("w:color"), edge_color)


def remove_table_borders(table):
    table_borders(table, color=WHITE, size="0")


def repeat_header(row):
    tr_pr = row._tr.get_or_add_trPr()
    node = OxmlElement("w:tblHeader")
    node.set(qn("w:val"), "true")
    tr_pr.append(node)


def add_field(paragraph, instruction="PAGE", fallback="1"):
    for kind, text in (("begin", None), (None, f" {instruction} "), ("separate", None), (None, fallback), ("end", None)):
        run = OxmlElement("w:r")
        r_pr = OxmlElement("w:rPr")
        color = OxmlElement("w:color")
        color.set(qn("w:val"), WHITE)
        size = OxmlElement("w:sz")
        size.set(qn("w:val"), "16")
        bold = OxmlElement("w:b")
        r_pr.extend([color, size, bold])
        run.append(r_pr)
        if kind:
            fld = OxmlElement("w:fldChar")
            fld.set(qn("w:fldCharType"), kind)
            run.append(fld)
        elif text == fallback:
            t = OxmlElement("w:t")
            t.text = text
            run.append(t)
        else:
            instr = OxmlElement("w:instrText")
            instr.set(qn("xml:space"), "preserve")
            instr.text = text
            run.append(instr)
        paragraph._p.append(run)


def hyperlink(paragraph, label, url):
    rel_id = paragraph.part.relate_to(
        url,
        "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",
        is_external=True,
    )
    link = OxmlElement("w:hyperlink")
    link.set(qn("r:id"), rel_id)
    run = OxmlElement("w:r")
    r_pr = OxmlElement("w:rPr")
    color = OxmlElement("w:color")
    color.set(qn("w:val"), "0B4F93")
    underline = OxmlElement("w:u")
    underline.set(qn("w:val"), "single")
    r_pr.extend([color, underline])
    run.append(r_pr)
    text = OxmlElement("w:t")
    text.text = label
    run.append(text)
    link.append(run)
    paragraph._p.append(link)


def paragraph(doc, text="", size=10.2, color=BLACK, bold=False, font="Arial", before=0, after=6, line=1.15, align=None):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(before)
    p.paragraph_format.space_after = Pt(after)
    p.paragraph_format.line_spacing = line
    if align is not None:
        p.alignment = align
    if text:
        set_font(p.add_run(text), font, size, color, bold)
    return p


def cell_paragraph(cell, text="", size=9.2, color=BLACK, bold=False, font="Arial", align=None, after=0):
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(after)
    p.paragraph_format.line_spacing = 1.08
    if align is not None:
        p.alignment = align
    if text:
        set_font(p.add_run(text), font, size, color, bold)
    return p


def heading(doc, text, size=23, before=5, after=8):
    p = doc.add_paragraph(style="Heading 1")
    p.paragraph_format.space_before = Pt(before)
    p.paragraph_format.space_after = Pt(after)
    p.paragraph_format.keep_with_next = True
    set_font(p.add_run(text), "Georgia", size, NAVY)
    return p


def subheading(doc, text, size=12.2, before=7, after=5):
    p = doc.add_paragraph(style="Heading 2")
    p.paragraph_format.space_before = Pt(before)
    p.paragraph_format.space_after = Pt(after)
    p.paragraph_format.keep_with_next = True
    set_font(p.add_run(text), "Arial", size, RED)
    return p


def configure_styles(doc):
    normal = doc.styles["Normal"]
    normal.font.name = "Arial"
    normal._element.rPr.rFonts.set(qn("w:ascii"), "Arial")
    normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Arial")
    normal.font.size = Pt(10.2)
    normal.font.color.rgb = RGBColor.from_string(BLACK)
    normal.paragraph_format.space_after = Pt(6)
    normal.paragraph_format.line_spacing = 1.15
    title = doc.styles["Title"]
    title.font.name = "Georgia"
    title._element.rPr.rFonts.set(qn("w:ascii"), "Georgia")
    title._element.rPr.rFonts.set(qn("w:hAnsi"), "Georgia")
    title.font.size = Pt(34)
    title.font.bold = False
    title.font.color.rgb = RGBColor.from_string(BLACK)
    for style_name in ("Heading 1", "Heading 2"):
        doc.styles[style_name].font.color.rgb = RGBColor.from_string(BLACK)


def set_section_page(section, top=0.48, bottom=0.45, left=0.68, right=0.68):
    section.page_width = Inches(8.5)
    section.page_height = Inches(11)
    section.top_margin = Inches(top)
    section.bottom_margin = Inches(bottom)
    section.left_margin = Inches(left)
    section.right_margin = Inches(right)
    section.header_distance = Inches(0.12)
    section.footer_distance = Inches(0.2)


def clear_container(container):
    for child in list(container._element):
        container._element.remove(child)
    container.add_paragraph()


def add_page_chrome(section, with_header):
    section.header.is_linked_to_previous = False
    section.footer.is_linked_to_previous = False
    clear_container(section.header)
    clear_container(section.footer)
    if with_header:
        top = section.header.add_table(rows=1, cols=2, width=Inches(7.14))
        top.alignment = WD_TABLE_ALIGNMENT.CENTER
        top.autofit = False
        remove_table_borders(top)
        set_table_widths(top, [3.55, 3.59])
        p = cell_paragraph(top.rows[0].cells[0], "THE NEWSREN / TEAM PROJECT", 7.5, NAVY)
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p = cell_paragraph(top.rows[0].cells[1], "WEEKS 02-03 / ARCHITECTURE & FEASIBILITY", 7.2, SLATE)
        p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        rule = section.header.add_table(rows=1, cols=1, width=Inches(7.14))
        rule.alignment = WD_TABLE_ALIGNMENT.CENTER
        rule.rows[0].height = Inches(0.02)
        rule.rows[0].height_rule = WD_ROW_HEIGHT_RULE.EXACTLY
        shade_cell(rule.cell(0, 0), LINE)
        remove_table_borders(rule)
    footer = section.footer.add_table(rows=1, cols=2, width=Inches(7.14))
    footer.alignment = WD_TABLE_ALIGNMENT.CENTER
    footer.autofit = False
    set_table_widths(footer, [6.72, 0.42])
    table_borders(footer, color=WHITE, size="0", top=(LINE, "6"))
    left = cell_paragraph(footer.rows[0].cells[0], "CMU Silicon Valley | Software Engineering Management", 7.2, SLATE)
    left.alignment = WD_ALIGN_PARAGRAPH.LEFT
    page_cell = footer.rows[0].cells[1]
    shade_cell(page_cell, RED)
    cell_margins(page_cell, 55, 20, 55, 20)
    page_p = page_cell.paragraphs[0]
    page_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    page_p.paragraph_format.space_after = Pt(0)
    add_field(page_p)


def add_section(doc, with_header):
    section = doc.add_section(WD_SECTION.NEW_PAGE)
    set_section_page(section)
    add_page_chrome(section, with_header)
    return section


def section_banner(doc, number, title, weight):
    table = doc.add_table(rows=1, cols=3)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    set_table_widths(table, [0.55, 5.87, 0.72])
    for cell in table.rows[0].cells:
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        cell_margins(cell, 90, 80, 90, 80)
    shade_cell(table.cell(0, 0), RED)
    shade_cell(table.cell(0, 2), PALE_RED)
    cell_paragraph(table.cell(0, 0), number, 14.5, WHITE, align=WD_ALIGN_PARAGRAPH.CENTER)
    cell_paragraph(table.cell(0, 1), title, 18.5, NAVY, font="Georgia")
    cell_paragraph(table.cell(0, 2), weight, 8.5, RED, align=WD_ALIGN_PARAGRAPH.CENTER)
    table_borders(table, color=WHITE, size="0", bottom=(NAVY, "8"))
    spacer = doc.add_paragraph()
    spacer.paragraph_format.space_after = Pt(2)


def add_cover(doc):
    section = doc.sections[0]
    set_section_page(section, top=0, bottom=0, left=0, right=0)
    clear_container(section.header)
    clear_container(section.footer)
    cover = doc.add_table(rows=1, cols=1)
    cover.alignment = WD_TABLE_ALIGNMENT.CENTER
    cover.autofit = False
    set_table_widths(cover, [8.5])
    cover.rows[0].height = Inches(10.92)
    cover.rows[0].height_rule = WD_ROW_HEIGHT_RULE.EXACTLY
    shade_cell(cover.cell(0, 0), NAVY)
    cell_margins(cover.cell(0, 0), 1060, 660, 320, 600)
    table_borders(cover, color=NAVY, size="0", top=(RED, "120"), left=(RED, "120"))
    cell = cover.cell(0, 0)
    cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.TOP
    cell._element.remove(cell.paragraphs[0]._element)
    p = cell.add_paragraph()
    p.paragraph_format.space_after = Pt(26)
    set_font(p.add_run("THE NEWSREN / TEAM PROJECT"), "Arial", 10.5, "CDD9E3")
    p = cell.add_paragraph(style="Title")
    p.paragraph_format.space_after = Pt(12)
    set_font(p.add_run("Architecture Design\n& Technical Feasibility"), "Georgia", 34, WHITE)
    p = cell.add_paragraph()
    p.paragraph_format.space_after = Pt(24)
    p.paragraph_format.line_spacing = 1.2
    set_font(p.add_run("A bounded, evidence-grounded approach to agentic news synthesis for evolving\ninternational-student policy."), "Arial", 12.5, "C7D5E2")
    score = cell.add_table(rows=1, cols=3)
    score.autofit = False
    score.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_widths(score, [1.65, 1.8, 1.9])
    for c in score.rows[0].cells:
        c.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        cell_margins(c, 150, 80, 150, 80)
    shade_cell(score.cell(0, 0), RED)
    shade_cell(score.cell(0, 1), NAVY_2)
    shade_cell(score.cell(0, 2), NAVY_2)
    remove_table_borders(score)
    cell_paragraph(score.cell(0, 0), "WEEKS 02-03", 8.5, WHITE, align=WD_ALIGN_PARAGRAPH.CENTER)
    cell_paragraph(score.cell(0, 1), "40% PROBLEM", 8.5, WHITE, align=WD_ALIGN_PARAGRAPH.CENTER)
    cell_paragraph(score.cell(0, 2), "40% PROTOTYPE", 8.5, WHITE, align=WD_ALIGN_PARAGRAPH.CENTER)
    p = cell.add_paragraph()
    p.paragraph_format.space_before = Pt(22)
    p.paragraph_format.space_after = Pt(6)
    set_font(p.add_run("PROJECT TEAM"), "Arial", 8.5, RED)
    team = cell.add_table(rows=3, cols=2)
    team.autofit = False
    set_table_widths(team, [2.75, 3.55])
    names = [
        ("Mohammed Haider Abbas", os.getenv("NEWSREN_HAIDER_EMAIL", "")),
        ("Ankit Ojha", os.getenv("NEWSREN_ANKIT_EMAIL", "")),
        ("Nikhil Gaurav", os.getenv("NEWSREN_NIKHIL_EMAIL", "")),
    ]
    for row, (name, email) in zip(team.rows, names):
        cell_margins(row.cells[0], 90, 0, 90, 0)
        cell_margins(row.cells[1], 90, 0, 90, 0)
        cell_paragraph(row.cells[0], name, 9.2, WHITE)
        cell_paragraph(row.cells[1], email, 7.5, "B7C8D7")
    table_borders(team, color="3B5870", size="4", left=(NAVY, "0"), right=(NAVY, "0"), top=(NAVY, "0"))
    p = cell.add_paragraph()
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after = Pt(4)
    set_font(p.add_run("49-772 A2 SOFTWARE ENGINEERING MANAGEMENT"), "Arial", 8.5, WHITE)
    for text in (
        "Fall 2026 / Carnegie Mellon University - Silicon Valley",
        "github.com/haider-06418/newsren-agentic-news-portal",
        "Assessment date: November 10, 2026",
    ):
        p = cell.add_paragraph()
        p.paragraph_format.space_after = Pt(2)
        set_font(p.add_run(text), "Arial", 7.8, "B7C8D7")
    p = cell.add_paragraph()
    p.paragraph_format.space_before = Pt(72)
    p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    set_font(p.add_run("02/03"), "Arial", 78, NAVY_2)
    p = cell.add_paragraph()
    p.paragraph_format.space_before = Pt(3)
    p.paragraph_format.space_after = Pt(0)
    set_font(p.add_run("THE NEWSREN"), "Arial", 10, WHITE)
    set_font(p.add_run("                                                       49-772 A2 | FALL 2026"), "Arial", 7.2, "B7C8D7")


def add_summary_box(doc, text):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.cell(0, 0)
    shade_cell(cell, GOLD)
    cell_margins(cell, 170, 170, 170, 170)
    table_borders(table, color=GOLD_BORDER, size="6")
    p = cell.paragraphs[0]
    p.paragraph_format.line_spacing = 1.38
    p.paragraph_format.space_after = Pt(0)
    set_font(p.add_run(text), "Georgia", 10.5, NAVY)


def add_responsibility_visual(doc):
    outer = doc.add_table(rows=2, cols=1)
    outer.alignment = WD_TABLE_ALIGNMENT.CENTER
    for row in outer.rows:
        shade_cell(row.cells[0], PALE_BLUE)
    cell_margins(outer.cell(0, 0), 105, 160, 45, 160)
    cell_margins(outer.cell(1, 0), 45, 160, 130, 160)
    table_borders(outer, color=LINE, size="6")
    cell_paragraph(outer.cell(0, 0), "EQUAL RESPONSIBILITY TARGET / 33.3% EACH", 7.5, RED)
    cards = outer.cell(1, 0).add_table(rows=1, cols=3)
    cards.autofit = False
    set_table_widths(cards, [2.0, 2.0, 2.0])
    data = [
        ("M", "MOHAMMED", "Integration + architecture"),
        ("A", "ANKIT", "Data access + quality"),
        ("N", "NIKHIL", "Retrieval + evaluation"),
    ]
    for card, (initial, name, role) in zip(cards.rows[0].cells, data):
        shade_cell(card, WHITE)
        cell_margins(card, 90, 90, 90, 90)
        p = card.paragraphs[0]
        p.paragraph_format.space_after = Pt(3)
        set_font(p.add_run(f"●  {initial}   "), "Arial", 11.5, NAVY, True)
        set_font(p.add_run(name), "Arial", 7.6, NAVY)
        p = card.add_paragraph()
        p.paragraph_format.left_indent = Inches(0.34)
        p.paragraph_format.space_after = Pt(0)
        set_font(p.add_run(role), "Arial", 6.8, SLATE)
    table_borders(cards, color="2F6EA3", size="7")


def add_promoted_cards(doc, items):
    table = doc.add_table(rows=4, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    set_table_widths(table, [3.55, 3.55])
    for index, (cell, item) in enumerate(zip([c for row in table.rows for c in row.cells], items), start=1):
        shade_cell(cell, PALE_BLUE)
        cell_margins(cell, 110, 110, 110, 110)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        set_font(p.add_run(f"{index:02d}  "), "Arial", 8.2, RED)
        set_font(p.add_run(item), "Arial", 8.4, NAVY)
    table_borders(table, color=CREAM, size="24")


def add_progress_flow(doc):
    outer = doc.add_table(rows=2, cols=1)
    outer.alignment = WD_TABLE_ALIGNMENT.CENTER
    for row in outer.rows:
        shade_cell(row.cells[0], NAVY)
        cell_margins(row.cells[0], 110, 150, 110, 150)
    remove_table_borders(outer)
    cell_paragraph(outer.cell(0, 0), "FROM INDIVIDUAL PROTOTYPE TO TEAM PROJECT", 7.5, "CDD9E3")
    flow = outer.cell(1, 0).add_table(rows=1, cols=5)
    flow.autofit = False
    set_table_widths(flow, [1.65, 0.45, 1.65, 0.45, 1.65])
    boxes = [
        ("WEEK 1 BASELINE", "Evidence-led product"),
        ("TEAM EXTENSION", "Multi-source + schema"),
        ("FEASIBILITY PROOF", "Evaluation + risks"),
    ]
    box_index = 0
    for idx, cell in enumerate(flow.rows[0].cells):
        if idx in (1, 3):
            cell_paragraph(cell, "→", 19, RED, True, align=WD_ALIGN_PARAGRAPH.CENTER)
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        else:
            shade_cell(cell, NAVY_2)
            cell_margins(cell, 100, 100, 100, 100)
            title, detail = boxes[box_index]
            box_index += 1
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(4)
            set_font(p.add_run(title), "Arial", 7.2, WHITE)
            p = cell.add_paragraph()
            p.paragraph_format.space_after = Pt(0)
            set_font(p.add_run(detail), "Arial", 6.6, "CDD9E3")
    table_borders(flow, color="567998", size="6")


def add_problem_box(doc, text):
    paragraph(doc, "WORKING PROBLEM STATEMENT", 7.8, RED, after=4)
    box = doc.add_table(rows=1, cols=1)
    box.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = box.cell(0, 0)
    shade_cell(cell, PALE_BLUE)
    cell_margins(cell, 120, 170, 120, 170)
    table_borders(box, color="2A67A0", size="8")
    p = cell.paragraphs[0]
    p.paragraph_format.line_spacing = 1.24
    p.paragraph_format.space_after = Pt(0)
    set_font(p.add_run(text), "Georgia", 10.8, NAVY)


def add_architecture_diagram(doc):
    outer = doc.add_table(rows=3, cols=1)
    outer.alignment = WD_TABLE_ALIGNMENT.CENTER
    shade_cell(outer.cell(0, 0), NAVY)
    shade_cell(outer.cell(1, 0), PALE_BLUE_2)
    shade_cell(outer.cell(2, 0), PALE_BLUE_2)
    cell_margins(outer.cell(0, 0), 90, 150, 90, 150)
    cell_margins(outer.cell(1, 0), 70, 140, 30, 140)
    cell_margins(outer.cell(2, 0), 30, 140, 60, 140)
    table_borders(outer, color=LINE, size="6")
    cell_paragraph(outer.cell(0, 0), "TARGET ARCHITECTURE / HUMAN-REVIEWED EVIDENCE FLOW", 7.8, WHITE)
    labels = outer.cell(1, 0).add_table(rows=1, cols=3)
    set_table_widths(labels, [2.18, 2.18, 2.18])
    remove_table_borders(labels)
    for cell, label in zip(labels.rows[0].cells, ("SOURCES", "EVIDENCE LAYER", "DECISION LAYER")):
        cell_paragraph(cell, label, 7.2, RED)
    lanes = outer.cell(2, 0).add_table(rows=1, cols=3)
    lanes.autofit = False
    set_table_widths(lanes, [2.18, 2.18, 2.18])
    content = [
        ["Federal Register API", "Agency guidance", "Controlled media corpus"],
        ["Canonical document schema", "↓", "Entity + temporal matching"],
        ["Claim-level evidence bundle", "↓", "Bounded agent + validator", "↓", "Human editorial review"],
    ]
    for cell, items in zip(lanes.rows[0].cells, content):
        cell_margins(cell, 30, 45, 30, 45)
        cell._element.remove(cell.paragraphs[0]._element)
        for item in items:
            if item == "↓":
                p = cell.add_paragraph()
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.space_after = Pt(1)
                set_font(p.add_run(item), "Arial", 10, SLATE)
            else:
                t = cell.add_table(rows=1, cols=1)
                shade_cell(t.cell(0, 0), PALE_RED if item in ("Controlled media corpus", "Human editorial review") else WHITE)
                cell_margins(t.cell(0, 0), 55, 55, 55, 55)
                table_borders(t, color="2A67A0", size="7")
                cell_paragraph(t.cell(0, 0), item, 6.8, NAVY, align=WD_ALIGN_PARAGRAPH.CENTER)
    remove_table_borders(lanes)


def add_numbered_list(doc, items, size=9.5):
    for index, text in enumerate(items, start=1):
        p = doc.add_paragraph()
        p.paragraph_format.left_indent = Inches(0.25)
        p.paragraph_format.first_line_indent = Inches(-0.2)
        p.paragraph_format.space_after = Pt(3.2)
        set_font(p.add_run(f"{index}.  "), "Arial", size, RED)
        set_font(p.add_run(text), "Arial", size, BLACK)


def add_bullets(doc, items, size=9.4, bold_leads=False):
    for item in items:
        p = doc.add_paragraph()
        p.paragraph_format.left_indent = Inches(0.22)
        p.paragraph_format.first_line_indent = Inches(-0.15)
        p.paragraph_format.space_after = Pt(3.2)
        set_font(p.add_run("•  "), "Arial", size, RED)
        if bold_leads and ":" in item:
            lead, rest = item.split(":", 1)
            set_font(p.add_run(lead + ":"), "Arial", size, BLACK, True)
            set_font(p.add_run(rest), "Arial", size, BLACK)
        else:
            set_font(p.add_run(item), "Arial", size, BLACK)


def add_code_block(doc, lines):
    box = doc.add_table(rows=1, cols=1)
    shade_cell(box.cell(0, 0), PALE_BLUE)
    cell_margins(box.cell(0, 0), 100, 110, 100, 110)
    remove_table_borders(box)
    p = box.cell(0, 0).paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.05
    for index, line in enumerate(lines):
        run = p.add_run(line)
        set_font(run, "Courier New", 8.2, NAVY)
        if index != len(lines) - 1:
            run.add_break()


def add_data_table(doc, headers, rows, widths, font_size=7.7):
    table = doc.add_table(rows=1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    set_table_widths(table, widths)
    for cell, header, width in zip(table.rows[0].cells, headers, widths):
        shade_cell(cell, NAVY)
        cell_margins(cell, 80, 90, 80, 90)
        cell_paragraph(cell, header, font_size, WHITE)
    repeat_header(table.rows[0])
    for row_index, row_data in enumerate(rows):
        row = table.add_row()
        for col_index, (cell, value, width) in enumerate(zip(row.cells, row_data, widths)):
            shade_cell(cell, PALE_BLUE if row_index % 2 else WHITE)
            cell_margins(cell, 52, 90, 52, 90)
            align = WD_ALIGN_PARAGRAPH.CENTER if len(headers) == 5 and col_index > 0 else WD_ALIGN_PARAGRAPH.LEFT
            cell_paragraph(cell, value, font_size, SLATE, align=align)
    table_borders(table, color=LINE, size="5")


def build(doc):
    summary = (
        "Newsren extends the team's Week 1 news-intelligence prototypes into a shared, evidence-grounded architecture for evolving policy stories. "
        "The team selected Mohammed Haider Abbas's implementation as the baseline because all three individual projects addressed the same prompt and produced similar concepts. "
        "This deliverable tests the highest-risk technical assumption: whether heterogeneous public sources can be normalized and matched while preserving provenance, time and uncertainty. "
        "The prototype integrates Federal Register records with authoritative agency guidance and compares keyword overlap with TF-IDF/cosine similarity on a small labeled set. "
        "The experiment establishes schema and access feasibility but also shows that text similarity alone has insufficient recall and cannot prove event identity. "
        "Human review and source validation therefore remain architectural requirements."
    )
    problem = (
        "Readers struggle to understand evolving policy stories because official documents, institutional guidance, and news coverage change on different timelines and often mix verified facts with interpretation. "
        "Newsren will test whether an evidence-grounded agentic workflow can integrate these sources into claim-level cited briefs that preserve disagreement and uncertainty. "
        "We hypothesize that this approach will improve citation traceability, source diversity, and unsupported-claim rates compared with conventional single-source summaries. "
        "Our contribution is a lightweight, human-reviewed architecture for auditable AI news synthesis that helps affected readers make better-informed decisions without presenting uncertain conclusions as settled facts."
    )
    add_cover(doc)

    add_section(doc, True)
    heading(doc, "Executive summary", 23, 4, 8)
    add_summary_box(doc, summary)
    section_banner(doc, "01", "Individual responsibility and contribution", "5%")
    paragraph(doc, "The team uses an equal 33.3% responsibility target. Mohammed owns integration and architecture; Ankit owns dataset access, normalization and quality analysis; Nikhil owns retrieval experiments, evaluation and risk analysis. Each workstream receives paired review, and all members remain accountable for explaining the complete system.", 9.5, after=6)
    paragraph(doc, "The existing Newsren codebase, deployment, source/claim model and evaluation harness are the starting contribution from Mohammed's selected Week 1 implementation. The team jointly selected the scope, free/public-data constraint and equal responsibility plan during the November 10 shared planning session. Final contribution wording will be reconciled against completed pairing logs and Git history before submission rather than overstating planned work.", 9.5, after=7)
    section_banner(doc, "02", "Pair programming and knowledge transfer", "5%")
    paragraph(doc, "The team uses driver/navigator pairing for complex, knowledge-transfer work. Roles must switch during each session, both participants must remain active, and the output must link to a commit or pull request. The planned rotation covers dataset normalization, algorithm evaluation and release validation so that each member pairs with both teammates.", 9.4, after=5)
    paragraph(doc, "The November 10 session is recorded as joint planning and ensemble design because all three members participated through a shared Codex session. It will only be claimed as code-pairing evidence after the team confirms the human driver/navigator rotation. The session log in docs/week-2-3/TEAMWORK.md contains the required fields and protects the submission from inventing collaboration evidence.", 9.4, after=8)
    add_responsibility_visual(doc)

    add_section(doc, False)
    section_banner(doc, "03", "Individual work promoted to the team project", "10%")
    paragraph(doc, "All members received the same Week 1 Newsren prompt and developed similar agentic news concepts. The team promoted the following elements from the selected implementation:", 9.6, after=7)
    promoted = [
        "an evidence map rather than a generic chatbot;",
        "claim-level source links and explicit unresolved questions;",
        "international-student policy as the flagship high-uncertainty domain;",
        "a contextual Ask Newsren assistant bounded to the active story;",
        "deterministic fallbacks so the demo does not require a paid model;",
        "audience-specific explanations and local topic following;",
        "human review, abstention and citation validation; and",
        "a public React/Next.js interface deployed on Vercel.",
    ]
    add_promoted_cards(doc, promoted)
    paragraph(doc, "The team-level extension is not another UI redesign. It adds multi-dataset ingestion, a canonical schema, matching experiments, an updated architecture, measurable feasibility evidence and shared engineering practices.", 9.7, before=7, after=12)
    add_progress_flow(doc)

    add_section(doc, True)
    section_banner(doc, "04", "Project problem statement", "40%")
    add_problem_box(doc, problem)
    paragraph(doc, "Word count: 92.", 8.4, after=5)
    subheading(doc, "Research questions", 11.5, 3, 3)
    add_numbered_list(doc, [
        "Can heterogeneous policy and guidance datasets be normalized without losing provenance or temporal context?",
        "Can a lightweight retrieval method identify useful cross-dataset evidence candidates?",
        "Can an agent remain bounded to validated claims and abstain when the evidence is insufficient?",
        "Can the system operate with public datasets and no paid or hosted model?",
    ], 8.4)
    subheading(doc, "Innovation and human impact", 11.5, 5, 3)
    paragraph(doc, "Newsren does not treat uncertainty as randomness and does not manufacture consensus. It represents supported claims, interpretations, conflicts, dates and evidence gaps separately. This is particularly important for international students, whose decisions can be harmed when a broad headline is mistaken for a rule that applies immediately to every student.", 8.5, after=5)
    add_architecture_diagram(doc)

    add_section(doc, False)
    section_banner(doc, "05", "Prototyping and technical feasibility", "40%")
    subheading(doc, "5.1 Datasets and access")
    paragraph(doc, "The reproducible prototype integrates two available public datasets: structured Federal Register records and a curated registry of authoritative State Department guidance. A third planned corpus, GDELT DOC 2.0, is public but returned HTTP 429 during the access test and is therefore recorded as an unresolved availability risk rather than silently treated as available.", 9.3, after=7)
    paragraph(doc, "The six-record fixture covers proposed and final admission-period rules, an OPT-fee proposal, country-specific F-1 employment relief, general student-visa guidance and an F-1/J-1 comparison. All required canonical fields are populated; publication dates are present for four of six records.", 9.3, after=7)
    subheading(doc, "5.2 Hypothesis-testing steps")
    add_numbered_list(doc, [
        "Query a public regulatory API for international-student records.",
        "Cache a small reproducible fixture with canonical URLs and retrieval metadata.",
        "Normalize regulatory and guidance records into one schema.",
        "Label ten document pairs as related or unrelated, with reasons.",
        "Run a raw keyword-overlap baseline.",
        "Run TF-IDF vectorization with cosine similarity.",
        "Compare precision, recall, accuracy and F1.",
        "Inspect errors and identify missing structured features.",
        "Preserve validated records as candidates for the Newsren evidence bundle.",
        "Retain human review before any policy conclusion is published.",
    ], 8.8)
    subheading(doc, "5.3 Prototype code and reproducibility")
    paragraph(doc, "The implementation is available in lib/feasibility.ts, scripts/feasibility/run.mjs, data/feasibility/ and tests/feasibility.test.mjs.", 8.8, after=3)
    add_code_block(doc, ["npm run feasibility", "npm test", "npm run evaluate", "npm run build:vercel"])
    subheading(doc, "5.4 Initial experimental results", 11.5, 4, 3)
    add_data_table(doc, ["Method", "Precision", "Recall", "Accuracy", "F1"], [["Keyword overlap", "0.400", "0.286", "0.200", "0.333"], ["TF-IDF + cosine", "0.667", "0.286", "0.400", "0.400"]], [1.52, 1.38, 1.38, 1.38, 1.38], 7.5)
    paragraph(doc, "TF-IDF modestly improves precision, accuracy and F1 on the exploratory sample, but recall remains low. The result supports continued investigation, not a general performance claim. The errors show that lexical similarity cannot distinguish ‘same broad population’ from ‘same policy development.’ The next architecture increment should add explicit entity, agency, document-version and temporal-relation features before considering embeddings or a larger model.", 8.9, before=7, after=0)

    add_section(doc, True)
    subheading(doc, "5.5 Hypothesis assessment", 11.5, 5, 4)
    add_bullets(doc, [
        "Data-access hypothesis: supported for Federal Register and existing agency guidance.",
        "Schema hypothesis: supported for required metadata; temporal completeness is only partially supported.",
        "Multi-dataset integration hypothesis: supported for candidate generation, not for automatic event identity.",
        "TF-IDF matching hypothesis: weakly supported on this fixture; recall is insufficient.",
        "Fully automated publishing hypothesis: disproved by the observed ambiguity and temporal gaps.",
        "Free/lightweight deployment hypothesis: supported by the existing deterministic Vercel application.",
    ], 8.8, True)
    subheading(doc, "5.6 Risks and mitigations", 11.2, 6, 3)
    add_data_table(doc, ["Risk", "Prototype evidence", "Mitigation"], [
        ["External API limits", "GDELT returned HTTP 429", "Cache, backoff, scheduled low-volume retrieval or replacement corpus"],
        ["Missing dates", "Two guidance records lack publication dates", "Preserve null, store retrieval time separately and require re-verification"],
        ["False document matches", "Both methods confuse broad-topic overlap with event identity", "Add entities, agencies, document relations and human validation"],
        ["Hallucinated synthesis", "Model-generated prose could exceed evidence", "Select validated claim IDs; reject altered or unknown claims"],
        ["Stale policy information", "A retrieved page may change later", "Display evidence window and block unsupported currentness claims"],
        ["Legal/personal advice", "Individual outcomes need facts outside the corpus", "Abstain and direct users to qualified institutional or legal support"],
        ["Unequal teamwork", "Planned ownership can diverge from actual work", "Pair rotation, commit evidence and final contribution reconciliation"],
    ], [1.55, 2.75, 2.85], 7.2)
    heading(doc, "Architecture decision", 20, 10, 5)
    paragraph(doc, "The team will retain the existing evidence-selector architecture and add source adapters plus a canonical document layer. A model, if used, may rank or select evidence IDs but may not independently create publishable policy claims. This preserves the Week 1 product's strongest quality: a user can trace every material statement to an identifiable source or see that it remains unresolved.", 8.6, after=6)
    heading(doc, "Feasibility conclusion and next increment", 19, 5, 5)
    paragraph(doc, "The project is technically feasible as a bounded, human-reviewed news-intelligence prototype. Public data can populate the required schema, multiple source families can be joined, and lightweight algorithms can produce evidence candidates. The experiment also disproves a risky shortcut: similarity scores alone are not reliable enough to automate policy-story construction. The next increment should enlarge the labeled set, implement entity/temporal features, add a controlled media corpus, and conduct a small human evaluation comparing a conventional summary with a Newsren evidence brief.", 8.6, after=5)
    paragraph(doc, "A secondary technology-policy transfer test may be added only after the international-student pipeline and evaluation remain reproducible.", 8.6, after=0)

    add_section(doc, False)
    heading(doc, "References", 23, 3, 12)
    references = [
        ("Federal Register API documentation", "https://www.federalregister.gov/developers/documentation/api/v1"),
        ("GDELT DOC 2.0 API documentation", "https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/"),
        ("U.S. Department of State, Student Visa", "https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html"),
        ("BridgeUSA, F-1 versus J-1 Visas", "https://j1visa.state.gov/basics/other-u-s-visas/studying-at-u-s-universities-and-colleges-f-1-versus-j-1-visas/"),
        ("LinkedIn, Pair Programming Best Practices", "https://www.linkedin.com/top-content/technology/best-practices-in-technology/pair-programming-best-practices/"),
    ]
    for index, (label, url) in enumerate(references, start=1):
        p = doc.add_paragraph()
        p.paragraph_format.left_indent = Inches(0.24)
        p.paragraph_format.first_line_indent = Inches(-0.2)
        p.paragraph_format.space_after = Pt(5)
        set_font(p.add_run(f"{index}.  "), "Arial", 9.3, RED)
        set_font(p.add_run(label + ": "), "Arial", 9.3, BLACK)
        hyperlink(p, url, url)
    heading(doc, "Submission readiness", 23, 15, 12)
    paragraph(doc, "The architecture, prototype, dataset access evidence, initial experiment and report narrative are reproducible. Before final submission, the team must replace the unconfirmed pairing-log cells with the actual session dates, durations, driver/navigator rotations and linked commits, then reconcile the contribution table with completed work.", 9.8, after=0)


def main():
    if len(sys.argv) != 2:
        print("Usage: generate-week23-google-docs.py OUTPUT.docx", file=sys.stderr)
        return 2
    output = Path(sys.argv[1]).resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    doc = Document()
    configure_styles(doc)
    build(doc)
    doc.core_properties.title = "Newsren Architecture Design and Technical Feasibility Assessment"
    doc.core_properties.subject = "Weeks 2 and 3 team project deliverable"
    doc.core_properties.author = "Mohammed Haider Abbas, Ankit Ojha, Nikhil Gaurav"
    doc.core_properties.keywords = "Newsren, architecture, feasibility, software engineering management"
    doc.save(output)
    print(output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
