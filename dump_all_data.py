#!/usr/bin/env python3
"""Dump all the static content we need from the Supabase database to a single
JSON file. Used to generate static fallbacks for the frontend when the backend
is offline (e.g. before Render is provisioned).
"""
import json
import os
import sys
import urllib.parse

import psycopg2  # type: ignore


def get_conn():
    pwd = os.environ.get("PGPASSWORD", "")
    if not pwd:
        raise SystemExit("Set PGPASSWORD env var first")
    enc = urllib.parse.quote(pwd, safe="")
    url = f"postgresql://postgres:{enc}@db.egkdaebiwaamwgkgnuav.supabase.co:5432/postgres"
    return psycopg2.connect(url)


def fetch(cur, sql):
    cur.execute(sql)
    val = cur.fetchone()[0]
    return val if val else []


def main():
    out_path = sys.argv[1] if len(sys.argv) > 1 else "all-fallback.json"
    conn = get_conn()
    cur = conn.cursor()

    data = {}

    # Departments
    data["departments"] = fetch(cur, """
      SELECT json_agg(row_to_json(t) ORDER BY t."order", t.name)
      FROM (SELECT id, slug, name, description, icon, image, "order"
            FROM public.departments WHERE is_active = true) t;
    """)

    # Doctors (joined to departments)
    data["doctors"] = fetch(cur, """
      SELECT json_agg(row_to_json(t) ORDER BY t.department_name, t.experience DESC)
      FROM (
        SELECT
          d.id, d.name, d.email, d.phone, d.photo, d.qualification, d.specialization,
          d.experience, d.consultation_fee, d.bio, d.is_active, d.staff_type,
          dep.id AS department_id, dep.name AS department_name, dep.slug AS department_slug
        FROM public.doctors d
        LEFT JOIN public.departments dep ON dep.id = d.department_id
        WHERE d.is_active = true
      ) t;
    """)

    # Services
    data["services"] = fetch(cur, """
      SELECT json_agg(row_to_json(t) ORDER BY t."order", t.name)
      FROM (SELECT id, slug, name, short_description, description, icon, image,
                   department_id, "order"
            FROM public.services WHERE is_active = true) t;
    """)

    # Checkup packages
    data["packages"] = fetch(cur, """
      SELECT json_agg(row_to_json(t) ORDER BY t.category, t.target_group, t."order", t.name)
      FROM (
        SELECT
          p.id, p.name, p.category, p.target_group, p.age_label,
          p.original_price, p.discounted_price, p.currency,
          p.description, p.tests, p.cta_label, p.cta_link, p.image,
          p.is_active, p."order", p.free_doctor_consultation
        FROM public.checkup_packages p
        WHERE p.is_active = true
      ) t;
    """)

    # Vaccines
    data["vaccines"] = fetch(cur, """
      SELECT json_agg(row_to_json(t) ORDER BY t."order", t.name)
      FROM (
        SELECT
          v.id, v.name, v.slug, v.short_name, v.category, v.tagline,
          v.description, v.long_description, v.image, v.who_it_is_for,
          v.schedule, v.doses, v.protects_against, v.side_effects,
          v.contraindications, v.notes, v.availability, v.price_note,
          v.is_active, v."order"
        FROM public.vaccines v
        WHERE v.is_active = true
      ) t;
    """)

    # Health-card categories
    data["health_card_categories"] = fetch(cur, """
      SELECT json_agg(row_to_json(t) ORDER BY t."order", t.name)
      FROM (
        SELECT id, name, type, opd_discount, lab_discount, medicine_discount,
               queue_benefit, summary, notes, image, price, total_cards,
               issued_cards, is_active, "order"
        FROM public.health_card_categories
        WHERE is_active = true
      ) t;
    """)

    # Testimonials
    data["testimonials"] = fetch(cur, """
      SELECT json_agg(row_to_json(t) ORDER BY t."order", t.name)
      FROM (
        SELECT id, name, role, content, rating, photo, is_active, "order"
        FROM public.testimonials
        WHERE is_active = true
      ) t;
    """)

    # Blog posts (published only)
    data["blog_posts"] = fetch(cur, """
      SELECT json_agg(row_to_json(t) ORDER BY t.published_at DESC)
      FROM (
        SELECT
          id, slug, title, excerpt, content, featured_image, author,
          category, tags, is_published, published_at, views, reading_time
        FROM public.blog_posts
        WHERE is_published = true
      ) t;
    """)

    # Partners
    data["partners"] = fetch(cur, """
      SELECT json_agg(row_to_json(t) ORDER BY t.section, t."order", t.name)
      FROM (
        SELECT id, name, logo_url, alt, url, description, section, is_active, "order"
        FROM public.partners
        WHERE is_active = true
      ) t;
    """)

    # Media files (gallery)
    data["media"] = fetch(cur, """
      SELECT json_agg(row_to_json(t) ORDER BY t.name)
      FROM (
        SELECT id, name, url, public_id, type, mime_type, width, height,
               folder, alt, caption
        FROM public.media_files
      ) t;
    """)

    # Settings (for site-wide values)
    data["settings"] = fetch(cur, """
      SELECT json_agg(row_to_json(t))
      FROM (SELECT key, value, category, description FROM public.settings) t;
    """)

    cur.close()
    conn.close()

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, default=str)

    print(f"Wrote {out_path}")
    for k, v in data.items():
        print(f"  {k}: {len(v)}")


if __name__ == "__main__":
    main()
