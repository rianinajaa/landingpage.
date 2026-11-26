"""Editorial case-study covers for the selected-work panels. Original artwork."""

from PIL import Image, ImageDraw, ImageFont

W, H = 2000, 1320
OUT = "/workspace/assets/art"
REG = "/usr/share/fonts/truetype/macos/Inter-Regular.ttf"
MED = "/usr/share/fonts/truetype/macos/Inter-Medium.ttf"
BOLD = "/usr/share/fonts/truetype/macos/Inter-Bold.ttf"


def font(path, size):
    return ImageFont.truetype(path, size)


def save(im, name):
    path = f"{OUT}/{name}.png"
    im.save(path, "PNG", optimize=True)
    print(path, im.size)


def helio():
    im = Image.new("RGB", (W, H), "#e6e0d4")
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, 18, H), fill="#1c1e22")
    d.text((96, 86), "CASE 01  /  CLIMATE", font=font(MED, 28), fill="#5e594f")
    d.text((96, 250), "HELIO", font=font(BOLD, 210), fill="#16181b")
    d.text((100, 490), "Reading a changing planet\nwithout the noise of a dashboard.", font=font(REG, 42), fill="#2a2c30", spacing=12)
    # orbital diagram
    cx, cy, r = 1500, 760, 280
    d.ellipse((cx - r, cy - r, cx + r, cy + r), outline="#1c1e22", width=3)
    d.ellipse((cx - 150, cy - 150, cx + 150, cy + 150), outline="#8d8678", width=2)
    d.ellipse((cx - 18, cy - 18, cx + 18, cy + 18), fill="#1c1e22")
    d.line((cx - r, cy, cx + r, cy), fill="#1c1e22", width=2)
    d.ellipse((cx + 230, cy - 28, cx + 286, cy + 28), fill="#9c4a32")
    d.text((96, 1160), "2025   Product, identity", font=font(MED, 30), fill="#3c3934")
    save(im, "helio")


def vesper():
    im = Image.new("RGB", (W, H), "#141618")
    d = ImageDraw.Draw(im)
    d.rectangle((80, 80, W - 80, H - 80), outline="#3a342c", width=2)
    d.text((140, 150), "HOSPITALITY", font=font(MED, 28), fill="#b7a48c")
    d.text((140, 360), "VESPER", font=font(BOLD, 196), fill="#f3efe6")
    d.line((140, 620, 520, 620), fill="#c4a27a", width=2)
    d.text((140, 670), "Arrival, treated as a ritual.\nA hotel brand for the hours after dusk.", font=font(REG, 40), fill="#d9d0c3", spacing=14)
    d.text((140, 1080), "2024", font=font(MED, 32), fill="#b7a48c")
    # a thin vertical brass mark
    d.rectangle((W - 220, 180, W - 214, H - 180), fill="#c4a27a")
    save(im, "vesper")


def kindred():
    im = Image.new("RGB", (W, H), "#f4f1ea")
    d = ImageDraw.Draw(im)
    d.text((90, 80), "MEMBER HEALTH", font=font(MED, 28), fill="#6d675e")
    d.text((90, 180), "Kindred", font=font(BOLD, 168), fill="#1b1c1e")
    # grid of quiet blocks
    x0, y0 = 90, 480
    colors = ["#e4ddd2", "#d5cdc0", "#c4a48a", "#ece7df", "#d9d3c8", "#efeae3"]
    for i in range(6):
        x = x0 + (i % 3) * 250
        y = y0 + (i // 3) * 230
        d.rounded_rectangle((x, y, x + 220, y + 200), radius=8, fill=colors[i])
    d.text((980, 560), "Medicine that\nleaves room\nfor a person.", font=font(REG, 54), fill="#222326", spacing=10)
    d.text((980, 980), "2025    Brand, product", font=font(MED, 30), fill="#5c574f")
    save(im, "kindred")


def northwind():
    im = Image.new("RGB", (W, H), "#1c2824")
    d = ImageDraw.Draw(im)
    d.text((100, 90), "OUTDOOR EQUIPMENT", font=font(MED, 28), fill="#b7c3b4")
    d.text((100, 240), "NORTH\nWIND", font=font(BOLD, 180), fill="#f4f6f2", spacing= -12)
    # ridge
    pts = [(100, 980), (360, 760), (560, 860), (820, 640), (1100, 900), (1400, 700), (1680, 860), (1900, 740)]
    d.line(pts, fill="#e7efe4", width=4, joint="curve")
    d.line([(100, 1040), (1900, 1040)], fill="#8ea392", width=2)
    d.text((100, 1120), "2024     Commerce, campaign", font=font(MED, 30), fill="#c5d0c2")
    save(im, "northwind")


def sable():
    im = Image.new("RGB", (W, H), "#efece6")
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, W, 16), fill="#1a1b1d")
    d.text((100, 90), "PRIVATE MARKETS", font=font(MED, 28), fill="#5a564e")
    d.text((100, 220), "SABLE", font=font(BOLD, 200), fill="#141516")
    rows = [
        ("01", "Patience", "Long holds"),
        ("02", "Clarity", "Plain language"),
        ("03", "Reserve", "No theatre"),
    ]
    y = 620
    for num, title, note in rows:
        d.line((100, y, 1900, y), fill="#1a1b1d", width=2)
        d.text((100, y + 28), num, font=font(MED, 32), fill="#8a4032")
        d.text((280, y + 24), title, font=font(BOLD, 42), fill="#161718")
        d.text((1100, y + 32), note, font=font(REG, 34), fill="#4e4a44")
        y += 150
    d.text((100, 1160), "2025", font=font(MED, 30), fill="#4e4a44")
    save(im, "sable")


if __name__ == "__main__":
    helio()
    vesper()
    kindred()
    northwind()
    sable()
