import { useState } from "react";
import { LogIn, LayoutDashboard, FolderOpen, FileText, Settings, LogOut, Plus, Trash2, Save, Image } from "lucide-react";
import { toast } from "sonner";

const ADMIN_USER = "admin";
const ADMIN_PASS = "itaframes2024";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ user: "", pass: "" });
  const [activeTab, setActiveTab] = useState("projects");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.user === ADMIN_USER && loginForm.pass === ADMIN_PASS) {
      setAuthenticated(true);
      toast.success("Login realizado com sucesso!");
    } else {
      toast.error("Credenciais inválidas.");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-sm p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-foreground">
              ITA <span className="text-primary">FRAMES</span>
            </h1>
            <p className="font-body text-sm text-muted-foreground mt-2">Painel Administrativo</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Usuário"
              value={loginForm.user}
              onChange={(e) => setLoginForm({ ...loginForm, user: e.target.value })}
              className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none rounded-sm"
            />
            <input
              type="password"
              placeholder="Senha"
              value={loginForm.pass}
              onChange={(e) => setLoginForm({ ...loginForm, pass: e.target.value })}
              className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none rounded-sm"
            />
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm"
            >
              <LogIn size={16} /> Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "projects", label: "Projetos", icon: FolderOpen },
    { id: "content", label: "Conteúdo", icon: FileText },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border p-6 flex flex-col">
        <h1 className="font-display text-xl font-bold text-foreground mb-8">
          ITA <span className="text-primary">FRAMES</span>
        </h1>
        <nav className="space-y-2 flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
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
          onClick={() => setAuthenticated(false)}
          className="flex items-center gap-3 px-4 py-3 font-body text-sm text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut size={16} /> Sair
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">
        <div className="flex items-center gap-3 mb-8">
          <LayoutDashboard size={24} className="text-primary" />
          <h2 className="font-display text-2xl font-bold text-foreground">
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
        </div>

        {activeTab === "projects" && <ProjectsPanel />}
        {activeTab === "content" && <ContentPanel />}
        {activeTab === "settings" && <SettingsPanel />}
      </main>
    </div>
  );
};

const ProjectsPanel = () => {
  const [projects, setProjects] = useState([
    { id: 1, title: "Casamento Ana & Pedro", category: "Casamento", status: "Publicado" },
    { id: 2, title: "Festa de 15 Anos - Camila", category: "Festa", status: "Publicado" },
    { id: 3, title: "Gala Corporativa Luxe", category: "Corporativo", status: "Publicado" },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="font-body text-sm text-muted-foreground">{projects.length} projetos</p>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase rounded-sm hover:bg-primary/90 transition-colors">
          <Plus size={14} /> Novo Projeto
        </button>
      </div>
      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-6 py-4 font-body text-xs tracking-widest uppercase text-muted-foreground">Título</th>
              <th className="text-left px-6 py-4 font-body text-xs tracking-widest uppercase text-muted-foreground">Categoria</th>
              <th className="text-left px-6 py-4 font-body text-xs tracking-widest uppercase text-muted-foreground">Status</th>
              <th className="text-right px-6 py-4 font-body text-xs tracking-widest uppercase text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4 font-body text-sm text-foreground">{p.title}</td>
                <td className="px-6 py-4 font-body text-sm text-muted-foreground">{p.category}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-primary/20 text-primary font-body text-xs rounded-full">{p.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => {
                      setProjects(projects.filter(x => x.id !== p.id));
                      toast.success("Projeto removido.");
                    }}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ContentPanel = () => (
  <div className="space-y-8">
    <div className="bg-card border border-border rounded-sm p-6">
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">Hero Section</h3>
      <div className="space-y-4">
        <div>
          <label className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Título Principal</label>
          <input
            type="text"
            defaultValue="Transformando momentos em histórias cinematográficas"
            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none rounded-sm"
          />
        </div>
        <div>
          <label className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Subtítulo</label>
          <textarea
            defaultValue="Capturamos a essência dos seus momentos mais especiais com qualidade cinematográfica."
            rows={3}
            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none rounded-sm resize-none"
          />
        </div>
        <div>
          <label className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Imagem de Fundo</label>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-border text-muted-foreground hover:border-primary hover:text-primary font-body text-xs rounded-sm transition-colors">
              <Image size={14} /> Alterar Imagem
            </button>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-card border border-border rounded-sm p-6">
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">Sobre Mim</h3>
      <div className="space-y-4">
        <div>
          <label className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Texto</label>
          <textarea
            defaultValue="Sou um fotógrafo e cinegrafista apaixonado por capturar momentos únicos..."
            rows={6}
            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none rounded-sm resize-none"
          />
        </div>
      </div>
    </div>

    <button
      onClick={() => toast.success("Conteúdo salvo com sucesso!")}
      className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase rounded-sm hover:bg-primary/90 transition-colors"
    >
      <Save size={14} /> Salvar Alterações
    </button>
  </div>
);

const SettingsPanel = () => (
  <div className="space-y-8">
    <div className="bg-card border border-border rounded-sm p-6">
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">Informações de Contato</h3>
      <div className="space-y-4">
        <div>
          <label className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2 block">WhatsApp</label>
          <input
            type="text"
            defaultValue="5500000000000"
            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none rounded-sm"
          />
        </div>
        <div>
          <label className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Email</label>
          <input
            type="email"
            defaultValue="contato@itaframes.com"
            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none rounded-sm"
          />
        </div>
        <div>
          <label className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Instagram</label>
          <input
            type="text"
            defaultValue="@itaframes"
            className="w-full bg-background border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none rounded-sm"
          />
        </div>
      </div>
    </div>

    <div className="bg-card border border-border rounded-sm p-6">
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">Personalização</h3>
      <div className="space-y-4">
        <div>
          <label className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Cor Principal</label>
          <div className="flex items-center gap-3">
            <input type="color" defaultValue="#7c0b0b" className="w-10 h-10 rounded cursor-pointer border-0" />
            <span className="font-body text-sm text-muted-foreground">#7c0b0b</span>
          </div>
        </div>
      </div>
    </div>

    <button
      onClick={() => toast.success("Configurações salvas!")}
      className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body text-xs tracking-widest uppercase rounded-sm hover:bg-primary/90 transition-colors"
    >
      <Save size={14} /> Salvar Configurações
    </button>
  </div>
);

export default Admin;
