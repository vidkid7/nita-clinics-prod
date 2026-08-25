#!/usr/bin/env python3
"""Convert all-fallback.json into a single TypeScript fallback module
(frontend/src/lib/static-content-fallback.ts). This file is the single source of
truth for offline-first rendering of public-facing pages when the backend is
unreachable.
"""
import json
from pathlib import Path

ROOT = Path("D:/Nita_clinik")
JSON_PATH = ROOT / "frontend" / "src" / "lib" / "all-fallback.json"
OUT_PATH = ROOT / "frontend" / "src" / "lib" / "static-content-fallback.ts"


def js_str(s):
    if s is None:
        return "null"
    s = str(s)
    s = s.replace("\\", "\\\\").replace('"', '\\"')
    s = s.replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t")
    return f'"{s}"'


def js_array(items):
    return "[" + ", ".join(items) + "]"


def js_str_array(items):
    if not items:
        return "[]"
    return "[" + ", ".join(js_str(x) for x in items) + "]"


def js_num(n):
    if n is None:
        return "0"
    return str(n)


def js_bool(b):
    return "true" if b else "false"


def js_value(v):
    """Best-effort JS literal for an arbitrary Python value (dicts, lists, primitives)."""
    if v is None:
        return "null"
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, str):
        return js_str(v)
    if isinstance(v, list):
        return "[" + ", ".join(js_value(x) for x in v) + "]"
    if isinstance(v, dict):
        parts = []
        for k, vv in v.items():
            parts.append(f"{js_str(str(k))}: {js_value(vv)}")
        return "{" + ", ".join(parts) + "}"
    return js_str(str(v))


def emit_obj(name, rows, keys_to_camel=None):
    """Emit `export const NAME: T[] = [ ... ];` with one object per row.
    keys_to_camel maps snake_case DB column -> camelCase TS property.
    """
    if keys_to_camel is None:
        keys_to_camel = {}
    out = [f"export const {name} = ["]
    for row in rows:
        parts = ["{"]
        for k, v in row.items():
            tkey = keys_to_camel.get(k, k)
            parts.append(f"  {tkey}: {js_value(v)},")
        parts.append("},")
        out.append("\n".join(parts))
    out.append("];")
    return "\n".join(out)


