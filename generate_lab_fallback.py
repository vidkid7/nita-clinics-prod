#!/usr/bin/env python3
"""Convert lab-fallback-data.json to a TypeScript module that matches
the DiagnosticCategory and DiagnosticTest types used by the frontend.

Output: frontend/src/lib/diagnostic-data-fallback.ts
"""
import json
import os
import re
import sys
import urllib.parse
from pathlib import Path

ROOT = Path("D:/Nita_clinik")
JSON_PATH = ROOT / "frontend" / "src" / "lib" / "lab-fallback-data.json"
OUT_PATH = ROOT / "frontend" / "src" / "lib" / "diagnostic-data-fallback.ts"

PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80"


def js_str(s):
    """Encode a string for safe use inside a JS double-quoted string."""
    if s is None:
        return "null"
    s = str(s)
    s = s.replace("\\", "\\\\").replace('"', '\\"')
    s = s.replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t")
    return f'"{s}"'


def js_array(items):
    return "[" + ", ".join(items) + "]"


def js_str_array(items):
    return js_array([js_str(x) for x in (items or [])])


def js_num(n):
    if n is None:
        return "0"
    return str(n)


def js_bool(b):
    return "true" if b else "false"


def main():
    if not JSON_PATH.exists():
        raise SystemExit(f"Run dump_lab_data.py first to create {JSON_PATH}")

    data = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    cats = data.get("categories", [])
    tests = data.get("tests", [])

    lines = []
    lines.append("/**")
    lines.append(" * STATIC FALLBACK for lab tests. Auto-generated from the production database by")
    lines.append(" * scripts/dump_lab_data.py. Used by /diagnostic-test when the backend API is")
    lines.append(" * unreachable (e.g. before the Render service is provisioned).")
    lines.append(" *")
    lines.append(" * Last sync: pulled from Supabase `nita-clinics` (ref egkdaebiwaamwgkgnuav) at")
    lines.append(" * build time. To refresh, run `python dump_lab_data.py frontend/src/lib/lab-fallback-data.json`")
    lines.append(" * and then `python generate_lab_fallback.py`.")
    lines.append(" */")
    lines.append("")
    lines.append("import type { DiagnosticCategory, DiagnosticTest } from './diagnostic-data';")
    lines.append("")
    lines.append("export const FALLBACK_LAB_CATEGORIES: DiagnosticCategory[] = [")
    for c in cats:
        slug = js_str(c.get("slug") or "")
        label = js_str(c.get("name") or "")
        icon = js_str(c.get("icon") or "🔬")
        description = js_str(c.get("description") or "")
        lines.append("  {")
        lines.append(f"    slug: {slug},")
        lines.append(f"    label: {label},")
        lines.append(f"    icon: {icon},")
        lines.append(f"    description: {description},")
        lines.append("    color: 'bg-primary-600',")
        lines.append("  },")
    lines.append("];")
    lines.append("")
    lines.append("export const FALLBACK_LAB_TESTS: DiagnosticTest[] = [")
    for t in tests:
        slug = js_str(t.get("slug") or "")
        name = js_str(t.get("name") or "")
        description = js_str(t.get("description") or "")
        long_desc = js_str(t.get("long_description")) if t.get("long_description") else "undefined"
        price = js_num(t.get("price") or 0)
        original = js_num(t.get("original_price") or 0)
        image_raw = t.get("image")
        image = js_str(image_raw) if image_raw else "undefined"
        turnaround = js_str(t.get("turnaround") or "—")
        sample = js_str(t.get("sample_type") or "—")
        popular = js_bool(t.get("is_popular"))
        tags = js_str_array(t.get("tags") or [])
        includes = js_str_array(t.get("includes") or [])
        cat_slug = js_str(t.get("category_slug") or "")
        cat_name = js_str(t.get("category_name") or "")
        cat_id_raw = t.get("category_id")
        cat_id = js_str(cat_id_raw) if cat_id_raw else "undefined"
        id_str = js_str(t.get("id") or "")
        lines.append("  {")
        lines.append(f"    id: {id_str},")
        if slug != '""':
            lines.append(f"    slug: {slug},")
        lines.append(f"    name: {name},")
        lines.append(f"    category: {cat_name},")
        lines.append(f"    categorySlug: {cat_slug},")
        if cat_id != "undefined":
            lines.append(f"    categoryId: {cat_id},")
        lines.append(f"    description: {description},")
        if long_desc != "undefined":
            lines.append(f"    longDescription: {long_desc},")
        lines.append(f"    price: {price},")
        lines.append(f"    originalPrice: {original},")
        if image != "undefined":
            lines.append(f"    image: {image},")
        lines.append(f"    turnaround: {turnaround},")
        lines.append(f"    sampleType: {sample},")
        lines.append(f"    isPopular: {popular},")
        lines.append(f"    tags: {tags},")
        lines.append(f"    includes: {includes},")
        lines.append("  },")
    lines.append("];")
    lines.append("")

    OUT_PATH.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {len(cats)} categories + {len(tests)} tests to {OUT_PATH}")


if __name__ == "__main__":
    main()
