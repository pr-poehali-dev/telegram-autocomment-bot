"""
Управление настройками бота: GET /settings, POST /settings.
Хранит пары key/value в БД, включает comment_examples, targets, bot_status.
"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

SCHEMA = os.environ["MAIN_DB_SCHEMA"]

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")

    if method == "GET":
        conn = get_conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute(f"SELECT key, value FROM {SCHEMA}.settings")
        rows = cur.fetchall()
        settings = {r["key"]: r["value"] for r in rows}

        cur.execute(f"SELECT id, text, sort_order FROM {SCHEMA}.comment_examples ORDER BY sort_order, id")
        comments = [dict(r) for r in cur.fetchall()]

        cur.execute(f"SELECT id, platform, handle, label, is_active FROM {SCHEMA}.targets ORDER BY platform, id")
        targets = [dict(r) for r in cur.fetchall()]

        conn.close()
        return {
            "statusCode": 200,
            "headers": CORS,
            "body": json.dumps({"settings": settings, "comments": comments, "targets": targets}, default=str),
        }

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        conn = get_conn()
        cur = conn.cursor()

        # Upsert settings keys
        for key, value in body.get("settings", {}).items():
            cur.execute(
                f"""INSERT INTO {SCHEMA}.settings (key, value, updated_at)
                    VALUES (%s, %s, NOW())
                    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()""",
                (key, str(value) if value is not None else None),
            )

        # Replace comment_examples
        if "comments" in body:
            cur.execute(f"DELETE FROM {SCHEMA}.comment_examples")
            for i, text in enumerate(body["comments"]):
                cur.execute(
                    f"INSERT INTO {SCHEMA}.comment_examples (text, sort_order) VALUES (%s, %s)",
                    (text, i),
                )

        # Replace targets for given platform
        if "targets" in body:
            platform = body.get("targets_platform")
            if platform:
                cur.execute(f"DELETE FROM {SCHEMA}.targets WHERE platform = %s", (platform,))
            for t in body["targets"]:
                cur.execute(
                    f"INSERT INTO {SCHEMA}.targets (platform, handle, label, is_active) VALUES (%s, %s, %s, %s)",
                    (t["platform"], t["handle"], t.get("label", ""), t.get("is_active", True)),
                )

        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    return {"statusCode": 405, "headers": CORS, "body": "Method Not Allowed"}
