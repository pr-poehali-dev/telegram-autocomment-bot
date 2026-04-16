"""
Генерация аватарки через FLUX и никнейма/описания через OpenAI.
POST /generate-avatar — body: { "type": "avatar"|"nickname"|"bio"|"all", "gender": "female"|"male", "style": "..." }
"""
import json
import os
import base64
import random
import boto3
import urllib.request
import psycopg2

SCHEMA = os.environ["MAIN_DB_SCHEMA"]

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

FEMALE_PROMPTS = [
    "portrait photo of a beautiful young russian woman, natural lighting, soft background, professional headshot, realistic",
    "close-up portrait of attractive slavic girl, warm smile, candid photo style, Instagram aesthetic",
    "young professional woman 25 years old, friendly smile, natural makeup, soft bokeh background, photorealistic",
]

MALE_PROMPTS = [
    "portrait photo of a handsome young russian man, natural lighting, professional headshot, realistic",
    "close-up portrait of attractive slavic man 28 years old, friendly smile, casual style, photorealistic",
]

NICKNAMES_FEMALE = [
    "anastasiya_life", "marina_vibes", "katya_art", "natasha_blog", "oksana_world",
    "alina_stories", "dasha_daily", "yulia_mood", "lera_style", "sonya_travel",
    "vika_notes", "masha_real", "polina_sky", "tanya_vibes", "sveta_moment",
]

NICKNAMES_MALE = [
    "alexey_pro", "ivan_notes", "dmitry_life", "sergey_view", "nikolay_blog",
    "andrey_world", "maxim_daily", "artem_stories", "roman_vibes", "kirill_sky",
]

BIOS_FEMALE = [
    "Люблю путешествия и хороший кофе ☕ | Делюсь интересным каждый день",
    "Фотограф-любитель 📸 | Москва | Жизнь в деталях",
    "Читаю, думаю, делюсь мыслями 📚 | Позитив и честность",
    "Дизайнер по жизни 🎨 | Красота в простом",
    "Путешественница 🌍 | Ищу вдохновение везде",
]

BIOS_MALE = [
    "Технологии и жизнь 💡 | Делюсь полезным",
    "Аналитик и любитель споров 📊 | Москва",
    "Разработчик. Читаю книги. Иногда пишу. 💻",
    "Предприниматель | Про бизнес и жизнь",
    "Фотограф 📷 | Путешествия | Впечатления",
]


def upload_to_s3(image_bytes: bytes, filename: str) -> str:
    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )
    s3.put_object(Bucket="files", Key=f"avatars/{filename}", Body=image_bytes, ContentType="image/jpeg")
    return f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/avatars/{filename}"


def generate_flux_image(prompt: str) -> bytes:
    import urllib.request, urllib.error
    api_key = os.environ.get("FLUX_API_KEY", "")
    payload = json.dumps({"prompt": prompt, "width": 512, "height": 512, "num_inference_steps": 20}).encode()
    req = urllib.request.Request(
        "https://api.poehali.dev/v1/flux",
        data=payload,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read())
    img_b64 = data.get("image") or data.get("images", [""])[0]
    return base64.b64decode(img_b64)


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    gen_type = body.get("type", "all")
    gender = body.get("gender", "female")
    account_id = body.get("account_id")
    count = int(body.get("count", 1))

    results = []

    for _ in range(count):
        item = {}

        if gen_type in ("avatar", "all"):
            prompts = FEMALE_PROMPTS if gender == "female" else MALE_PROMPTS
            prompt = random.choice(prompts)
            img_bytes = generate_flux_image(prompt)
            import time
            filename = f"avatar_{int(time.time() * 1000)}_{random.randint(1000, 9999)}.jpg"
            url = upload_to_s3(img_bytes, filename)
            item["avatar_url"] = url

        if gen_type in ("nickname", "all"):
            pool = NICKNAMES_FEMALE if gender == "female" else NICKNAMES_MALE
            suffix = str(random.randint(10, 999))
            item["username"] = random.choice(pool) + suffix

        if gen_type in ("bio", "all"):
            pool = BIOS_FEMALE if gender == "female" else BIOS_MALE
            item["bio"] = random.choice(pool)

        if gen_type in ("name", "all"):
            female_names = ["Анастасия", "Марина", "Катерина", "Наталья", "Алина", "Дарья", "Юлия", "Полина"]
            male_names = ["Алексей", "Иван", "Дмитрий", "Сергей", "Андрей", "Максим", "Артём"]
            pool = female_names if gender == "female" else male_names
            item["display_name"] = random.choice(pool)

        results.append(item)

    # If single account_id — save first result to DB
    if account_id and results:
        r = results[0]
        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor()
        fields = []
        values = []
        for f in ["username", "bio", "avatar_url", "display_name"]:
            if f in r:
                fields.append(f"{f} = %s")
                values.append(r[f])
        if fields:
            fields.append("updated_at = NOW()")
            values.append(int(account_id))
            cur.execute(
                f"UPDATE {SCHEMA}.accounts SET {', '.join(fields)} WHERE id = %s",
                values,
            )
            conn.commit()
        conn.close()

    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({"results": results}),
    }
