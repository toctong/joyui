"""Remove near-black background from the hero character art → transparent PNG."""
from pathlib import Path
from PIL import Image

SRC = Path(
    r"C:\Users\liuxiaodi\.cursor\projects\g-project-MarHub\assets"
    r"\c__Users_liuxiaodi_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"22a48262ec966a53cade7c5c91b761bc_images_image-0fc3e31f-8c77-424b-892c-06d4209f2796.jpg"
)
OUT = Path(r"G:\project\joyui\apps\docs\public\brand\hero-character.png")

img = Image.open(SRC).convert("RGBA")
pixels = img.load()
w, h = img.size

# Soft-key near-black: keep the character (skin, hair, glow). Pure black
# corners go fully transparent; mid-dark edges fade so hair fringes don't
# leave a hard matte.
for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        # Luma relative to black
        luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
        # Also treat very dark, low-chroma pixels as background
        chroma = max(r, g, b) - min(r, g, b)
        if luma < 8 and chroma < 12:
            pixels[x, y] = (r, g, b, 0)
        elif luma < 28 and chroma < 18:
            # Soft edge — ramp alpha so hair/glow dissolve cleanly
            t = (luma - 8) / 20.0
            pixels[x, y] = (r, g, b, max(0, min(255, int(a * t))))

OUT.parent.mkdir(parents=True, exist_ok=True)
img.save(OUT, "PNG", optimize=True)
print(f"wrote {OUT} ({OUT.stat().st_size} bytes) {w}x{h}")
