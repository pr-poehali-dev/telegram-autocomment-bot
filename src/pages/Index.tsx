import { useState } from "react";
import { NavSection } from "@/components/bot/NavTypes";
import { AppShell } from "@/components/bot/AppShell";
import { Dashboard, Stats, Analytics, Prompts, Integrations, Logs } from "@/components/bot/DashboardSections";
import { Settings } from "@/components/bot/SettingsSection";
import { AccountsSection } from "@/components/bot/AccountsSection";

export default function Index() {
  const [active, setActive] = useState<NavSection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (active) {
      case "dashboard": return <Dashboard />;
      case "accounts": return <AccountsSection />;
      case "stats": return <Stats />;
      case "analytics": return <Analytics />;
      case "prompts": return <Prompts />;
      case "integrations": return <Integrations />;
      case "logs": return <Logs />;
      case "settings": return <Settings />;
    }
  };

  return (
    <AppShell
      active={active}
      setActive={setActive}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    >
      {renderContent()}
    </AppShell>
  );
}
