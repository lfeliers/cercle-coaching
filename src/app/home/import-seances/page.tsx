"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type Session = {
  date: string | null;
  sport: string;
  name: string;
  duration: string | null;
  distance_km: number | null;
  rpe: number | null;
};

type AthleteBlock = {
  athlete_id: number;
  athlete_name: string | null;
  week: number | null;
  sessions: Session[];
};

type NolioAthlete = {
  nolio_id: number;
  name: string;
  teams: { id: number; name: string }[];
};

type ImportedFile = { name: string; size: number; file: File };

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export default function ImportSeancesPage() {
  const [importedFile, setImportedFile] = useState<ImportedFile | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AthleteBlock[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [athletes, setAthletes] = useState<NolioAthlete[] | null>(null);
  const [athletesOpen, setAthletesOpen] = useState(false);
  const [athletesError, setAthletesError] = useState<string | null>(null);
  const [athletesLoading, setAthletesLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAthletesLoading(true);
    fetch("/api/nolio/athletes")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setAthletesError(data.error);
        else setAthletes(data);
      })
      .catch(() => setAthletesError("Impossible de contacter Nolio."))
      .finally(() => setAthletesLoading(false));
  }, []);

  function handleFile(f: File) {
    setImportedFile({ name: f.name, size: f.size, file: f });
    setResult(null);
    setError(null);
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  async function handleImport() {
    if (!importedFile) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", importedFile.file);

    const res = await fetch("/api/import/parse", { method: "POST", body: formData });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) setError(data.error ?? "Erreur lors de l'extraction.");
    else setResult(data);
  }

  return (
    <div className="px-8 pt-8 pb-8 flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Import de séances</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
          Importe un fichier .xlsx de planification pour extraire les séances.
        </p>
      </div>

      {/* Zone de drop / fichier importé */}
      {!importedFile ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className="flex flex-col items-center justify-center gap-5 cursor-pointer"
          style={{
            minHeight: "280px",
            background: dragging ? "rgba(41,121,255,0.12)" : "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: dragging ? "2px dashed rgba(41,121,255,0.7)" : "2px dashed rgba(255,255,255,0.15)",
            borderRadius: "24px",
            transition: "all 0.2s",
          }}
        >
          <div
            className="flex items-center justify-center w-16 h-16"
            style={{
              background: dragging ? "linear-gradient(135deg, #2979ff, #00b0ff)" : "rgba(255,255,255,0.08)",
              borderRadius: "20px",
              transition: "all 0.2s",
              boxShadow: dragging ? "0 4px 24px rgba(41,121,255,0.4)" : "none",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 16V8m0 0l-3 3m3-3l3 3M6 20h12a2 2 0 002-2V8.5L14.5 3H6a2 2 0 00-2 2v13a2 2 0 002 2z"
                stroke={dragging ? "white" : "rgba(255,255,255,0.5)"}
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-white">
              {dragging ? "Relâche pour importer" : "Glisse ton fichier ici"}
            </p>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
              ou <span style={{ color: "#64b5f6" }}>clique pour parcourir</span>
            </p>
            <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>.xlsx uniquement</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div
            className="flex items-center justify-between px-6 py-5"
            style={{
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "18px",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-11 h-11 shrink-0" style={{ background: "rgba(255,255,255,0.08)", borderRadius: "14px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M6 2h9l5 5v15a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 2v5h5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-white">{importedFile.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{formatSize(importedFile.size)}</p>
              </div>
            </div>
            <div className="flex items-center justify-center w-8 h-8 shrink-0" style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "50%" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <button
            onClick={() => { setImportedFile(null); setResult(null); setError(null); if (inputRef.current) inputRef.current.value = ""; }}
            className="text-xs self-start transition-all duration-150"
            style={{ color: "rgba(255,255,255,0.35)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
          >
            Changer de fichier
          </button>
        </div>
      )}

      {/* Menu déroulant athlètes Nolio */}
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "18px",
          overflow: "hidden",
        }}
      >
        <button
          onClick={() => setAthletesOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 transition-all duration-150"
          style={{ background: "transparent", border: "none", cursor: "pointer" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-8 h-8 shrink-0"
              style={{ background: "rgba(41,121,255,0.2)", borderRadius: "10px" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#64b5f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white">
              Athlètes Nolio
              {athletes && (
                <span className="ml-2 text-xs font-normal" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {athletes.length} athlète{athletes.length > 1 ? "s" : ""}
                </span>
              )}
            </span>
          </div>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            style={{ transform: athletesOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", color: "rgba(255,255,255,0.4)" }}
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {athletesOpen && (
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {athletesLoading && (
              <p className="text-sm px-5 py-4" style={{ color: "rgba(255,255,255,0.4)" }}>
                Chargement…
              </p>
            )}
            {athletesError && (
              <p className="text-sm px-5 py-4" style={{ color: "#fca5a5" }}>
                {athletesError}
              </p>
            )}
            {athletes && athletes.length === 0 && (
              <p className="text-sm px-5 py-4" style={{ color: "rgba(255,255,255,0.4)" }}>
                Aucun athlète trouvé.
              </p>
            )}
            {athletes && athletes.map((athlete, idx) => (
              <div
                key={athlete.nolio_id}
                className="flex items-center justify-between px-5 py-3"
                style={{
                  borderTop: idx > 0 ? "1px solid rgba(255,255,255,0.05)" : undefined,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-8 h-8 shrink-0 text-xs font-black"
                    style={{
                      background: "rgba(41,121,255,0.15)",
                      borderRadius: "50%",
                      color: "#64b5f6",
                    }}
                  >
                    {athlete.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{athlete.name}</p>
                    {athlete.teams.length > 0 && (
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                        {athlete.teams.map((t) => t.name).join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className="text-xs font-bold px-2 py-1"
                  style={{
                    background: "rgba(41,121,255,0.15)",
                    border: "1px solid rgba(41,121,255,0.25)",
                    borderRadius: "8px",
                    color: "#64b5f6",
                  }}
                >
                  ID {athlete.nolio_id}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Erreur import */}
      {error && (
        <div className="px-4 py-3 text-sm" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", color: "#fca5a5" }}>
          {error}
        </div>
      )}

      {/* Résultat JSON */}
      {result && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-bold text-white">
            {result.length} athlète{result.length > 1 ? "s" : ""} extraits —{" "}
            {result.reduce((acc, a) => acc + a.sessions.length, 0)} séances
          </p>
          <pre
            className="text-xs overflow-auto"
            style={{
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "20px 24px",
              color: "#a5f3fc",
              maxHeight: "480px",
              fontFamily: "monospace",
              lineHeight: 1.6,
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {/* Bouton Importer */}
      <div className="flex justify-end">
        <button
          onClick={handleImport}
          disabled={!importedFile || loading}
          className="px-8 py-3 text-sm font-black text-white transition-all duration-200"
          style={{
            background: importedFile && !loading ? "linear-gradient(135deg, #16a34a, #22c55e)" : "rgba(255,255,255,0.08)",
            borderRadius: "14px",
            border: "none",
            cursor: importedFile && !loading ? "pointer" : "not-allowed",
            boxShadow: importedFile && !loading ? "0 4px 20px rgba(34,197,94,0.35)" : "none",
            color: importedFile && !loading ? "#fff" : "rgba(255,255,255,0.25)",
          }}
        >
          {loading ? "Extraction en cours…" : "Importer"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}
