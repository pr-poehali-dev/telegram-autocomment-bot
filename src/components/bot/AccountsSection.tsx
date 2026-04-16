import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const ACCOUNTS_URL = "https://functions.poehali.dev/95b4fcbc-c927-466e-824d-258d15c6b1a2";
const GEN_URL = "https://functions.poehali.dev/b044d80a-262f-45f4-87c0-ce34676cc151";

interface Account {
  id?: number;
  platform: "tg" | "vk";
  username: string;
  token: string;
  link: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  is_active: boolean;
}

const EMPTY_ACCOUNT: Account = {
  platform: "tg",
  username: "",
  token: "",
  link: "",
  display_name: "",
  bio: "",
  avatar_url: "",
  is_active: true,
};

function AccountCard({
  account,
  onSave,
  onDelete,
  onGenerate,
  generating,
}: {
  account: Account;
  onSave: (a: Account) => void;
  onDelete: (id: number) => void;
  onGenerate: (id: number, type: string) => void;
  generating: boolean;
}) {
  const [draft, setDraft] = useState<Account>(account);
  const [expanded, setExpanded] = useState(!account.id);
  const [genGender, setGenGender] = useState<"female" | "male">("female");

  const set = (k: keyof Account, v: string | boolean) =>
    setDraft((p) => ({ ...p, [k]: v }));

  const inputCls =
    "w-full bg-black/30 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-cyan-500/40 transition-colors font-mono";

  const platform = draft.platform;
  const platformColor = platform === "tg" ? "text-cyan-400" : "text-blue-400";
  const platformBg = platform === "tg" ? "bg-cyan-500/10" : "bg-blue-500/10";
  const platformBorder = platform === "tg" ? "border-cyan-500/20" : "border-blue-500/20";

  return (
    <div className={`glass border rounded-2xl overflow-hidden transition-all ${expanded ? "border-white/10" : "border-white/5"}`}>
      {/* Header */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/2 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        {draft.avatar_url ? (
          <img src={draft.avatar_url} alt="" className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
        ) : (
          <div className={`w-9 h-9 rounded-xl ${platformBg} flex items-center justify-center flex-shrink-0`}>
            <span className={platformColor}>
              <Icon name={platform === "tg" ? "Send" : "Users"} size={16} />
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono font-bold uppercase ${platformColor}`}>{platform}</span>
            <span className="text-sm font-medium text-foreground truncate">
              {draft.display_name || draft.username || "Новый аккаунт"}
            </span>
          </div>
          {draft.username && (
            <div className="text-xs text-muted-foreground font-mono truncate">{draft.username}</div>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`w-1.5 h-1.5 rounded-full ${draft.is_active ? "bg-emerald-400" : "bg-white/20"}`} />
          <Icon name={expanded ? "ChevronUp" : "ChevronDown"} size={14} className="text-muted-foreground" />
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4">
          {/* Platform toggle */}
          <div className="flex gap-2">
            {(["tg", "vk"] as const).map((p) => (
              <button
                key={p}
                onClick={() => set("platform", p)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                  draft.platform === p
                    ? p === "tg"
                      ? "bg-cyan-500/20 border border-cyan-500/30 text-cyan-400"
                      : "bg-blue-500/20 border border-blue-500/30 text-blue-400"
                    : "bg-white/5 border border-white/8 text-muted-foreground hover:text-foreground"
                }`}
              >
                {p === "tg" ? "✈️ Telegram" : "💙 ВКонтакте"}
              </button>
            ))}
          </div>

          {/* Avatar + name gen */}
          <div className="flex gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {draft.avatar_url ? (
                <img src={draft.avatar_url} alt="" className="w-16 h-16 rounded-xl object-cover border border-white/10" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-muted-foreground">
                  <Icon name="User" size={24} />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="text-xs text-muted-foreground mb-1">AI-генерация профиля</div>
              <div className="flex gap-1">
                {(["female", "male"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenGender(g)}
                    className={`flex-1 py-1.5 rounded-lg text-xs transition-all ${
                      genGender === g
                        ? "bg-violet-500/20 border border-violet-500/30 text-violet-400"
                        : "bg-white/5 border border-white/8 text-muted-foreground"
                    }`}
                  >
                    {g === "female" ? "👩 Девушка" : "👨 Мужчина"}
                  </button>
                ))}
              </div>
              <div className="flex gap-1 flex-wrap">
                {[
                  { type: "avatar", label: "🖼 Аватар", tip: "~30 сек" },
                  { type: "nickname", label: "@ Ник" },
                  { type: "bio", label: "📝 Описание" },
                  { type: "all", label: "✨ Всё сразу", tip: "~30 сек" },
                ].map((btn) => (
                  <button
                    key={btn.type}
                    disabled={generating}
                    onClick={() => draft.id && onGenerate(draft.id, btn.type)}
                    title={btn.tip}
                    className={`px-2.5 py-1.5 rounded-lg text-xs transition-all border ${
                      generating
                        ? "opacity-40 cursor-not-allowed bg-white/5 border-white/8 text-muted-foreground"
                        : "bg-violet-500/10 border-violet-500/20 text-violet-400 hover:bg-violet-500/20"
                    }`}
                  >
                    {generating ? "..." : btn.label}
                  </button>
                ))}
              </div>
              {generating && (
                <div className="text-xs text-violet-400/70 font-mono animate-pulse">Генерирую...</div>
              )}
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Отображаемое имя</label>
              <input type="text" value={draft.display_name} onChange={(e) => set("display_name", e.target.value)}
                placeholder="Анастасия" className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Username</label>
              <input type="text" value={draft.username} onChange={(e) => set("username", e.target.value)}
                placeholder={platform === "tg" ? "@username" : "@vk_id"} className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                {platform === "tg" ? "Bot Token" : "Access Token (VK API)"}
              </label>
              <input type="password" value={draft.token} onChange={(e) => set("token", e.target.value)}
                placeholder={platform === "tg" ? "1234567890:ABCdef..." : "vk1.a.xxxxxxxxxxxx"} className={inputCls} />
            </div>
            {platform === "vk" && (
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Ссылка на страницу</label>
                <input type="text" value={draft.link} onChange={(e) => set("link", e.target.value)}
                  placeholder="https://vk.com/username" className={inputCls} />
              </div>
            )}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Описание / Bio</label>
              <textarea value={draft.bio} onChange={(e) => set("bio", e.target.value)} rows={2}
                placeholder="Краткое описание аккаунта..." className={`${inputCls} resize-none`} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onSave({ ...draft, _gender: genGender } as Account)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${platformBg} border ${platformBorder} ${platformColor} hover:opacity-80`}
            >
              <Icon name="Save" size={13} />
              Сохранить
            </button>
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-xs text-muted-foreground">Активен</span>
              <div
                onClick={() => set("is_active", !draft.is_active)}
                className={`w-9 h-4.5 rounded-full relative cursor-pointer transition-all ${draft.is_active ? "bg-emerald-500/30 border border-emerald-500/40" : "bg-white/8 border border-white/10"}`}
                style={{ width: 36, height: 20 }}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${draft.is_active ? "left-4 bg-emerald-400" : "left-0.5 bg-white/30"}`} />
              </div>
            </div>
            {account.id && (
              <button
                onClick={() => account.id && onDelete(account.id)}
                className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all"
              >
                <Icon name="Trash2" size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function AccountsSection() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState<number | null>(null);
  const [genGender, setGenGender] = useState<"female" | "male">("female");
  const [batchCount, setBatchCount] = useState(3);
  const [batchGenerating, setBatchGenerating] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetch(ACCOUNTS_URL)
      .then((r) => r.json())
      .then((data) => setAccounts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (account: Account) => {
    if (account.id) {
      await fetch(`${ACCOUNTS_URL}?id=${account.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(account),
      });
      setAccounts((prev) => prev.map((a) => (a.id === account.id ? account : a)));
    } else {
      const res = await fetch(ACCOUNTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(account),
      });
      const created = await res.json();
      setAccounts((prev) => [...prev.filter((a) => a.id !== undefined), created]);
    }
  };

  const handleDelete = async (id: number) => {
    await fetch(`${ACCOUNTS_URL}?id=${id}`, { method: "DELETE" });
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleGenerate = async (id: number, type: string) => {
    setGeneratingId(id);
    const account = accounts.find((a) => a.id === id);
    const gender = (account as Account & { _gender?: string })?._gender || "female";
    const res = await fetch(GEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, gender, account_id: id, count: 1 }),
    });
    const data = await res.json();
    const result = data.results?.[0] || {};
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...result } : a))
    );
    setGeneratingId(null);
  };

  const handleBatchGenerate = async () => {
    setBatchGenerating(true);
    const res = await fetch(GEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "all", gender: genGender, count: batchCount }),
    });
    const data = await res.json();
    const newAccounts: Account[] = [];
    for (const r of data.results || []) {
      const createRes = await fetch(ACCOUNTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: "tg", ...r }),
      });
      const created = await createRes.json();
      newAccounts.push(created);
    }
    setAccounts((prev) => [...prev, ...newAccounts]);
    setBatchGenerating(false);
  };

  const addNew = () => {
    setAccounts((prev) => [...prev, { ...EMPTY_ACCOUNT }]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold gradient-text">Аккаунты</h2>
        <button
          onClick={addNew}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-all"
        >
          <Icon name="Plus" size={14} />
          Добавить
        </button>
      </div>

      {/* Batch generation */}
      <div className="glass border border-violet-500/15 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="text-violet-400"><Icon name="Sparkles" size={16} /></span>
          Пакетная генерация аккаунтов
        </h3>
        <div className="flex items-end gap-3 flex-wrap">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Пол персонажей</label>
            <div className="flex gap-1">
              {(["female", "male"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGenGender(g)}
                  className={`px-3 py-2 rounded-xl text-xs transition-all border ${
                    genGender === g
                      ? "bg-violet-500/20 border-violet-500/30 text-violet-400"
                      : "bg-white/5 border-white/8 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {g === "female" ? "👩 Девушки" : "👨 Мужчины"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Количество</label>
            <div className="flex gap-1">
              {[1, 3, 5, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => setBatchCount(n)}
                  className={`w-10 py-2 rounded-xl text-xs transition-all border ${
                    batchCount === n
                      ? "bg-violet-500/20 border-violet-500/30 text-violet-400"
                      : "bg-white/5 border-white/8 text-muted-foreground"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleBatchGenerate}
            disabled={batchGenerating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/15 border border-violet-500/25 text-violet-400 text-sm font-medium hover:bg-violet-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Icon name={batchGenerating ? "Loader" : "Wand2"} size={14} />
            {batchGenerating ? "Генерирую..." : `Создать ${batchCount} аккаунт${batchCount === 1 ? "" : batchCount < 5 ? "а" : "ов"}`}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          ИИ создаст фото, никнейм и описание. Аватарка генерируется ~30 сек каждая.
        </p>
      </div>

      {/* Accounts list */}
      {loading ? (
        <div className="text-sm text-muted-foreground text-center py-8 font-mono">Загрузка...</div>
      ) : accounts.length === 0 ? (
        <div className="glass border border-white/5 rounded-2xl p-8 text-center">
          <div className="text-muted-foreground mb-2"><Icon name="UserPlus" size={32} /></div>
          <p className="text-sm text-muted-foreground">Аккаунтов пока нет. Добавьте первый или сгенерируйте пачкой выше.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {accounts.map((acc, i) => (
            <AccountCard
              key={acc.id ?? `new-${i}`}
              account={acc}
              onSave={handleSave}
              onDelete={handleDelete}
              onGenerate={handleGenerate}
              generating={generatingId === acc.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
