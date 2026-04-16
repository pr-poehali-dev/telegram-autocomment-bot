import Icon from "@/components/ui/icon";
import { NavSection, NAV_ITEMS } from "@/components/bot/NavTypes";

interface AppShellProps {
  active: NavSection;
  setActive: (section: NavSection) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  children: React.ReactNode;
}

export function AppShell({ active, setActive, sidebarOpen, setSidebarOpen, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background flex">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-500/3 rounded-full blur-3xl" />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:relative z-30 lg:z-auto
        w-56 h-screen flex-shrink-0 flex flex-col
        border-r border-white/5 bg-black/40 backdrop-blur-xl
        transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center animate-float">
              <Icon name="Bot" size={16} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">BotControl</div>
              <div className="text-xs text-muted-foreground">v2.4.1</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActive(item.id); setSidebarOpen(false); }}
              className={`
                nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                transition-all duration-200 text-left
                ${active === item.id
                  ? "active glass-active text-cyan-400 font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/4"
                }
              `}
            >
              <Icon name={item.icon as string} size={16} />
              {item.label}
              {item.id === "logs" && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 status-online" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="glass rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full status-online inline-block" />
              <span className="text-xs font-medium text-emerald-400">Активен</span>
            </div>
            <div className="text-xs text-muted-foreground">Следующий цикл: 48с</div>
            <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full" style={{ width: "20%" }} />
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-h-screen flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/20 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-muted-foreground transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Icon name="Menu" size={18} />
            </button>
            <div>
              <div className="text-sm font-semibold text-foreground">
                {NAV_ITEMS.find((n) => n.id === active)?.label}
              </div>
              <div className="text-xs text-muted-foreground font-mono hidden sm:block">
                {new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
              <Icon name="Bell" size={16} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-400" />
            </button>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white cursor-pointer">
              А
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
