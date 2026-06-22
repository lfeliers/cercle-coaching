"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="min-h-full"
      style={{ background: "linear-gradient(135deg, #0f0c29 0%, #1a1a5e 40%, #1565c0 100%)" }}
    >
      {/* Blobs décoratifs */}
      <div
        className="fixed w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "#2979ff", top: "-80px", left: "-80px" }}
      />
      <div
        className="fixed w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "#00b0ff", bottom: "-60px", right: "-60px" }}
      />

      {/* Navbar */}
      <nav
        className="relative z-10 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Gauche : bouton compte + nom */}
        <div className="flex items-center gap-3" ref={popoverRef}>
          <div className="relative">
            <button
              onClick={() => setPopoverOpen((v) => !v)}
              className="flex items-center justify-center w-10 h-10 font-black text-sm text-white transition-all duration-200"
              style={{
                background: popoverOpen
                  ? "linear-gradient(135deg, #2979ff, #00b0ff)"
                  : "rgba(255,255,255,0.12)",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.2)",
                cursor: "pointer",
                boxShadow: popoverOpen ? "0 4px 20px rgba(41,121,255,0.5)" : "none",
              }}
              aria-label="Ouvrir le profil"
            >
              CC
            </button>

            {/* Popover */}
            {popoverOpen && (
              <div
                className="absolute top-12 left-0 w-64 p-4"
                style={{
                  background: "rgba(20, 20, 60, 0.85)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "18px",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
                }}
              >
                <p
                  className="text-xs text-center"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  Bientôt disponible…
                </p>
              </div>
            )}
          </div>

          <span className="text-white font-black text-lg tracking-tight">
            Cercle Coaching
          </span>
        </div>

        {/* Droite : bouton déconnexion */}
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 text-sm font-bold transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "12px",
            color: "rgba(255,255,255,0.7)",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.background = "rgba(239,68,68,0.2)";
            (e.target as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.4)";
            (e.target as HTMLButtonElement).style.color = "#fca5a5";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)";
            (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)";
            (e.target as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)";
          }}
        >
          Déconnexion
        </button>
      </nav>
    </div>
  );
}
