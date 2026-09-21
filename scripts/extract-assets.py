"""Extract original raster boards from Portfolio.pdf; preserve artwork and provenance."""
from pathlib import Path
from io import BytesIO
from PIL import Image
from pypdf import PdfReader
import json

root = Path(__file__).resolve().parent.parent
pdf = PdfReader(root / 'files/Portfolio.pdf')
manifest = {}
for page_number in range(3, 27):
    image = Image.open(BytesIO(pdf.pages[page_number-1].images[0].data)).convert('RGB')
    image.save(root / f'assets/boards/page-{page_number}.webp', quality=88)
    small = image.copy(); small.thumbnail((1152, 1152))
    small.save(root / f'assets/boards/page-{page_number}-small.webp', quality=82)
    manifest[str(page_number)] = {'width': image.width, 'height': image.height}

# Coordinates are normalized to the original 2304 x 1296 PDF page images.
crops = {
    'canteen': (3, (.684, .323, .953, .643)),
    'single-residence': (5, (.552, .105, .778, .641)),
    'collective-housing': (8, (.025, .065, .505, .667)),
    'urban-square': (12, (.04, .05, .52, .65)),
    'playground-boundary': (17, (.13, .055, .87, .91)),
    'urban-planning': (24, (.665, .374, .922, .63)),
}
for name, (page, box) in crops.items():
    image = Image.open(BytesIO(pdf.pages[page-1].images[0].data)).convert('RGB')
    image = image.crop(tuple(round(v * (image.width if i % 2 == 0 else image.height)) for i,v in enumerate(box)))
    image.save(root / f'assets/plans/{name}.webp', quality=93)
    manifest[name] = {'page': page, 'crop': box, 'width': image.width, 'height': image.height}
sketch = Image.open(root / 'assets/sketches/landscape-assembly.jpeg')
sketch.thumbnail((1200,1600)); sketch.save(root/'assets/sketches/landscape-assembly.webp', quality=88)
(root/'assets/provenance.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
