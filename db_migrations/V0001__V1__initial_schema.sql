
CREATE TABLE t_p40197048_telegram_autocomment.settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p40197048_telegram_autocomment.accounts (
  id SERIAL PRIMARY KEY,
  platform VARCHAR(20) NOT NULL,
  username VARCHAR(100),
  token TEXT,
  link TEXT,
  display_name VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p40197048_telegram_autocomment.targets (
  id SERIAL PRIMARY KEY,
  platform VARCHAR(20) NOT NULL,
  handle VARCHAR(200) NOT NULL,
  label VARCHAR(200),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p40197048_telegram_autocomment.comment_examples (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO t_p40197048_telegram_autocomment.comment_examples (text, sort_order) VALUES
  ('Отличный контент! Всегда интересно следить за вашими публикациями 🔥', 1),
  ('Согласен на 100%! Именно так и должно работать. Кстати, у нас похожий кейс — {ссылка}', 2),
  ('Интересная тема! Подскажите, как вы пришли к такому решению?', 3),
  ('Спасибо за полезный материал! Сохранил себе 📌', 4);

INSERT INTO t_p40197048_telegram_autocomment.settings (key, value) VALUES
  ('bot_status', 'stopped'),
  ('tg_interval_sec', '90'),
  ('vk_interval_sec', '120'),
  ('tg_max_per_hour', '12'),
  ('vk_max_per_hour', '18'),
  ('webhook_url', ''),
  ('bot_toggles', '{"autopost":true,"errors":true,"ab":false,"realtime":true,"email":false}');
