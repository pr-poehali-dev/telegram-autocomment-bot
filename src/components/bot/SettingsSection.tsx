import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const SETTINGS_URL = "https://functions.poehali.dev/ce3a8ab9-58c3-4191-b8be-798031a96b7b";

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

interface Target { id?: number; platform: "tg" | "vk"; handle: string; label: string; is_active: boolean; }

export function Settings() {
  const [vkLink, setVkLink] = useState("");
  const [vkToken, setVkToken] = useState("");
  const [tgUsername, setTgUsername] = useState("");
  const [tgToken, setTgToken] = useState("");
  const [instagramUser, setInstagramUser] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");

  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const [tgTargets, setTgTargets] = useState<Target[]>([]);
  const [vkTargets, setVkTargets] = useState<Target[]>([]);
  const [newTgTarget, setNewTgTarget] = useState("");
  const [newVkTarget, setNewVkTarget] = useState("");
  const [bulkTg, setBulkTg] = useState("");
  const [bulkVk, setBulkVk] = useState("");
  const [showBulkTg, setShowBulkTg] = useState(false);
  const [showBulkVk, setShowBulkVk] = useState(false);

  const [toggles, setToggles] = useState({ autopost: true, errors: true, ab: false, realtime: true, email: false });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetch(SETTINGS_URL)
      .then((r) => r.json())
      .then((data) => {
        const s = data.settings || {};
        setVkLink(s.vk_link || "");
        setVkToken(s.vk_token || "");
        setTgUsername(s.tg_username || "");
        setTgToken(s.tg_token || "");
        setInstagramUser(s.instagram_user || "");
        setWebhookUrl(s.webhook_url || "");
        if (s.bot_toggles) {
          try { setToggles(JSON.parse(s.bot_toggles)); } catch (e) { void e; }
        }
        setComments((data.comments || []).map((c: { text: string }) => c.text));
        const allTargets: Target[] = data.targets || [];
        setTgTargets(allTargets.filter((t) => t.platform === "tg"));
        setVkTargets(allTargets.filter((t) => t.platform === "vk"));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaved(true);
    const allTargets = [
      ...tgTargets.map((t) => ({ ...t, platform: "tg" })),
      ...vkTargets.map((t) => ({ ...t, platform: "vk" })),
    ];
    await fetch(SETTINGS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        settings: {
          vk_link: vkLink, vk_token: vkToken,
          tg_username: tgUsername, tg_token: tgToken,
          instagram_user: instagramUser, webhook_url: webhookUrl,
          bot_toggles: JSON.stringify(toggles),
        },
        comments,
        targets: allTargets,
        targets_platform: null,
      }),
    });
    setTimeout(() => setSaved(false), 2000);
  };

  const addComment = () => {
    const t = newComment.trim();
    if (!t) return;
    setComments((p) => [...p, t]);
    setNewComment("");
  };

  const addTarget = (platform: "tg" | "vk") => {
    const raw = platform === "tg" ? newTgTarget.trim() : newVkTarget.trim();
    if (!raw) return;
    const handle = raw.startsWith("@") || raw.startsWith("http") ? raw : `@${raw}`;
    const newT: Target = { platform, handle, label: "", is_active: true };
    if (platform === "tg") { setTgTargets((p) => [...p, newT]); setNewTgTarget(""); }
    else { setVkTargets((p) => [...p, newT]); setNewVkTarget(""); }
  };

  const importBulk = (platform: "tg" | "vk") => {
    const raw = platform === "tg" ? bulkTg : bulkVk;
    const lines = raw.split(/[\n,;]+/).map((l) => l.trim()).filter(Boolean);
    const newTargets: Target[] = lines.map((h) => ({
      platform,
      handle: h.startsWith("@") || h.startsWith("http") ? h : `@${h}`,
      label: "",
      is_active: true,
    }));
    if (platform === "tg") { setTgTargets((p) => [...p, ...newTargets]); setBulkTg(""); setShowBulkTg(false); }
    else { setVkTargets((p) => [...p, ...newTargets]); setBulkVk(""); setShowBulkVk(false); }
  };

  const removeTarget = (platform: "tg" | "vk", idx: number) => {
    if (platform === "tg") setTgTargets((p) => p.filter((_, i) => i !== idx));
    else setVkTargets((p) => p.filter((_, i) => i !== idx));
  };

  const inputCls = "w-full bg-black/30 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-cyan-500/40 transition-colors font-mono";

  if (loading) return <div className="text-sm text-muted-foreground text-center py-12 font-mono animate-pulse">Загрузка настроек...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold gradient-text">Настройки</h2>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
            saved ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
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
        <div className="mb-5 pb-5 border-b border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💙</span>
            <span className="text-sm font-medium text-foreground">ВКонтакте</span>
          </div>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Ссылка на страницу / группу</label>
              <input type="text" value={vkLink} onChange={(e) => setVkLink(e.target.value)} placeholder="https://vk.com/username" className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Access Token (API)</label>
              <input type="password" value={vkToken} onChange={(e) => setVkToken(e.target.value)} placeholder="vk1.a.xxxxxxxxxxxx" className={inputCls} />
            </div>
          </div>
        </div>
        <div className="mb-5 pb-5 border-b border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">✈️</span>
            <span className="text-sm font-medium text-foreground">Telegram</span>
          </div>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Username бота</label>
              <input type="text" value={tgUsername} onChange={(e) => setTgUsername(e.target.value)} placeholder="@my_bot" className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Bot Token</label>
              <input type="password" value={tgToken} onChange={(e) => setTgToken(e.target.value)} placeholder="1234567890:ABCdef..." className={inputCls} />
            </div>
          </div>
        </div>
        <div className="mb-5 pb-5 border-b border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📸</span>
            <span className="text-sm font-medium text-foreground">Instagram</span>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Username аккаунта</label>
            <input type="text" value={instagramUser} onChange={(e) => setInstagramUser(e.target.value)} placeholder="@username" className={inputCls} />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔗</span>
            <span className="text-sm font-medium text-foreground">Webhook URL</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">Опционально</span>
          </div>
          <input type="text" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://your-server.com/webhook" className={inputCls} />
        </div>
      </div>

      {/* Targets — Telegram */}
      <div className="glass border border-white/5 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span className="text-cyan-400">✈️</span>
            Telegram-каналы / чаты для комментирования
            <span className="text-xs font-normal text-muted-foreground font-mono">{tgTargets.length} шт.</span>
          </h3>
          <button onClick={() => setShowBulkTg((v) => !v)} className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
            {showBulkTg ? "Скрыть" : "Импорт списком"}
          </button>
        </div>

        {showBulkTg && (
          <div className="mb-4 space-y-2 animate-fade-in">
            <textarea
              value={bulkTg}
              onChange={(e) => setBulkTg(e.target.value)}
              rows={4}
              placeholder={"@channel1\n@channel2\nhttps://t.me/channel3\n..."}
              className={`${inputCls} resize-none`}
            />
            <div className="flex gap-2">
              <button onClick={() => importBulk("tg")} className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm hover:bg-cyan-500/20 transition-all">
                Добавить все
              </button>
              <p className="text-xs text-muted-foreground self-center">Каждый канал с новой строки или через запятую</p>
            </div>
          </div>
        )}

        <div className="space-y-1.5 mb-3">
          {tgTargets.length === 0 && (
            <p className="text-xs text-muted-foreground py-2 text-center">Каналов пока нет — добавьте ниже</p>
          )}
          {tgTargets.map((t, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2.5 bg-black/20 border border-white/5 rounded-xl group">
              <span className="text-xs font-mono text-cyan-400 flex-1 truncate">{t.handle}</span>
              <div
                onClick={() => setTgTargets((p) => p.map((x, i) => i === idx ? { ...x, is_active: !x.is_active } : x))}
                className={`w-7 h-3.5 rounded-full relative cursor-pointer transition-all flex-shrink-0 ${t.is_active ? "bg-emerald-500/40" : "bg-white/10"}`}
                style={{ minWidth: 28 }}
              >
                <div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full transition-all ${t.is_active ? "left-3.5 bg-emerald-400" : "left-0.5 bg-white/30"}`} />
              </div>
              <button onClick={() => removeTarget("tg", idx)} className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-rose-400 transition-all">
                <Icon name="X" size={12} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newTgTarget}
            onChange={(e) => setNewTgTarget(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTarget("tg")}
            placeholder="@channel или https://t.me/channel"
            className={inputCls}
          />
          <button onClick={() => addTarget("tg")} className="px-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all flex-shrink-0">
            <Icon name="Plus" size={16} />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
          <Icon name="Info" size={11} />
          Безопасный лимит: <span className="text-cyan-400/80 font-mono">10–15 комм/час</span>, пауза <span className="text-cyan-400/80 font-mono">60–120 сек</span> между постами
        </p>
      </div>

      {/* Targets — VK */}
      <div className="glass border border-white/5 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span>💙</span>
            VK-группы для комментирования
            <span className="text-xs font-normal text-muted-foreground font-mono">{vkTargets.length} шт.</span>
          </h3>
          <button onClick={() => setShowBulkVk((v) => !v)} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
            {showBulkVk ? "Скрыть" : "Импорт списком"}
          </button>
        </div>

        {showBulkVk && (
          <div className="mb-4 space-y-2 animate-fade-in">
            <textarea
              value={bulkVk}
              onChange={(e) => setBulkVk(e.target.value)}
              rows={4}
              placeholder={"@club123456\nhttps://vk.com/public123\n@durov\n..."}
              className={`${inputCls} resize-none`}
            />
            <div className="flex gap-2">
              <button onClick={() => importBulk("vk")} className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/20 transition-all">
                Добавить все
              </button>
              <p className="text-xs text-muted-foreground self-center">Каждая группа с новой строки или через запятую</p>
            </div>
          </div>
        )}

        <div className="space-y-1.5 mb-3">
          {vkTargets.length === 0 && (
            <p className="text-xs text-muted-foreground py-2 text-center">Групп пока нет — добавьте ниже</p>
          )}
          {vkTargets.map((t, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2.5 bg-black/20 border border-white/5 rounded-xl group">
              <span className="text-xs font-mono text-blue-400 flex-1 truncate">{t.handle}</span>
              <div
                onClick={() => setVkTargets((p) => p.map((x, i) => i === idx ? { ...x, is_active: !x.is_active } : x))}
                className={`w-7 h-3.5 rounded-full relative cursor-pointer transition-all flex-shrink-0 ${t.is_active ? "bg-emerald-500/40" : "bg-white/10"}`}
                style={{ minWidth: 28 }}
              >
                <div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full transition-all ${t.is_active ? "left-3.5 bg-emerald-400" : "left-0.5 bg-white/30"}`} />
              </div>
              <button onClick={() => removeTarget("vk", idx)} className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-rose-400 transition-all">
                <Icon name="X" size={12} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newVkTarget}
            onChange={(e) => setNewVkTarget(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTarget("vk")}
            placeholder="@club123 или https://vk.com/public"
            className={inputCls}
          />
          <button onClick={() => addTarget("vk")} className="px-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all flex-shrink-0">
            <Icon name="Plus" size={16} />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
          <Icon name="Info" size={11} />
          Безопасный лимит: <span className="text-blue-400/80 font-mono">15–20 комм/час</span>, пауза <span className="text-blue-400/80 font-mono">90–180 сек</span>
        </p>
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
                  <textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} rows={2} autoFocus
                    className="flex-1 bg-black/40 border border-cyan-500/30 rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-cyan-500/60 transition-colors resize-none font-mono" />
                  <div className="flex flex-col gap-1">
                    <button onClick={() => { setComments((p) => p.map((x, i) => i === idx ? editValue : x)); setEditingIdx(null); }}
                      className="p-2 rounded-lg bg-cyan-500/15 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/25 transition-all">
                      <Icon name="Check" size={14} />
                    </button>
                    <button onClick={() => setEditingIdx(null)}
                      className="p-2 rounded-lg bg-white/5 border border-white/8 text-muted-foreground hover:text-foreground transition-all">
                      <Icon name="X" size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 p-3 bg-black/20 border border-white/5 rounded-xl hover:border-white/10 transition-all">
                  <span className="text-xs font-mono text-muted-foreground mt-0.5 flex-shrink-0 w-5">#{idx + 1}</span>
                  <p className="flex-1 text-sm text-foreground/85 leading-relaxed">{c}</p>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button onClick={() => { setEditingIdx(idx); setEditValue(c); }}
                      className="p-1.5 rounded-lg hover:bg-white/8 text-muted-foreground hover:text-cyan-400 transition-colors">
                      <Icon name="Pencil" size={12} />
                    </button>
                    <button onClick={() => setComments((p) => p.filter((_, i) => i !== idx))}
                      className="p-1.5 rounded-lg hover:bg-white/8 text-muted-foreground hover:text-rose-400 transition-colors">
                      <Icon name="Trash2" size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) addComment(); }} rows={2}
            placeholder="Введите пример комментария... (⌘Enter для добавления)"
            className="flex-1 bg-black/30 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-cyan-500/40 transition-colors resize-none" />
          <button onClick={addComment} disabled={!newComment.trim()}
            className="px-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-shrink-0 flex items-center gap-1">
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
              <Toggle value={toggles[t.key]} onChange={(v) => setToggles((p) => ({ ...p, [t.key]: v }))} />
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