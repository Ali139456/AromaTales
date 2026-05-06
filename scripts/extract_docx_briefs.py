import json
import re
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCX = ROOT / "Untitled document.docx"
OUT = ROOT / "scripts" / "briefs_by_oil.json"

z = zipfile.ZipFile(DOCX)
xml = z.read("word/document.xml").decode("utf-8")
plain = re.sub(r"</w:p>", "\n", xml)
plain = re.sub(r"<[^>]+>", "", plain)
plain = plain.replace("\u2019", "'").replace("\u201c", '"').replace("\u201d", '"')

# Split into blocks starting with "Here's..." intro lines
blocks = re.split(r"\n(?=Here.s (?:the|your))", plain)
briefs = {}
for block in blocks:
    block = block.strip()
    if not block or "BRIEF" not in block:
        continue
    m = re.search(
        r"brief for\s+(.+?)\s+with\s+(?:a\s+)?40%|note for your\s+(?:second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)\s+perfume,?\s+([^:\n]+):|perfume,?\s+([^:\n]+):",
        block,
        re.I | re.DOTALL,
    )
    name = None
    if m:
        name = m.group(1) or m.group(2) or m.group(3)
    if not name:
        continue
    name = re.sub(r"\s+", " ", name).strip()
    # Normalize trailing punctuation
    name = name.rstrip(" .")
    briefs[name] = block.strip()

OUT.write_text(json.dumps(briefs, indent=2, ensure_ascii=False), encoding="utf-8")
print("keys", len(briefs))
for k in sorted(briefs.keys()):
    print("-", repr(k))
