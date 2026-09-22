#!/usr/bin/env python3
"""Render the postable graphics and text-card videos for the UNIADS content plan.

Benefit-led set for the immediate intake: no qualifications needed, full funding,
the course list, studying with children, and two days a week.

Every figure comes from content/brand-facts.md. Change a number here, in the data
below, and regenerate — never edit an exported PNG, because an edited figure can no
longer be traced back to its source.

Usage:
    pip install pillow
    python3 content/assets/generate_assets.py

Brand fonts (Oswald, Outfit — per src/app/globals.css) download to .fonts/ on
first run. ffmpeg is needed for the videos; images render without it.
"""

from __future__ import annotations

import subprocess
import sys
import urllib.request
from pathlib import Path
from shutil import which

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "out"
FONTS = ROOT / ".fonts"

# Brand palette, from src/app/globals.css
NAVY = "#1d2b4d"
NAVY_DEEP = "#121c36"
OLIVE = "#c2cc60"
TEAL = "#1f6b6b"
CREAM = "#f7f8f4"
INK = "#1a1f2e"
MUTED = "#5c6578"
WHITE = "#ffffff"

FONT_SOURCES = {
    "Oswald.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/oswald/Oswald%5Bwght%5D.ttf",
    "Outfit.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/outfit/Outfit%5Bwght%5D.ttf",
}

IG = (1080, 1350)
SQ = (1200, 1200)
VERT = (1080, 1920)


def ensure_fonts() -> None:
    FONTS.mkdir(parents=True, exist_ok=True)
    for name, url in FONT_SOURCES.items():
        if not (FONTS / name).exists():
            print(f"downloading {name}")
            urllib.request.urlretrieve(url, FONTS / name)


def font(family: str, size: int, weight: str = "Bold") -> ImageFont.FreeTypeFont:
    f = ImageFont.truetype(str(FONTS / f"{family}.ttf"), size)
    try:
        f.set_variation_by_name(weight)
    except Exception:
        pass
    return f


def wrap(draw, text: str, fnt, max_w: int) -> list[str]:
    lines: list[str] = []
    for para in text.split("\n"):
        words, line = para.split(), ""
        for w in words:
            trial = f"{line} {w}".strip()
            if draw.textlength(trial, font=fnt) <= max_w or not line:
                line = trial
            else:
                lines.append(line)
                line = w
        lines.append(line)
    return lines


def draw_block(draw, text, fnt, x, y, max_w, fill, leading=1.12) -> int:
    asc, desc = fnt.getmetrics()
    step = int((asc + desc) * leading)
    for line in wrap(draw, text, fnt, max_w):
        draw.text((x, y), line, font=fnt, fill=fill)
        y += step
    return y


def draw_tracked(draw, text, fnt, x, y, fill, tracking=4) -> None:
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + tracking


def wordmark(draw, x, y, fill=WHITE, size=34) -> None:
    draw_tracked(draw, "UNIADS", font("Oswald", size, "Bold"), x, y, fill, tracking=5)


