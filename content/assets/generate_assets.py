#!/usr/bin/env python3
"""Render the postable graphics and text-card videos for the UNIADS content plan.

Every figure rendered here is taken from content/brand-facts.md. Change a number
in one place only: the CARDS data below. Regenerating is always preferable to
editing an exported PNG, because a hand-edited figure is a compliance problem.

Usage:
    pip install pillow
    python3 content/assets/generate_assets.py

Needs Oswald.ttf and Outfit.ttf (the brand fonts, per src/app/globals.css).
The script downloads them to content/assets/.fonts/ on first run.
ffmpeg is required for the video outputs; images render without it.
"""

from __future__ import annotations

import subprocess
import sys
import urllib.request
from pathlib import Path

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


def ensure_fonts() -> None:
    FONTS.mkdir(parents=True, exist_ok=True)
    for name, url in FONT_SOURCES.items():
        target = FONTS / name
        if target.exists():
            continue
        print(f"downloading {name}")
        urllib.request.urlretrieve(url, target)


def font(family: str, size: int, weight: str = "Bold") -> ImageFont.FreeTypeFont:
    f = ImageFont.truetype(str(FONTS / f"{family}.ttf"), size)
    try:
        f.set_variation_by_name(weight)
    except Exception:
        pass
    return f


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt, max_w: int) -> list[str]:
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


def draw_block(
    draw: ImageDraw.ImageDraw,
    text: str,
    fnt,
    x: int,
    y: int,
    max_w: int,
    fill: str,
    leading: float = 1.12,
) -> int:
    """Draw wrapped text, returning the y position just below it."""
    lines = wrap(draw, text, fnt, max_w)
    asc, desc = fnt.getmetrics()
    step = int((asc + desc) * leading)
    for line in lines:
        draw.text((x, y), line, font=fnt, fill=fill)
        y += step
    return y


