#!/usr/bin/env python3
"""Dump all lab test categories and tests from the Supabase database to JSON.
Used to generate a static fallback for the frontend when the backend is offline.
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


def main():
    out_path = sys.argv[1] if len(sys.argv) > 1 else "lab-fallback.json"
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("""
      SELECT json_agg(row_to_json(t) ORDER BY t."order", t.name)
      FROM (SELECT id, slug, name, icon, color, description, "order"
            FROM public.lab_test_categories) t;
    """)
    cats_raw = cur.fetchone()[0]

    cur.execute("""
      SELECT json_agg(row_to_json(t) ORDER BY t.cat_order, t.test_order, t.name)
      FROM (
        SELECT
          t.id, t.slug, t.name, t.description, t.long_description,
          t.price, t.original_price, t.image, t.turnaround, t.sample_type,
          t.is_popular, t.is_active, t.tags, t.includes, t."order" AS test_order,
          c.id AS category_id, c.slug AS category_slug, c.name AS category_name,
          c."order" AS cat_order
        FROM public.lab_tests t
        LEFT JOIN public.lab_test_categories c ON c.id = t.category_id
      ) t;
    """)
    tests_raw = cur.fetchone()[0]

    cur.close()
    conn.close()

    # psycopg2 with json_agg returns the JSON value already-parsed (list/dict).
    cats = cats_raw if cats_raw else []
    tests = tests_raw if tests_raw else []

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({"categories": cats, "tests": tests}, f, indent=2, default=str)
    print(f"Wrote {len(cats)} categories and {len(tests)} tests to {out_path}")


if __name__ == "__main__":
    main()
