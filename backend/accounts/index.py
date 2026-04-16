"""
CRUD для аккаунтов: GET /accounts, POST /accounts, PUT /accounts?id=N, DELETE /accounts?id=N.
Каждый аккаунт — платформа (tg/vk), токен, ник, аватарка, описание.
"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

SCHEMA = os.environ["MAIN_DB_SCHEMA"]

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    account_id = params.get("id")

    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    if method == "GET":
        cur.execute(
            f"SELECT id, platform, username, link, display_name, bio, avatar_url, is_active, created_at FROM {SCHEMA}.accounts ORDER BY platform, id"
        )
        rows = [dict(r) for r in cur.fetchall()]
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps(rows, default=str)}

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        cur2 = conn.cursor(cursor_factory=RealDictCursor)
        cur2.execute(
            f"""INSERT INTO {SCHEMA}.accounts (platform, username, token, link, display_name, bio, avatar_url, is_active)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id, platform, username, link, display_name, bio, avatar_url, is_active""",
            (
                body.get("platform", "tg"),
                body.get("username", ""),
                body.get("token", ""),
                body.get("link", ""),
                body.get("display_name", ""),
                body.get("bio", ""),
                body.get("avatar_url", ""),
                body.get("is_active", True),
            ),
        )
        row = dict(cur2.fetchone())
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps(row, default=str)}

    if method == "PUT" and account_id:
        body = json.loads(event.get("body") or "{}")
        fields = []
        values = []
        for field in ["username", "token", "link", "display_name", "bio", "avatar_url", "is_active"]:
            if field in body:
                fields.append(f"{field} = %s")
                values.append(body[field])
        if not fields:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "no fields"})}
        fields.append("updated_at = NOW()")
        values.append(int(account_id))
        cur.execute(
            f"UPDATE {SCHEMA}.accounts SET {', '.join(fields)} WHERE id = %s RETURNING id",
            values,
        )
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    if method == "DELETE" and account_id:
        cur.execute(f"DELETE FROM {SCHEMA}.accounts WHERE id = %s", (int(account_id),))
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    conn.close()
    return {"statusCode": 405, "headers": CORS, "body": "Method Not Allowed"}
