"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

type NolioStatus = { connected: boolean; nolioUserId: number | null; connectedAt: string | null };
type User = { id: string; name: string; email: string; nolio: NolioStatus };

type Tool = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  href: string | null;
};

const tools: Tool[] = [
  {
    id: "import-seances",
    label: "Import de séances",
    description: "Importe tes séances depuis Nolio vers Cercle Coaching.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2v10m0 0l-3-3m3 3l3-3M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    href: null,
  },
];

export default function HomePage() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return router.push("/");
        setUser(data);
      });
  }, [router]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  const initials = user?.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "…";

  const firstName = user?.name.split(" ")[0] ?? "";

  return (
    <div
      className="min-h-full flex"
      style={{ background: "linear-gradient(135deg, #0f0c29 0%, #1a1a5e 40%, #1565c0 100%)" }}
    >
      {/* Blobs décoratifs */}
      <div className="fixed w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "#2979ff", top: "-80px", left: "-80px" }} />
      <div className="fixed w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: "#00b0ff", bottom: "-60px", right: "-60px" }} />

      {/* Sidebar gauche */}
      <aside
        className="fixed top-0 left-0 h-full z-20 flex flex-col py-6 px-3 gap-2"
        style={{
          width: "220px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Logo / Home */}
        <button
          onClick={() => setActiveTool(null)}
          className="flex items-center gap-3 px-3 py-2.5 mb-2 w-full text-left transition-all duration-200"
          style={{
            borderRadius: "14px",
            background: activeTool === null ? "rgba(41,121,255,0.2)" : "transparent",
            border: activeTool === null ? "1px solid rgba(41,121,255,0.3)" : "1px solid transparent",
            cursor: "pointer",
          }}
        >
          <div
            className="flex items-center justify-center w-8 h-8 shrink-0"
            style={{
              background: "linear-gradient(135deg, #2979ff, #00b0ff)",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(41,121,255,0.4)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-sm font-black text-white">Accueil</span>
        </button>

        {/* Séparateur */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />

        <p className="text-xs font-bold px-3 mt-1" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>
          OUTILS
        </p>

        {/* Liste des outils */}
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => tool.href ? router.push(tool.href) : setActiveTool(tool.id)}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-left transition-all duration-200"
            style={{
              borderRadius: "14px",
              background: activeTool === tool.id ? "rgba(41,121,255,0.2)" : "transparent",
              border: activeTool === tool.id ? "1px solid rgba(41,121,255,0.3)" : "1px solid transparent",
              cursor: "pointer",
              color: activeTool === tool.id ? "#fff" : "rgba(255,255,255,0.6)",
            }}
            onMouseEnter={(e) => {
              if (activeTool !== tool.id) e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              if (activeTool !== tool.id) e.currentTarget.style.background = "transparent";
            }}
          >
            <span style={{ opacity: activeTool === tool.id ? 1 : 0.6 }}>{tool.icon}</span>
            <span className="text-sm font-bold truncate">{tool.label}</span>
          </button>
        ))}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bouton compte en bas */}
        <div ref={popoverRef} className="relative">
          <button
            onClick={() => setPopoverOpen((v) => !v)}
            className="flex items-center gap-3 px-3 py-2.5 w-full transition-all duration-200"
            style={{
              borderRadius: "14px",
              background: popoverOpen ? "rgba(41,121,255,0.2)" : "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              cursor: "pointer",
            }}
          >
            <div
              className="flex items-center justify-center w-8 h-8 shrink-0 text-xs font-black text-white"
              style={{
                background: "linear-gradient(135deg, #2979ff, #00b0ff)",
                borderRadius: "50%",
                boxShadow: "0 2px 10px rgba(41,121,255,0.4)",
              }}
            >
              {initials}
            </div>
            <div className="flex flex-col items-start min-w-0">
              <span className="text-sm font-bold text-white truncate w-full">{user?.name ?? "…"}</span>
              <span className="text-xs truncate w-full" style={{ color: "rgba(255,255,255,0.4)" }}>{user?.email ?? ""}</span>
            </div>
          </button>

          {/* Popover compte */}
          {popoverOpen && (
            <div
              className="absolute bottom-14 left-0 w-full py-2"
              style={{
                background: "rgba(15,12,41,0.95)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "16px",
                boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
              }}
            >
              <p className="text-xs px-4 py-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                Bientôt disponible…
              </p>
              <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "4px 12px" }} />
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm px-4 py-2 transition-all duration-150 font-bold"
                style={{ color: "#fca5a5", background: "transparent", border: "none", cursor: "pointer", borderRadius: "8px" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 flex flex-col min-h-full relative z-10" style={{ marginLeft: "220px" }}>

        {/* Bannière Nolio */}
        {user && !user.nolio.connected && (
          <div className="mx-8 mt-6">
            <div
              className="flex items-center justify-between gap-4 px-5 py-4"
              style={{
                background: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.13)",
                borderRadius: "18px",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-9 h-9 shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #ff6b35, #ff9500)",
                    borderRadius: "10px",
                    boxShadow: "0 2px 12px rgba(255,107,53,0.4)",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Connecte ton compte Nolio</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>Synchronise tes séances et planifications avec Nolio.</p>
                </div>
              </div>
              <a
                href="/api/auth/nolio/connect"
                className="shrink-0 px-4 py-2 text-sm font-bold text-white transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #ff6b35, #ff9500)",
                  borderRadius: "12px",
                  textDecoration: "none",
                  boxShadow: "0 3px 14px rgba(255,107,53,0.4)",
                  whiteSpace: "nowrap",
                }}
              >
                Connecter Nolio
              </a>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <h1 className="text-3xl font-black text-white tracking-tight">
            Bonjour {firstName} 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            Que veux-tu faire aujourd&apos;hui ?
          </p>
        </div>

        {/* Grille d'outils */}
        <div className="px-8 pb-8">
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => tool.href ? router.push(tool.href) : setActiveTool(tool.id)}
                className="text-left p-6 transition-all duration-200 group"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "20px",
                  cursor: "pointer",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(41,121,255,0.15)";
                  e.currentTarget.style.borderColor = "rgba(41,121,255,0.4)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(41,121,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.2)";
                }}
              >
                <div
                  className="flex items-center justify-center w-12 h-12 mb-4 text-white"
                  style={{
                    background: "linear-gradient(135deg, #2979ff, #00b0ff)",
                    borderRadius: "14px",
                    boxShadow: "0 4px 16px rgba(41,121,255,0.4)",
                  }}
                >
                  {tool.icon}
                </div>
                <p className="text-base font-black text-white mb-1">{tool.label}</p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{tool.description}</p>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
