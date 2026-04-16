import { useState } from "react";
import Icon from "@/components/ui/icon";

export function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!value)}
      className={`w-10 h-5 rounded-full relative cursor-pointer transition-all duration-200 ${value ? "bg-cyan-500/30 border border-cyan-500/40" : "bg-white/8 border border-white/10"}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200 ${value ? "left-5 bg-cyan-400" : "left-0.5 bg-white/30"}`} />
    </div>
  );
}

export function Settings() {
  const [vkLink, setVkLink] = useState("https://vk.com/my_group");
  const [vkToken, setVkToken] = useState("");
  const [tgUsername, setTgUsername] = useState("@mybotname");
  const [tgToken, setTgToken] = useState("");
  const [instagramUser, setInstagramUser] = useState("@my_instagram");
  const [webhookUrl, setWebhookUrl] = useState("");

  const [comments, setComments] = useState([
    "Отличный контент! Всегда интересно следить за вашими публикациями 🔥",
    "Согласен на 100%! Именно так и должно работать. Кстати, у нас похожий кейс — {ссылка}",
    "Интересная тема! Подскажите, как вы пришли к такому решению?",
    "Спасибо за полезный материал! Сохранил себе 📌",
  ]);
  const [newComment, setNewComment] = useState("");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const [toggles, setToggles] = useState({
    autopost: true,
    errors: true,
    ab: false,
    realtime: true,
    email: false,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addComment = () => {
    const trimmed = newComment.trim();
    if (!trimmed) return;
    setComments((prev) => [...prev, trimmed]);
    setNewComment("");
  };

  const removeComment = (idx: number) => {
    setComments((prev) => prev.filter((_, i) => i !== idx));
  };

  const startEdit = (idx: number) => {
    setEditingIdx(idx);
    setEditValue(comments[idx]);
  };

  const saveEdit = (idx: number) => {
    setComments((prev) => prev.map((c, i) => (i === idx ? editValue : c)));
    setEditingIdx(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold gradient-text">Настройки</h2>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
            saved
              ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
              : "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20"
          }`}
        >
          <Icon name={saved ? "Check" : "Save"} size={14} />
          {saved ? "Сохранено!" : "Сохранить"}
        </button>
      </div>

      {/* Profiles */}
      <div className="glass border border-white/5 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
          <span className="text-violet-400"><Icon name="UserCircle" size={16} /></span>
          Профили платформ
        </h3>

        {/* VK */}
        <div className="mb-5 pb-5 border-b border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💙</span>
            <span className="text-sm font-medium text-foreground">ВКонтакте</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Подключено</span>
          </div>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Ссылка на страницу / группу</label>
              <input
                type="text"
                value={vkLink}
                onChange={(e) => setVkLink(e.target.value)}
                placeholder="https://vk.com/username"
                className="w-full bg-black/30 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-cyan-500/40 transition-colors font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Access Token (API)</label>
              <input
                type="password"
                value={vkToken}
                onChange={(e) => setVkToken(e.target.value)}
                placeholder="vk1.a.xxxxxxxxxxxx"
                className="w-full bg-black/30 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-cyan-500/40 transition-colors font-mono"
              />
            </div>
          </div>
        </div>

        {/* Telegram */}
        <div className="mb-5 pb-5 border-b border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">✈️</span>
            <span className="text-sm font-medium text-foreground">Telegram</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Подключено</span>
          </div>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Username бота</label>
              <input
                type="text"
                value={tgUsername}
                onChange={(e) => setTgUsername(e.target.value)}
                placeholder="@my_bot"
                className="w-full bg-black/30 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-cyan-500/40 transition-colors font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Bot Token</label>
              <input
                type="password"
                value={tgToken}
                onChange={(e) => setTgToken(e.target.value)}
                placeholder="1234567890:ABCdef..."
                className="w-full bg-black/30 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-cyan-500/40 transition-colors font-mono"
              />
            </div>
          </div>
        </div>

        {/* Instagram */}
        <div className="mb-5 pb-5 border-b border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📸</span>
            <span className="text-sm font-medium text-foreground">Instagram</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Подключено</span>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Username аккаунта</label>
            <input
              type="text"
              value={instagramUser}
              onChange={(e) => setInstagramUser(e.target.value)}
              placeholder="@username"
              className="w-full bg-black/30 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-cyan-500/40 transition-colors font-mono"
            />
          </div>
        </div>

        {/* Webhook */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔗</span>
            <span className="text-sm font-medium text-foreground">Webhook URL</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">Опционально</span>
          </div>
          <input
            type="text"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://your-server.com/webhook"
            className="w-full bg-black/30 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-cyan-500/40 transition-colors font-mono"
          />
        </div>
      </div>

      {/* Comment examples */}
      <div className="glass border border-white/5 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span className="text-cyan-400"><Icon name="MessageSquareQuote" size={16} /></span>
            Примеры комментариев
          </h3>
          <span className="text-xs text-muted-foreground font-mono">{comments.length} шт.</span>
        </div>

        <div className="space-y-2 mb-4">
          {comments.map((c, idx) => (
            <div key={idx} className="group relative animate-fade-in">
              {editingIdx === idx ? (
                <div className="flex gap-2">
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    rows={2}
                    autoFocus
                    className="flex-1 bg-black/40 border border-cyan-500/30 rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-cyan-500/60 transition-colors resize-none font-mono"
                  />
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => saveEdit(idx)}
                      className="p-2 rounded-lg bg-cyan-500/15 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/25 transition-all"
                    >
                      <Icon name="Check" size={14} />
                    </button>
                    <button
                      onClick={() => setEditingIdx(null)}
                      className="p-2 rounded-lg bg-white/5 border border-white/8 text-muted-foreground hover:text-foreground transition-all"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 p-3 bg-black/20 border border-white/5 rounded-xl hover:border-white/10 transition-all">
                  <span className="text-xs font-mono text-muted-foreground mt-0.5 flex-shrink-0 w-5">#{idx + 1}</span>
                  <p className="flex-1 text-sm text-foreground/85 leading-relaxed">{c}</p>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={() => startEdit(idx)}
                      className="p-1.5 rounded-lg hover:bg-white/8 text-muted-foreground hover:text-cyan-400 transition-colors"
                    >
                      <Icon name="Pencil" size={12} />
                    </button>
                    <button
                      onClick={() => removeComment(idx)}
                      className="p-1.5 rounded-lg hover:bg-white/8 text-muted-foreground hover:text-rose-400 transition-colors"
                    >
                      <Icon name="Trash2" size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add new */}
        <div className="flex gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) addComment(); }}
            rows={2}
            placeholder="Введите пример комментария... (⌘Enter для добавления)"
            className="flex-1 bg-black/30 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-cyan-500/40 transition-colors resize-none"
          />
          <button
            onClick={addComment}
            disabled={!newComment.trim()}
            className="px-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-shrink-0 flex items-center gap-1"
          >
            <Icon name="Plus" size={16} />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Используйте <span className="font-mono text-cyan-400/70">{"{ссылка}"}</span>, <span className="font-mono text-cyan-400/70">{"{факт}"}</span> — бот подставит нужные значения автоматически
        </p>
      </div>

      {/* Toggles */}
      <div className="glass border border-white/5 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="text-violet-400"><Icon name="ToggleRight" size={16} /></span>
          Функции
        </h3>
        <div className="space-y-1">
          {(
            [
              { key: "autopost", label: "Авто-постинг включён" },
              { key: "errors", label: "Уведомления об ошибках" },
              { key: "ab", label: "A/B тестирование промптов" },
              { key: "realtime", label: "Аналитика в реальном времени" },
              { key: "email", label: "Отправка отчётов на email" },
            ] as { key: keyof typeof toggles; label: string }[]
          ).map((t) => (
            <div key={t.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <span className="text-sm text-muted-foreground">{t.label}</span>
              <Toggle
                value={toggles[t.key]}
                onChange={(v) => setToggles((prev) => ({ ...prev, [t.key]: v }))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="glass border border-rose-500/15 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-rose-400 mb-4 flex items-center gap-2">
          <Icon name="AlertTriangle" size={16} />
          Опасная зона
        </h3>
        <div className="flex gap-3 flex-wrap">
          <button className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm hover:bg-rose-500/20 transition-all">
            Сбросить настройки
          </button>
          <button className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm hover:bg-rose-500/20 transition-all">
            Удалить все данные
          </button>
        </div>
      </div>
    </div>
  );
}
