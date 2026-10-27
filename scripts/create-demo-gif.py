from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PREVIEWS = ROOT / "docs" / "previews"
OUTPUT = ROOT / "docs" / "demo" / "newsren-phase-4-demo.gif"

SLIDES = [
    ("phase-1-home.jpg", "01  DISCOVER", "Four desks for evolving, evidence-heavy questions"),
    ("phase-1-story.jpg", "02  UNDERSTAND", "A reference brief keeps claims, dates, and sources visible"),
    ("phase-2-story.jpg", "03  INVESTIGATE", "Ask Newsren answers from the active evidence bundle—or abstains"),
    ("phase-3-follows.jpg", "04  FOLLOW", "Browser-local follows demonstrate material-change review"),
    ("phase-4-evaluation.jpg", "05  EVALUATE", "Trust, usefulness, accessibility, latency, and cost are release gates"),
    ("phase-4-mobile.jpg", "06  RESPONSIVE", "The same evidence path remains readable at 390 pixels"),
]

CANVAS = (1280, 720)
PAPER = "#f9f8f3"
INK = "#263a30"
GREEN = "#70845a"


def font(size: int, bold: bool = False):
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


def cover(image: Image.Image, box: tuple[int, int]):
    scale = max(box[0] / image.width, box[1] / image.height)
    resized = image.resize(
        (round(image.width * scale), round(image.height * scale)),
        Image.Resampling.LANCZOS,
    )
    left = max(0, (resized.width - box[0]) // 2)
    top = max(0, (resized.height - box[1]) // 2)
    return resized.crop((left, top, left + box[0], top + box[1]))


def make_slide(filename: str, eyebrow: str, caption: str):
    canvas = Image.new("RGB", CANVAS, PAPER)
    screenshot = Image.open(PREVIEWS / filename).convert("RGB")
    screenshot = cover(screenshot, (1280, 575))
    canvas.paste(screenshot, (0, 0))

    overlay = Image.new("RGBA", (1280, 145), (249, 248, 243, 248))
    canvas.paste(overlay.convert("RGB"), (0, 575))
    draw = ImageDraw.Draw(canvas)
    draw.line((58, 575, 1222, 575), fill=INK, width=2)
    draw.text((58, 603), eyebrow, font=font(18, True), fill=GREEN)
    draw.text((58, 640), caption, font=font(30), fill=INK)
    draw.text((1120, 609), "the newsren.", font=font(18, True), fill=INK)
    draw.text((1120, 642), "WEEK 01", font=font(12, True), fill=GREEN)
    return canvas


OUTPUT.parent.mkdir(parents=True, exist_ok=True)
frames = [make_slide(*slide) for slide in SLIDES]
frames[0].save(
    OUTPUT,
    save_all=True,
    append_images=frames[1:],
    duration=[2400] * len(frames),
    loop=0,
    optimize=True,
)
print(OUTPUT)