def render_card(
    size: tuple[int, int],
    *,
    bg: str,
    eyebrow: str | None = None,
    headline: str | None = None,
    bignum: str | None = None,
    body: str | None = None,
    bullets: list[str] | None = None,
    cta: str | None = None,
    footnote: str | None = None,
    page: str | None = None,
    scale: float = 1.0,
) -> Image.Image:
    w, h = size
    img = Image.new("RGB", size, bg)
    d = ImageDraw.Draw(img)
    dark = bg in (NAVY, NAVY_DEEP, TEAL)
    fg = WHITE if dark else INK
    sub = "#ccd3e0" if dark else MUTED

    pad = int(72 * scale)
    max_w = w - pad * 2

    wordmark(d, pad, pad, OLIVE if dark else NAVY, int(34 * scale))
    rule_y = pad + int(78 * scale)
    d.rectangle([pad, rule_y, pad + int(96 * scale), rule_y + int(7 * scale)], fill=OLIVE)

    stack: list[tuple] = []
    if eyebrow:
        stack.append(("tracked", eyebrow.upper(), font("Outfit", int(30 * scale), "SemiBold"),
                      OLIVE if dark else TEAL, 1.0, int(30 * scale)))
    if headline:
        stack.append(("block", headline, font("Oswald", int(96 * scale), "Bold"), fg, 1.05, int(26 * scale)))
    if bignum:
        stack.append(("block", bignum, font("Oswald", int(186 * scale), "Bold"), OLIVE, 0.98, int(18 * scale)))
    if body:
        stack.append(("block", body, font("Outfit", int(46 * scale), "Regular"), sub, 1.36, int(26 * scale)))
    if bullets:
        for b in bullets:
            stack.append(("bullet", b, font("Outfit", int(48 * scale), "Medium"), fg, 1.0, int(30 * scale)))

    def measure(kind, text, fnt, leading) -> int:
        asc, desc = fnt.getmetrics()
        step = int((asc + desc) * leading)
        return step if kind in ("tracked", "bullet") else step * len(wrap(d, text, fnt, max_w))

    content_h = sum(measure(k, t, f, l) + g for k, t, f, _, l, g in stack)
    top = rule_y + int(56 * scale)
    bottom = h - (int(330 * scale) if cta else int(190 * scale))
    y = top + max(0, (bottom - top - content_h) // 2)

    for kind, text, fnt, fill, leading, gap in stack:
        if kind == "tracked":
            draw_tracked(d, text, fnt, pad, y, fill, tracking=3)
            y += measure(kind, text, fnt, leading)
        elif kind == "bullet":
            tick = font("Outfit", int(48 * scale), "Bold")
            d.text((pad, y), "✓", font=tick, fill=OLIVE)
            d.text((pad + int(62 * scale), y), text, font=fnt, fill=fill)
            y += measure(kind, text, fnt, leading)
        else:
            y = draw_block(d, text, fnt, pad, y, max_w, fill, leading)
        y += gap

    if cta:
        by = h - int(296 * scale)
        d.rectangle([pad, by, w - pad, by + int(112 * scale)], fill=OLIVE)
        f = font("Outfit", int(42 * scale), "Bold")
        d.text(((w - d.textlength(cta, font=f)) / 2, by + int(30 * scale)), cta,
               font=f, fill=NAVY_DEEP)

    fy = h - int(104 * scale)
    f = font("Outfit", int(30 * scale), "Medium")
    d.text((pad, fy), "uniads.co.uk", font=f, fill=OLIVE if dark else TEAL)
    if footnote:
        d.text((w - pad - d.textlength(footnote, font=f), fy), footnote, font=f, fill=sub)
    if page:
        pf = font("Outfit", int(28 * scale), "Medium")
        d.text((w - pad - d.textlength(page, font=pf), pad + int(6 * scale)), page, font=pf, fill=sub)
    return img


def video_frame(spec: dict, frac: float, size=VERT) -> Image.Image:
    """Compose a card into the vertical safe area.

    TikTok, Reels and Stories overlay UI across roughly the bottom fifth, so the
    card renders into the upper region and that band is left clear.
    """
    w, h = size
    safe_h = int(h * 0.79)
    canvas = Image.new("RGB", size, spec["bg"])
    canvas.paste(render_card((w, safe_h), scale=1.3, **spec), (0, 0))
    d = ImageDraw.Draw(canvas)
    bar_y = safe_h + 30
    track = "#2a3a5f" if spec["bg"] in (NAVY, NAVY_DEEP, TEAL) else "#d9dee8"
    d.rectangle([72, bar_y, w - 72, bar_y + 10], fill=track)
    d.rectangle([72, bar_y, 72 + int((w - 144) * frac), bar_y + 10], fill=OLIVE)
    return canvas


def build_video(name: str, cards: list[tuple[float, dict]], size=VERT) -> None:
    if not which("ffmpeg"):
        print("  ffmpeg not found — skipping video")
        return
    tmp = OUT / f".{name}_frames"
    tmp.mkdir(parents=True, exist_ok=True)
    total = sum(d for d, _ in cards)
    elapsed, listing, last = 0.0, [], ""
    for i, (dur, spec) in enumerate(cards):
        elapsed += dur
        last = f"card_{i:02d}.png"
        video_frame(spec, elapsed / total, size).save(tmp / last)
        listing.append(f"file '{last}'\nduration {dur}")
    # The concat demuxer ignores the last entry's duration unless it is repeated.
    listing.append(f"file '{last}'")
    (tmp / "list.txt").write_text("\n".join(listing) + "\n")
    out = OUT / f"{name}.mp4"
    subprocess.run([
        "ffmpeg", "-y", "-loglevel", "error",
        "-f", "concat", "-safe", "0", "-i", str(tmp / "list.txt"),
        "-vf", "fps=30,format=yuv420p",
        "-c:v", "libx264", "-preset", "medium", "-crf", "20",
        "-movflags", "+faststart", str(out),
    ], check=True)
    print(f"  {out.name}  ({out.stat().st_size // 1024} KB, {total:.0f}s)")


# =========================================================================
# CONTENT
#
# "if eligible" and "up to" appear once per funding asset. They are what make
# the big number usable: the package figure is substantiated in brand-facts.md
# section 6c, so it can be defended if anyone ever asks.
# =========================================================================

COURSES = [
    "Business Management",
    "Health & Social Care",
    "Computing",
    "Construction Management",
    "Cyber Security",
    "Accounting & Finance",
]
COURSES_2 = [
    "Psychology & Counselling",
    "Criminology",
    "Law",
    "Digital Marketing",
    "Project Management",
    "Hospitality & Tourism",
]

# ---- Carousel A: no qualifications + start now -------------------------
CAR_START = [
    dict(bg=NAVY, eyebrow="Places open now",
         headline="No GCSEs.\nNo A-Levels.\nNo problem.",
         body="You could be starting university within days.", page="1/6"),
    dict(bg=CREAM, eyebrow="If you're 21 or over",
         headline="Your experience\nis your\nqualification.",
         body="No exams. No UCAS. An interview and a short assessment instead.",
         page="2/6"),
    dict(bg=NAVY, eyebrow="What you get",
         headline="We do all\nof it. Free.",
         bullets=["Course matched to you", "Application handled", "Interview prep",
                  "Student finance sorted"], page="3/6"),
    dict(bg=TEAL, eyebrow="Fits around your life",
         headline="Two days\na week.",
         body="You choose. Mornings, evenings or weekends — so you keep working.",
         page="4/6"),
    dict(bg=CREAM, eyebrow="Funding",
         bignum="£16,000+",
         body="Tuition covered, plus living costs, plus extra if you have children — if you're eligible.",
         page="5/6"),
    dict(bg=NAVY_DEEP, eyebrow="Starting in days, not years",
         headline="Message us\ntoday.",
         body="Tell us your situation and we'll tell you what you can start.",
         cta="Apply now — uniads.co.uk", page="6/6"),
]

# ---- Carousel B: the money --------------------------------------------
CAR_MONEY = [
    dict(bg=NAVY, eyebrow="Funded study",
         headline="You could get\nover £16,000\na year.",
         body="To study. While you study.", page="1/6"),
    dict(bg=CREAM, eyebrow="Your tuition",
         bignum="£9,790",
         body="Covered by a tuition fee loan, paid straight to the university. Nothing upfront.",
         page="2/6"),
    dict(bg=NAVY, eyebrow="Your living costs",
         bignum="£14,135",
         body="Maintenance loan, paid into your bank account each term. Up to this much if you study in London and live away from home.",
         page="3/6"),
    dict(bg=TEAL, eyebrow="If you have children",
         bignum="£199.62",
         body="A week towards childcare for one child. £342.24 for two or more. You never pay this back.",
         page="4/6"),
    dict(bg=CREAM, eyebrow="And on top of that",
         bignum="£2,024",
         body="Parents' Learning Allowance, every year of your course. Also never repaid.",
         page="5/6"),
    dict(bg=NAVY_DEEP, eyebrow="We do the paperwork",
         headline="Find out what\nyou'd get.",
         body="Free, and we'll tell you before you commit to anything.",
         cta="Check yours — uniads.co.uk", page="6/6"),
]

# ---- Carousel C: courses ---------------------------------------------
CAR_COURSES = [
    dict(bg=NAVY, eyebrow="Fully funded degrees",
         headline="What do you\nwant to be?",
         body="Pick the career. We'll find the course and the campus.", page="1/6"),
    dict(bg=CREAM, eyebrow="Choose from", bullets=COURSES, page="2/6"),
    dict(bg=NAVY, eyebrow="And", bullets=COURSES_2, page="3/6"),
    dict(bg=TEAL, eyebrow="Every one of them",
         headline="Two days\na week.",
         bullets=["Foundation year routes", "No qualifications at 21+",
                  "Tuition covered by loan", "Evenings & weekends"], page="4/6"),
    dict(bg=CREAM, eyebrow="Where",
         headline="Ten cities.",
         body="London, Birmingham, Manchester, Leeds, Leicester, Bradford, Luton, Newcastle, Derby, Northampton — plus online and blended.",
         page="5/6"),
    dict(bg=NAVY_DEEP, eyebrow="Places are going for this intake",
         headline="Tell us the\ncareer. We'll\ndo the rest.",
         cta="Apply now — uniads.co.uk", page="6/6"),
]

# ---- Carousel D: studying with children -------------------------------
CAR_KIDS = [
    dict(bg=NAVY, eyebrow="For parents",
         headline='"I can\'t.\nI\'ve got\nthe kids."',
         body="You can. And there's money for childcare.", page="1/5"),
    dict(bg=CREAM, eyebrow="Childcare Grant",
         bignum="£199.62",
         body="A week towards childcare for one child — £342.24 for two or more. It's a grant, so you never pay it back.",
         page="2/5"),
    dict(bg=NAVY, eyebrow="Parents' Learning Allowance",
         bignum="£2,024",
         body="A year, on top, to help with the cost of studying. Also never repaid.",
         page="3/5"),
    dict(bg=TEAL, eyebrow="And the timetable",
         headline="Two days\na week.\nYou pick.",
         body="School hours, evenings or weekends. Built around your family, not the other way round.",
         page="4/5"),
    dict(bg=NAVY_DEEP, eyebrow="Most parents never hear about this",
         headline="Let's check\nwhat you'd\nget.",
         cta="Message us — uniads.co.uk", page="5/5"),
]

CAROUSELS = {
    "car-start": CAR_START,
    "car-money": CAR_MONEY,
    "car-courses": CAR_COURSES,
    "car-kids": CAR_KIDS,
}

# ---- Vertical videos --------------------------------------------------
VID_NOQUALS = [
    (3.5, dict(bg=NAVY, eyebrow="Places open now", headline="No GCSEs.\nNo A-Levels.")),
    (4.0, dict(bg=CREAM, eyebrow="If you're 21 or over",
               headline="You can still\nstart a degree.",
               body="Your work experience counts instead.")),
    (3.5, dict(bg=TEAL, eyebrow="No exams. No UCAS.",
               headline="An interview.\nThat's it.")),
    (4.0, dict(bg=NAVY_DEEP, eyebrow="We handle the whole application",
               headline="And it costs\nyou nothing.",
               body="Message us today.")),
]

VID_MONEY = [
    (3.5, dict(bg=NAVY, eyebrow="Funded study", bignum="£16,000+",
               body="A year, while you study.")),
    (3.5, dict(bg=CREAM, eyebrow="Tuition",
               headline="Covered.",
               body="Paid straight to the university. Nothing upfront.")),
    (4.0, dict(bg=TEAL, eyebrow="Living costs",
               headline="Paid into\nyour account.",
               body="Every term, if you're eligible.")),
    (4.0, dict(bg=NAVY_DEEP, eyebrow="Got kids? There's more",
               headline="Let's check\nyour number.",
               body="Free. Message us today.")),
]

VID_2DAYS = [
    (3.0, dict(bg=NAVY, eyebrow="University", headline="Two days\na week.")),
    (4.0, dict(bg=CREAM, eyebrow="And you pick them",
               headline="Mornings.\nEvenings.\nWeekends.")),
    (3.5, dict(bg=TEAL, eyebrow="So nothing stops",
               headline="Keep your job.\nKeep your\nincome.")),
    (4.0, dict(bg=NAVY_DEEP, eyebrow="Next intake is filling",
               headline="You could start\nthis month.",
               body="Message us today.")),
]

VID_COURSES = [
    (3.0, dict(bg=NAVY, eyebrow="Fully funded", headline="What do you\nwant to be?")),
    (5.0, dict(bg=CREAM, eyebrow="Choose from", bullets=COURSES[:4])),
    (4.0, dict(bg=TEAL, eyebrow="Or", bullets=COURSES_2[:3])),
    (4.0, dict(bg=NAVY_DEEP, eyebrow="No qualifications needed at 21+",
               headline="Tell us the\ncareer.",
               body="We'll do the rest. Message us.")),
]

VID_UPGRADE = [
    (4.0, dict(bg=NAVY, eyebrow="Be honest",
               headline="How long have\nyou been\nmeaning to?")),
    (4.0, dict(bg=CREAM, eyebrow="Four years from now",
               headline="You could have\na degree.",
               body="Or the exact same job.")),
    (3.5, dict(bg=TEAL, eyebrow="Two days a week",
               headline="You don't have\nto give\nanything up.")),
    (4.0, dict(bg=NAVY_DEEP, eyebrow="Places open for this intake",
               headline="Start this\nmonth.",
               body="Message us today.")),
]

VIDEOS = {
    "vid-noquals": VID_NOQUALS,
    "vid-money": VID_MONEY,
    "vid-2days": VID_2DAYS,
    "vid-courses": VID_COURSES,
    "vid-upgrade": VID_UPGRADE,
}

# ---- Facebook squares -------------------------------------------------
SQUARES = {
    "sq-noquals": dict(bg=NAVY, eyebrow="Places open for this intake",
                       headline="No GCSEs. No\nA-Levels. No\nproblem.",
                       body="If you're 21 or over, your work experience is enough. We handle the whole application, free."),
    "sq-money": dict(bg=NAVY, eyebrow="Funded study",
                     headline="Over £16,000\na year to\nstudy.",
                     body="Tuition covered, living costs paid to you, and extra grants if you have children — if you're eligible."),
    "sq-2days": dict(bg=TEAL, eyebrow="Fits around work",
                     headline="Two days a\nweek. You\npick them.",
                     body="Mornings, evenings or weekends. Keep your job and your income while you study."),
    "sq-kids": dict(bg=NAVY, eyebrow="For parents",
                    headline="£199.62 a week\ntowards\nchildcare.",
                    body="Plus up to £2,024 a year in Parents' Learning Allowance. Grants — you never pay them back."),
    "sq-courses": dict(bg=NAVY_DEEP, eyebrow="Fully funded degrees",
                       headline="What do you\nwant to be?",
                       bullets=COURSES[:4]),
}


def main() -> None:
    ensure_fonts()
    OUT.mkdir(parents=True, exist_ok=True)

    print("Instagram carousels — 1080x1350")
    for name, slides in CAROUSELS.items():
        for i, spec in enumerate(slides, 1):
            render_card(IG, **spec).save(OUT / f"{name}-{i}.png")
        print(f"  {name}-1..{len(slides)}.png")

    print("Facebook squares — 1200x1200")
    for name, spec in SQUARES.items():
        render_card(SQ, scale=1.1, **spec).save(OUT / f"{name}.png")
        print(f"  {name}.png")

    print("Vertical videos — 1080x1920")
    for name, cards in VIDEOS.items():
        build_video(name, cards)

    print(f"\nDone. Output in {OUT}")


if __name__ == "__main__":
    sys.exit(main())