def main():
    data = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    blocks = []

    # Header
    blocks.append("""/**
 * STATIC FALLBACK for non-lab public content. Auto-generated from the
 * production database by `python dump_all_data.py` and
 * `python generate_static_fallback.py`.
 *
 * Used by the homepage and public pages (doctors, services, blog, gallery,
 * checkup, vaccination, health-card) when the Render backend is unreachable
 * (e.g. before the Render service is provisioned).
 *
 * Last sync: pulled from Supabase `nita-clinics` (ref egkdaebiwaamwgkgnuav) at
 * build time.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Departments
// ─────────────────────────────────────────────────────────────────────────────
""")
    blocks.append(emit_obj("FALLBACK_DEPARTMENTS", data.get("departments", []), {
        "department_id": "id",
    }))

    blocks.append("""

// ─────────────────────────────────────────────────────────────────────────────
// Doctors
// ─────────────────────────────────────────────────────────────────────────────
""")
    blocks.append(emit_obj("FALLBACK_DOCTORS", data.get("doctors", []), {
        "consultation_fee": "consultationFee",
        "is_active": "isActive",
        "staff_type": "staffType",
        "department_id": "departmentId",
        "department_name": "departmentName",
        "department_slug": "departmentSlug",
    }))

    blocks.append("""

// ─────────────────────────────────────────────────────────────────────────────
// Services
// ─────────────────────────────────────────────────────────────────────────────
""")
    blocks.append(emit_obj("FALLBACK_SERVICES", data.get("services", []), {
        "short_description": "shortDescription",
        "department_id": "departmentId",
    }))

    blocks.append("""

// ─────────────────────────────────────────────────────────────────────────────
// Checkup packages
// ─────────────────────────────────────────────────────────────────────────────
""")
    blocks.append(emit_obj("FALLBACK_PACKAGES", data.get("packages", []), {
        "target_group": "targetGroup",
        "age_label": "ageLabel",
        "original_price": "originalPrice",
        "discounted_price": "discountedPrice",
        "cta_label": "ctaLabel",
        "cta_link": "ctaLink",
        "is_active": "isActive",
        "free_doctor_consultation": "freeDoctorConsultation",
    }))

    blocks.append("""

// ─────────────────────────────────────────────────────────────────────────────
// Vaccines
// ─────────────────────────────────────────────────────────────────────────────
""")
    blocks.append(emit_obj("FALLBACK_VACCINES", data.get("vaccines", []), {
        "short_name": "shortName",
        "long_description": "longDescription",
        "who_it_is_for": "whoItIsFor",
        "protects_against": "protectsAgainst",
        "side_effects": "sideEffects",
        "contraindications": "contraindications",
        "price_note": "priceNote",
        "is_active": "isActive",
    }))

    blocks.append("""

// ─────────────────────────────────────────────────────────────────────────────
// Health-card categories
// ─────────────────────────────────────────────────────────────────────────────
""")
    blocks.append(emit_obj("FALLBACK_HEALTH_CARD_CATEGORIES", data.get("health_card_categories", []), {
        "opd_discount": "opdDiscount",
        "lab_discount": "labDiscount",
        "medicine_discount": "medicineDiscount",
        "queue_benefit": "queueBenefit",
        "total_cards": "totalCards",
        "issued_cards": "issuedCards",
        "is_active": "isActive",
    }))

    blocks.append("""

// ─────────────────────────────────────────────────────────────────────────────
// Testimonials
// ─────────────────────────────────────────────────────────────────────────────
""")
    blocks.append(emit_obj("FALLBACK_TESTIMONIALS", data.get("testimonials", []), {
        "is_active": "isActive",
    }))

    blocks.append("""

// ─────────────────────────────────────────────────────────────────────────────
// Blog posts
// ─────────────────────────────────────────────────────────────────────────────
""")
    blocks.append(emit_obj("FALLBACK_BLOG_POSTS", data.get("blog_posts", []), {
        "featured_image": "featuredImage",
        "is_published": "isPublished",
        "published_at": "publishedAt",
        "reading_time": "readingTime",
    }))

    blocks.append("""

// ─────────────────────────────────────────────────────────────────────────────
// Partners
// ─────────────────────────────────────────────────────────────────────────────
""")
    blocks.append(emit_obj("FALLBACK_PARTNERS", data.get("partners", []), {
        "logo_url": "logoUrl",
        "is_active": "isActive",
    }))

    blocks.append("""

// ─────────────────────────────────────────────────────────────────────────────
// Media files (gallery)
// ─────────────────────────────────────────────────────────────────────────────
""")
    blocks.append(emit_obj("FALLBACK_MEDIA", data.get("media", []), {
        "public_id": "publicId",
        "mime_type": "mimeType",
    }))

    blocks.append("""

// ─────────────────────────────────────────────────────────────────────────────
// Settings (key/value)
// ─────────────────────────────────────────────────────────────────────────────
""")
    settings = data.get("settings", [])
    blocks.append("export const FALLBACK_SETTINGS: Array<{ key: string; value: string; category: string | null; description: string | null }> = [")
    for s in settings:
        cat = js_str(s.get("category")) if s.get("category") is not None else "null"
        desc = js_str(s.get("description")) if s.get("description") is not None else "null"
        blocks.append(f"  {{ key: {js_str(s.get('key'))}, value: {js_str(s.get('value'))}, category: {cat}, description: {desc} }},")
    blocks.append("];")

    blocks.append("""

/**
 * Map of FALLBACK_SETTINGS by key, for O(1) lookups. Same data as
 * FALLBACK_SETTINGS, just indexed.
 */
export const FALLBACK_SETTINGS_MAP: Record<string, string> = FALLBACK_SETTINGS.reduce(
  (acc, s) => {
    if (s.key) acc[s.key] = s.value;
    return acc;
  },
  {} as Record<string, string>,
);
""")

    OUT_PATH.write_text("\n".join(blocks), encoding="utf-8")

    # Count sizes
    counts = {k: len(v) for k, v in data.items()}
    print(f"Wrote {OUT_PATH} ({OUT_PATH.stat().st_size} bytes)")
    for k, n in counts.items():
        print(f"  {k}: {n}")


if __name__ == "__main__":
    main()
