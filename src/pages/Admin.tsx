import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderOpen, FileText, Settings, LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { ProjectsAdminPanel } from "./admin/ProjectsAdminPanel";
import { ContentAdminPanel } from "./admin/ContentAdminPanel";
import { SettingsAdminPanel } from "./admin/SettingsAdminPanel";

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    toast.success("Saiu do painel.");
    navigate("/login", { replace: true });
  };

  const tabs = [
    { id: "projects", label: "Projetos", icon: FolderOpen },
    { id: "content", label: "Conteúdo", icon: FileText },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-card border-r border-border p-6 flex flex-col shrink-0">
        <h1 className="font-display text-xl font-bold text-foreground mb-8">
          ITA <span className="text-primary">FRAMES</span>
        </h1>
        <nav className="space-y-2 flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-body text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => void handleLogout()}
          className="flex items-center gap-3 px-4 py-3 font-body text-sm text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut size={16} /> Sair
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center gap-3 mb-8">
          <LayoutDashboard size={24} className="text-primary" />
          <h2 className="font-display text-2xl font-bold text-foreground">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h2>
        </div>

        {activeTab === "projects" && <ProjectsAdminPanel />}
        {activeTab === "content" && <ContentAdminPanel />}
        {activeTab === "settings" && <SettingsAdminPanel />}
      </main>
    </div>
  );
};

export default Admin;
