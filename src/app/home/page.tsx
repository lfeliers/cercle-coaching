"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { tools } from "@/lib/tools";

type User = { id: string; name: string; email: string; nolio: { connected: boolean } };

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setUser(data); });
  }, []);

  const firstName = user?.name.split(" ")[0] ?? "";

  return (
    <>
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
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Synchronise tes séances et planifications avec Nolio.
                </p>
              </div>
            </div>
            <a
              href="/api/auth/nolio/connect"
              className="shrink-0 px-4 py-2 text-sm font-bold text-white"
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
              onClick={() => router.push(tool.href)}
              className="text-left p-6 transition-all duration-200"
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
    </>
  );
}
