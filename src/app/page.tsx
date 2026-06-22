"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "login" | "register";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const body = mode === "login" ? { email, password } : { name, email, password };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
    } else {
      if (mode === "register") {
        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (loginRes.ok) {
          router.push("/home");
        } else {
          setSuccess("Compte créé ! Connecte-toi pour continuer.");
          setMode("login");
          setName("");
        }
      } else {
        router.push("/home");
      }
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setSuccess("");
  }

  return (
    <div
      className="min-h-full flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0f0c29 0%, #1a1a5e 40%, #1565c0 100%)" }}
    >
      {/* Blobs décoratifs */}
      <div
        className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "#2979ff", top: "-80px", left: "-80px" }}
      />
      <div
        className="absolute w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "#00b0ff", bottom: "-60px", right: "-60px" }}
      />
      <div
        className="absolute w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "#651fff", top: "50%", left: "60%" }}
      />

      {/* Carte glassmorphism */}
      <div
        className="relative z-10 w-full max-w-md mx-4 p-8"
        style={{
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "24px",
          boxShadow: "0 8px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        {/* Logo / titre */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 mb-4"
            style={{
              background: "linear-gradient(135deg, #2979ff, #00b0ff)",
              borderRadius: "16px",
              boxShadow: "0 4px 24px rgba(41, 121, 255, 0.5)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                fill="white"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Cercle Coaching</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
            {mode === "login" ? "Bon retour parmi nous 👋" : "Rejoins la communauté"}
          </p>
        </div>

        {/* Onglets */}
        <div
          className="flex mb-6 p-1"
          style={{ background: "rgba(255,255,255,0.06)", borderRadius: "14px" }}
        >
          {(["login", "register"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className="flex-1 py-2 text-sm font-bold transition-all duration-200"
              style={{
                borderRadius: "10px",
                background: mode === m ? "rgba(41, 121, 255, 0.85)" : "transparent",
                color: mode === m ? "#fff" : "rgba(255,255,255,0.45)",
                boxShadow: mode === m ? "0 2px 12px rgba(41,121,255,0.4)" : "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {m === "login" ? "Connexion" : "Inscription"}
            </button>
          ))}
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                Nom complet
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jean Dupont"
                required
                className="w-full px-4 py-3 text-sm text-white outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "14px",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(41,121,255,0.7)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
              Adresse email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jean@exemple.com"
              required
              className="w-full px-4 py-3 text-sm text-white outline-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "14px",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(41,121,255,0.7)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 text-sm text-white outline-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "14px",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(41,121,255,0.7)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
            />
          </div>

          {error && (
            <div
              className="text-sm px-4 py-3"
              style={{
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "12px",
                color: "#fca5a5",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="text-sm px-4 py-3"
              style={{
                background: "rgba(34,197,94,0.15)",
                border: "1px solid rgba(34,197,94,0.3)",
                borderRadius: "12px",
                color: "#86efac",
              }}
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-black text-white text-sm transition-all duration-200 mt-1"
            style={{
              background: loading
                ? "rgba(41,121,255,0.4)"
                : "linear-gradient(135deg, #2979ff, #00b0ff)",
              borderRadius: "14px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 24px rgba(41,121,255,0.5)",
              letterSpacing: "0.5px",
            }}
          >
            {loading ? "Chargement..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
          </button>
        </form>

        {mode === "login" && (
          <p className="text-center text-xs mt-5" style={{ color: "rgba(255,255,255,0.35)" }}>
            Mot de passe oublié ?{" "}
            <span className="cursor-pointer" style={{ color: "#64b5f6" }}>
              Réinitialiser
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
