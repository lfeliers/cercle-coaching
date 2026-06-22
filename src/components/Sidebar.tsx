"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { tools } from "@/lib/tools";

type User = { id: string; name: string; email: string; nolio: { connected: boolean } };

export default function Sidebar() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) router.push("/");
        else setUser(data);
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

  const initials =
    user?.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "…";

  const isHome = pathname === "/home";

  return (
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
      {/* Bouton Home */}
      <button
        onClick={() => router.push("/home")}
        className="flex items-center gap-3 px-3 py-2.5 mb-2 w-full text-left transition-all duration-200"
        style={{
          borderRadius: "14px",
          background: isHome ? "rgba(41,121,255,0.2)" : "transparent",
          border: isHome ? "1px solid rgba(41,121,255,0.3)" : "1px solid transparent",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => { if (!isHome) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
        onMouseLeave={(e) => { if (!isHome) e.currentTarget.style.background = "transparent"; }}
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
            <path d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-sm font-black text-white">Accueil</span>
      </button>

      <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />

      <p className="text-xs font-bold px-3 mt-1" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>
        OUTILS
      </p>

      {tools.map((tool) => {
        const active = pathname === tool.href;
        return (
          <button
            key={tool.id}
            onClick={() => router.push(tool.href)}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-left transition-all duration-200"
            style={{
              borderRadius: "14px",
              background: active ? "rgba(41,121,255,0.2)" : "transparent",
              border: active ? "1px solid rgba(41,121,255,0.3)" : "1px solid transparent",
              cursor: "pointer",
              color: active ? "#fff" : "rgba(255,255,255,0.6)",
            }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ opacity: active ? 1 : 0.6 }}>{tool.icon}</span>
            <span className="text-sm font-bold truncate">{tool.label}</span>
          </button>
        );
      })}

      <div className="flex-1" />

      {/* Bouton compte */}
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
              className="w-full text-left text-sm px-4 py-2 font-bold transition-all duration-150"
              style={{ color: "#fca5a5", background: "transparent", border: "none", cursor: "pointer", borderRadius: "8px" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Déconnexion
            </button>
          </div>
        )}
      </div>

      {/* Branding */}
      <div className="px-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <p className="text-xs font-black text-center" style={{ color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}>
          Cercle Performance
        </p>
      </div>
    </aside>
  );
}