def draw_tracked(draw, text, fnt, x, y, fill, tracking: int = 6) -> None:
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
    footnote: str | None = None,
    cta: str | None = None,
    page: str | None = None,
    scale: float = 1.0,
) -> Image.Image:
    w, h = size
    img = Image.new("RGB", size, bg)
    d = ImageDraw.Draw(img)
    dark = bg in (NAVY, NAVY_DEEP, TEAL)
    fg = WHITE if dark else INK
    sub = "#c8cfdd" if dark else MUTED

    pad = int(72 * scale)
    max_w = w - pad * 2

    wordmark(d, pad, pad, OLIVE if dark else NAVY, int(34 * scale))
    rule_y = pad + int(78 * scale)
    d.rectangle([pad, rule_y, pad + int(96 * scale), rule_y + int(7 * scale)], fill=OLIVE)

    # Build the content stack, measure it, then centre it in the space between the
    # header rule and the footer so slides never look top-heavy.
    stack: list[tuple[str, str, object, str, float, int]] = []
    if eyebrow:
        stack.append(("tracked", eyebrow.upper(), font("Outfit", int(30 * scale), "SemiBold"),
                      OLIVE if dark else TEAL, 1.0, int(30 * scale)))
    if headline:
        stack.append(("block", headline, font("Oswald", int(92 * scale), "Bold"),
                      fg, 1.06, int(26 * scale)))
    if bignum:
        stack.append(("block", bignum, font("Oswald", int(190 * scale), "Bold"),
                      OLIVE, 0.98, int(18 * scale)))
    if body:
        stack.append(("block", body, font("Outfit", int(46 * scale), "Regular"),
                      sub, 1.36, 0))

    def measure(kind, text, fnt, leading) -> int:
        asc, desc = fnt.getmetrics()
        step = int((asc + desc) * leading)
        n = 1 if kind == "tracked" else len(wrap(d, text, fnt, max_w))
        return step * n

    content_h = sum(measure(k, t, f, l) + g for k, t, f, _, l, g in stack)
    top = rule_y + int(56 * scale)
    bottom = h - (int(330 * scale) if cta else int(190 * scale))
    y = top + max(0, (bottom - top - content_h) // 2)

    for kind, text, fnt, fill, leading, gap in stack:
        if kind == "tracked":
            d.text((pad, y), "", font=fnt)
            draw_tracked(d, text, fnt, pad, y, fill, tracking=3)
            y += measure(kind, text, fnt, leading)
        else:
            y = draw_block(d, text, fnt, pad, y, max_w, fill, leading)
        y += gap

    if cta:
        by = h - int(296 * scale)
        d.rectangle([pad, by, w - pad, by + int(112 * scale)], fill=OLIVE)
        f = font("Outfit", int(42 * scale), "Bold")
        tw = d.textlength(cta, font=f)
        d.text(((w - tw) / 2, by + int(30 * scale)), cta, font=f, fill=NAVY_DEEP)

    fy = h - int(104 * scale)
    f = font("Outfit", int(30 * scale), "Medium")
    d.text((pad, fy), "uniads.co.uk", font=f, fill=OLIVE if dark else TEAL)
    if footnote:
        tw = d.textlength(footnote, font=f)
        d.text((w - pad - tw, fy), footnote, font=f, fill=sub)

    if page:
        f = font("Outfit", int(28 * scale), "Medium")
        tw = d.textlength(page, font=f)
        d.text((w - pad - tw, pad + int(6 * scale)), page, font=f, fill=sub)

    return img


# --------------------------------------------------------------------------
# Day 1 — the Lifelong Learning Entitlement change
# Figures: brand-facts.md section 6b, sourced from GOV.UK
# --------------------------------------------------------------------------

GOV = "Source: gov.uk"

IG_CAROUSEL = [
    dict(
        bg=NAVY,
        eyebrow="Student finance",
        headline="Student finance\njust changed.",
        body="And if you're applying for a January start, it applies to you.",
        footnote=GOV,
        page="1/6",
    ),
    dict(
        bg=CREAM,
        eyebrow="What's different",
        headline="A new system,\nfrom January.",
        body="Courses starting on or after 1 January 2027 are funded through the "
        "Lifelong Learning Entitlement — not the system you may have read about.",
        footnote=GOV,
        page="2/6",
    ),
    dict(
        bg=NAVY,
        eyebrow="The lifetime cap",
        bignum="£39,160",
        body="That's the total tuition fee loan you can take across your whole life. "
        "About four years of full-time study. Not per course — total.",
        footnote=GOV,
        page="3/6",
    ),
    dict(
        bg=CREAM,
        eyebrow="Studied before?",
        headline="It comes off\nyour total.",
        body="The government's own example: someone who finished a three-year degree "
        "has £9,790 left. That's one year of funding, not four.",
        footnote=GOV,
        page="4/6",
    ),
    dict(
        bg=TEAL,
        eyebrow="One improvement",
        headline="Maintenance loans,\nwidened.",
        body="From January 2027 they're available on all designated in-person courses. "
        "You normally need 120+ credits a year for the full amount, and it still "
        "depends on your household income.",
        footnote=GOV,
        page="5/6",
    ),
    dict(
        bg=NAVY_DEEP,
        eyebrow="Applications opened Sept 2026",
        headline="Not sure which\nsystem you'd\nbe on?",
        body="We check your eligibility properly before you apply anywhere. Free.",
        cta="Ask us before you apply",
        footnote=GOV,
        page="6/6",
    ),
]

FB_SQUARE = dict(
    bg=NAVY,
    eyebrow="Courses starting January 2027",
    headline="The student finance\nrules changed.",
    body="There's now a £39,160 lifetime cap on tuition fee loans — and if you've "
    "studied before, it comes off that total.",
    footnote=GOV,
)

# Day 3 — age arithmetic. Pure arithmetic on the viewer's own age, no earnings claim.
AGES = [(30, 34, 33), (35, 39, 28), (40, 44, 23), (45, 49, 18)]

# TikTok text-card video, tracking SB-13 script 1
TIKTOK_CARDS = [
    (
        4.0,
        dict(
            bg=NAVY,
            eyebrow="Heads up",
            headline="Student finance\nchanged.",
            body="And almost nobody is talking about it.",
            footnote=GOV,
        ),
    ),
    (
        5.5,
        dict(
            bg=CREAM,
            eyebrow="If you start Jan 2027",
            headline="You're on a\nnew system.",
            body="It's called the Lifelong Learning Entitlement.",
            footnote=GOV,
        ),
    ),
    (
        3.0,
        dict(
            bg=TEAL,
            eyebrow="Timing",
            headline="Applications\nopened in\nSeptember.",
            footnote=GOV,
        ),
    ),
    (
        3.5,
        dict(
            bg=NAVY_DEEP,
            eyebrow="Before you apply anywhere",
            headline="Ask which\nsystem you're\napplying under.",
            body="We'll check yours with you. Free.",
            footnote=GOV,
        ),
    ),
]


def video_frame(spec: dict, frac: float, size=(1080, 1920)) -> Image.Image:
    """Compose a card into the vertical safe area.

    TikTok, Reels and Stories overlay their own UI across roughly the bottom fifth
    of the frame, so the card is rendered into the upper region and the lower band
    is left deliberately clear for captions and buttons.
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


def build_video(name: str, cards, size=(1080, 1920)) -> None:
    if not shutil_which("ffmpeg"):
        print("ffmpeg not found — skipping video")
        return
    tmp = OUT / f".{name}_frames"
    tmp.mkdir(parents=True, exist_ok=True)
    total = sum(d for d, _ in cards)
    elapsed = 0.0
    listing = []
    last = ""
    for i, (dur, spec) in enumerate(cards):
        elapsed += dur
        last = f"card_{i:02d}.png"
        video_frame(spec, elapsed / total, size).save(tmp / last)
        listing.append(f"file '{last}'\nduration {dur}")
    # The concat demuxer drops the final entry's duration unless it is repeated.
    listing.append(f"file '{last}'")
    (tmp / "list.txt").write_text("\n".join(listing) + "\n")

    out = OUT / f"{name}.mp4"
    cmd = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-f", "concat", "-safe", "0", "-i", str(tmp / "list.txt"),
        "-vf", "fps=30,format=yuv420p",
        "-c:v", "libx264", "-preset", "medium", "-crf", "20",
        "-movflags", "+faststart",
        str(out),
    ]
    subprocess.run(cmd, check=True)
    print(f"  {out.relative_to(ROOT.parent.parent)}  ({out.stat().st_size // 1024} KB, {total:.0f}s)")


def shutil_which(x):
    from shutil import which

    return which(x)


def main() -> None:
    ensure_fonts()
    OUT.mkdir(parents=True, exist_ok=True)

    print("Instagram carousel — day 1 (LLE), 1080x1350")
    for i, spec in enumerate(IG_CAROUSEL, 1):
        p = OUT / f"day1-ig-carousel-{i}.png"
        render_card((1080, 1350), **spec).save(p)
        print(f"  {p.name}")

    print("Facebook square — day 1, 1200x1200")
    p = OUT / "day1-fb-square.png"
    render_card((1200, 1200), scale=1.1, **FB_SQUARE).save(p)
    print(f"  {p.name}")

    print("Facebook age set — day 3, 1200x1200")
    intro = dict(
        bg=NAVY,
        eyebrow="Let's test that",
        headline='"I\'m too old for\nuniversity."',
        body="Four years, including a foundation year. Then do the arithmetic.",
    )
    render_card((1200, 1200), scale=1.1, **intro).save(OUT / "day3-fb-age-0-intro.png")
    print("  day3-fb-age-0-intro.png")
    for start, grad, years in AGES:
        spec = dict(
            bg=CREAM if start % 10 == 0 else NAVY,
            eyebrow=f"Start at {start}",
            bignum=f"{years}",
            body=f"Start at {start}, graduate at {grad}. If you work to 67, that's "
            f"{years} more years of your working life with a degree behind you.",
        )
        p = OUT / f"day3-fb-age-{start}.png"
        render_card((1200, 1200), scale=1.1, **spec).save(p)
        print(f"  {p.name}")
    render_card(
        (1200, 1200),
        scale=1.1,
        bg=NAVY_DEEP,
        eyebrow="No upper age limit on a tuition fee loan",
        headline="Still feel\nlate?",
        body="Most of our partner programmes run two days a week, with evening and "
        "weekend options.",
        cta="Check your route with us",
    ).save(OUT / "day3-fb-age-5-cta.png")
    print("  day3-fb-age-5-cta.png")

    print("TikTok / Reels text-card video — day 1, 1080x1920")
    build_video("day1-tiktok-lle", TIKTOK_CARDS)

    print(f"\nDone. Output in {OUT}")


if __name__ == "__main__":
    sys.exit(main())
