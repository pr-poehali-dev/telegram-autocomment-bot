import Icon from "@/components/ui/icon";

export function Dashboard() {
  const metrics = [
    { label: "Комментариев сегодня", value: "1 248", delta: "+18%", icon: "MessageCircle", color: "text-cyan-400" },
    { label: "Активных платформ", value: "6", delta: "stable", icon: "Globe", color: "text-violet-400" },
    { label: "Успешных запросов", value: "98.4%", delta: "+0.3%", icon: "CheckCircle2", color: "text-emerald-400" },
    { label: "Токенов использовано", value: "482K", delta: "+24%", icon: "Cpu", color: "text-amber-400" },
  ];

  const recentActivity = [
    { platform: "Instagram", action: "Оставлен комментарий", post: "@brand_official", time: "2 мин назад", status: "ok" },
    { platform: "Telegram", action: "Отправлен ответ", post: "Канал Tech News", time: "5 мин назад", status: "ok" },
    { platform: "VK", action: "Лайк + комментарий", post: "Пост о продукте", time: "8 мин назад", status: "ok" },
    { platform: "YouTube", action: "Ошибка API", post: "Видео @creator", time: "12 мин назад", status: "error" },
    { platform: "Twitter/X", action: "Реплай добавлен", post: "#нейросети", time: "15 мин назад", status: "ok" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl p-6 glass border border-white/5">
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full status-online inline-block" />
              <span className="text-xs text-emerald-400 font-mono uppercase tracking-widest">Бот активен</span>
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-1">BotControl</h1>
            <p className="text-muted-foreground text-sm">AI-автокомментинг · Последняя активность: только что</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-all">
              <Icon name="Play" size={14} />
              Запустить
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium hover:bg-rose-500/20 transition-all">
              <Icon name="Pause" size={14} />
              Пауза
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div
            key={m.label}
            className="glass border border-white/5 rounded-2xl p-4 card-hover animate-fade-in"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg bg-white/5 ${m.color}`}>
                <Icon name={m.icon as string} size={16} />
              </div>
              <span className={`text-xs font-mono ${m.delta === "stable" ? "text-muted-foreground" : "text-emerald-400"}`}>
                {m.delta}
              </span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-0.5">{m.value}</div>
            <div className="text-xs text-muted-foreground">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="glass border border-white/5 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-sm uppercase tracking-widest text-muted-foreground">Последняя активность</h2>
          <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Все логи →</button>
        </div>
        <div className="space-y-1">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition-colors">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${a.status === "ok" ? "bg-emerald-400" : "bg-rose-400"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-cyan-400">{a.platform}</span>
                  <span className="text-xs text-foreground">{a.action}</span>
                  <span className="text-xs text-muted-foreground truncate hidden sm:block">· {a.post}</span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0 font-mono">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: "MessageSquarePlus", label: "Новый промпт", color: "text-cyan-400", bg: "bg-cyan-500/5" },
          { icon: "Plug2", label: "Добавить API", color: "text-violet-400", bg: "bg-violet-500/5" },
          { icon: "RefreshCw", label: "Сброс кэша", color: "text-amber-400", bg: "bg-amber-500/5" },
        ].map((q) => (
          <button key={q.label} className={`glass border border-white/5 rounded-2xl p-4 card-hover flex flex-col items-center gap-2 ${q.bg}`}>
            <div className={q.color}><Icon name={q.icon as string} size={20} /></div>
            <span className="text-xs text-muted-foreground">{q.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function Stats() {
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const values = [420, 680, 540, 920, 780, 1100, 1248];
  const max = Math.max(...values);

  const platforms = [
    { name: "Instagram", count: 482, color: "bg-pink-500", pct: 38 },
    { name: "Telegram", count: 314, color: "bg-cyan-500", pct: 25 },
    { name: "VK", count: 251, color: "bg-blue-500", pct: 20 },
    { name: "YouTube", count: 125, color: "bg-red-500", pct: 10 },
    { name: "Twitter/X", count: 76, color: "bg-violet-500", pct: 7 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold gradient-text">Статистика</h2>

      <div className="glass border border-white/5 rounded-2xl p-6">
        <div className="flex items-end justify-between mb-2">
          <span className="text-sm font-semibold text-foreground">Комментарии за неделю</span>
          <span className="text-xs text-muted-foreground font-mono">Всего: {values.reduce((a, b) => a + b, 0).toLocaleString()}</span>
        </div>
        <div className="flex items-end gap-2 h-36 mt-4">
          {values.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground font-mono">{v}</span>
              <div
                className="w-full rounded-t-lg"
                style={{
                  height: `${(v / max) * 100}px`,
                  background: i === 6
                    ? "linear-gradient(to top, #00c8d4, #00f5ff)"
                    : "rgba(255,255,255,0.08)",
                }}
              />
              <span className="text-xs text-muted-foreground">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass border border-white/5 rounded-2xl p-6">
        <span className="text-sm font-semibold text-foreground block mb-4">По платформам</span>
        <div className="space-y-3">
          {platforms.map((p, i) => (
            <div key={p.name} className="animate-fade-in" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-foreground">{p.name}</span>
                <span className="text-muted-foreground font-mono">{p.count}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${p.color} rounded-full`} style={{ width: `${p.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Ср. скорость", value: "178/ч", icon: "Zap", color: "text-amber-400" },
          { label: "Ошибок", value: "12", icon: "AlertTriangle", color: "text-rose-400" },
          { label: "Аптайм", value: "99.7%", icon: "Activity", color: "text-emerald-400" },
        ].map((s) => (
          <div key={s.label} className="glass border border-white/5 rounded-2xl p-4 text-center card-hover">
            <div className={`${s.color} flex justify-center mb-2`}><Icon name={s.icon as string} size={20} /></div>
            <div className="text-xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Analytics() {
  const heatmap = Array.from({ length: 7 }, () =>
    Array.from({ length: 24 }, () => Math.random())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-bold gradient-text">Аналитика</h2>

      <div className="grid grid-cols-2 gap-4">
        {[
          { title: "Конверсия кликов", value: "4.7%", trend: "+1.2%", icon: "MousePointerClick", color: "text-cyan-400" },
          { title: "Охват аудитории", value: "84.2K", trend: "+9.4K", icon: "Users", color: "text-violet-400" },
          { title: "Avg. engagement", value: "6.3%", trend: "+0.8%", icon: "Heart", color: "text-pink-400" },
          { title: "API latency", value: "142ms", trend: "-12ms", icon: "Timer", color: "text-amber-400" },
        ].map((k) => (
          <div key={k.title} className="glass border border-white/5 rounded-2xl p-4 card-hover">
            <div className="flex items-center gap-2 mb-2">
              <div className={k.color}><Icon name={k.icon as string} size={16} /></div>
              <span className="text-xs text-muted-foreground">{k.title}</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-foreground">{k.value}</span>
              <span className="text-xs text-emerald-400 font-mono mb-0.5">{k.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="glass border border-white/5 rounded-2xl p-6">
        <span className="text-sm font-semibold text-foreground block mb-4">Тепловая карта активности</span>
        <div className="space-y-1">
          {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day, row) => (
            <div key={day} className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground w-6">{day}</span>
              <div className="flex gap-0.5 flex-1">
                {heatmap[row].map((v, col) => (
                  <div
                    key={col}
                    className="flex-1 h-4 rounded-sm"
                    style={{
                      background: v > 0.7 ? "#00f5ff" : v > 0.4 ? "#00bcd4" : v > 0.15 ? "#1e3a4a" : "#1a2332",
                      opacity: 0.5 + v * 0.5,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass border border-white/5 rounded-2xl p-5">
        <span className="text-sm font-semibold text-foreground block mb-3">Лучшие промпты по вовлечённости</span>
        <div className="space-y-2">
          {[
            { name: "Экспертный отзыв", score: 8.9, uses: 412 },
            { name: "Вопрос к автору", score: 8.2, uses: 328 },
            { name: "Поддержка + CTA", score: 7.7, uses: 256 },
            { name: "Краткий факт", score: 6.4, uses: 190 },
          ].map((p, i) => (
            <div key={p.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/3 transition-colors">
              <span className="text-xs font-mono text-muted-foreground w-4">#{i + 1}</span>
              <span className="flex-1 text-sm text-foreground">{p.name}</span>
              <span className="text-xs text-muted-foreground font-mono">{p.uses} исп.</span>
              <div className="flex items-center gap-1">
                <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500" style={{ width: `${p.score * 10}%` }} />
                </div>
                <span className="text-xs font-mono text-cyan-400">{p.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Prompts() {
  const prompts = [
    { name: "Экспертный отзыв", tags: ["Instagram", "VK"], active: true, text: "Как специалист в этой области, хочу отметить..." },
    { name: "Вопрос к автору", tags: ["Telegram", "YouTube"], active: true, text: "Интересный материал! Подскажите, как вы..." },
    { name: "Поддержка + CTA", tags: ["Instagram"], active: false, text: "Полностью согласен! Кстати, у нас тоже есть..." },
    { name: "Краткий факт", tags: ["Twitter/X", "VK"], active: true, text: "Интересный факт по теме: {fact}. Подробнее..." },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold gradient-text">Промпты</h2>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-all">
          <Icon name="Plus" size={14} />
          Создать
        </button>
      </div>

      <div className="space-y-3">
        {prompts.map((p, i) => (
          <div
            key={p.name}
            className="glass border border-white/5 rounded-2xl p-5 card-hover animate-fade-in"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{p.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${p.active ? "bg-emerald-500/15 text-emerald-400" : "bg-white/5 text-muted-foreground"}`}>
                    {p.active ? "активен" : "выкл"}
                  </span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {p.tags.map((t) => (
                    <span key={t} className="text-xs bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-md border border-cyan-500/15">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
                  <Icon name="Pencil" size={14} />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-rose-400 transition-colors">
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-mono bg-black/20 rounded-lg p-3 border border-white/5">
              {p.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Integrations() {
  const services = [
    { name: "Instagram Graph API", status: "connected", icon: "📸", desc: "v18.0 · Авто-комментинг", rps: "50/ч" },
    { name: "Telegram Bot API", status: "connected", icon: "✈️", desc: "Bot Token · Polling", rps: "∞" },
    { name: "VK API", status: "connected", icon: "💙", desc: "v5.199 · Wall, Comments", rps: "20/с" },
    { name: "YouTube Data API", status: "error", icon: "▶️", desc: "Quota exceeded", rps: "—" },
    { name: "Twitter/X API", status: "pending", icon: "𝕏", desc: "Ожидание подтверждения", rps: "—" },
    { name: "OpenAI GPT-4o", status: "connected", icon: "🤖", desc: "gpt-4o · 128k context", rps: "500/мин" },
    { name: "Webhook Outbound", status: "connected", icon: "🔗", desc: "5 активных endpoint-ов", rps: "—" },
    { name: "Zapier", status: "pending", icon: "⚡", desc: "Настройте триггеры", rps: "—" },
  ];

  const statusStyle: Record<string, string> = {
    connected: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    error: "bg-rose-500/15 text-rose-400 border-rose-500/20",
    pending: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  };
  const statusLabel: Record<string, string> = {
    connected: "Подключено",
    error: "Ошибка",
    pending: "Ожидание",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold gradient-text">Интеграции</h2>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium hover:bg-violet-500/20 transition-all">
          <Icon name="Plus" size={14} />
          Добавить API
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s, i) => (
          <div
            key={s.name}
            className="glass border border-white/5 rounded-2xl p-4 card-hover animate-fade-in"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl leading-none">{s.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-foreground">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.desc}</div>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${statusStyle[s.status]}`}>
                {statusLabel[s.status]}
              </span>
            </div>
            {s.rps !== "—" && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                <Icon name="Gauge" size={10} />
                <span>Лимит: {s.rps}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Logs() {
  const logs = [
    { time: "14:32:01", level: "INFO", msg: "Bot cycle started · platforms=6" },
    { time: "14:32:02", level: "INFO", msg: "Instagram: fetched 12 new posts" },
    { time: "14:32:04", level: "INFO", msg: "GPT-4o: generated 12 comments (avg 0.4s)" },
    { time: "14:32:07", level: "OK", msg: "Instagram: posted 11/12 comments successfully" },
    { time: "14:32:08", level: "WARN", msg: "Instagram: rate limit approaching (42/50)" },
    { time: "14:32:09", level: "INFO", msg: "Telegram: fetched 5 new messages" },
    { time: "14:32:11", level: "OK", msg: "Telegram: replied to 5 messages" },
    { time: "14:32:13", level: "INFO", msg: "VK: fetched 8 new posts" },
    { time: "14:32:15", level: "OK", msg: "VK: posted 8/8 comments" },
    { time: "14:32:16", level: "ERROR", msg: "YouTube: API quota exceeded · retrying in 3600s" },
    { time: "14:32:17", level: "INFO", msg: "Twitter/X: pending activation, skipping" },
    { time: "14:32:18", level: "INFO", msg: "Webhook: sent 3 events to endpoints" },
    { time: "14:32:19", level: "INFO", msg: "Cycle complete · duration=18.4s · tokens=3842" },
    { time: "14:31:01", level: "INFO", msg: "Bot cycle started · platforms=6" },
    { time: "14:31:19", level: "OK", msg: "Cycle complete · duration=17.9s · tokens=3711" },
    { time: "14:30:01", level: "INFO", msg: "Bot cycle started · platforms=6" },
    { time: "14:30:07", level: "WARN", msg: "OpenAI: high latency detected (1240ms)" },
    { time: "14:30:21", level: "OK", msg: "Cycle complete · duration=20.1s · tokens=3990" },
  ];

  const levelStyle: Record<string, string> = {
    INFO: "text-cyan-400/70",
    OK: "text-emerald-400",
    WARN: "text-amber-400",
    ERROR: "text-rose-400",
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold gradient-text">Логи</h2>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full status-online inline-block" />
            Live
          </span>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="Download" size={12} />
            Скачать
          </button>
        </div>
      </div>

      <div className="glass border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 bg-black/30 border-b border-white/5">
          <div className="w-3 h-3 rounded-full bg-rose-500/60" />
          <div className="w-3 h-3 rounded-full bg-amber-500/60" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
          <span className="text-xs text-muted-foreground font-mono ml-2">botcontrol · system.log</span>
          <span className="ml-auto text-xs text-muted-foreground font-mono animate-blink">█</span>
        </div>
        <div className="p-4 space-y-0.5 max-h-96 overflow-y-auto">
          {logs.map((l, i) => (
            <div key={i} className="flex items-start gap-3 py-0.5 hover:bg-white/2 rounded px-1 transition-colors">
              <span className="text-xs text-muted-foreground font-mono flex-shrink-0">{l.time}</span>
              <span className={`text-xs font-mono font-bold flex-shrink-0 w-10 ${levelStyle[l.level]}`}>{l.level}</span>
              <span className="text-xs font-mono text-foreground/80">{l.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
