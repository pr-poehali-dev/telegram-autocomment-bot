export type NavSection =
  | "dashboard"
  | "settings"
  | "prompts"
  | "stats"
  | "analytics"
  | "integrations"
  | "logs";

export const NAV_ITEMS: { id: NavSection; label: string; icon: string }[] = [
  { id: "dashboard", label: "Главная", icon: "LayoutDashboard" },
  { id: "stats", label: "Статистика", icon: "BarChart3" },
  { id: "analytics", label: "Аналитика", icon: "TrendingUp" },
  { id: "prompts", label: "Промпты", icon: "MessageSquareText" },
  { id: "integrations", label: "Интеграции", icon: "Plug" },
  { id: "logs", label: "Логи", icon: "Terminal" },
  { id: "settings", label: "Настройки", icon: "Settings2" },
];
