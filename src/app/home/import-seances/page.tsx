"use client";

import { useState, useRef, useCallback } from "react";

type ImportedFile = { name: string; size: number };

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export default function ImportSeancesPage() {
  const [file, setFile] = useState<ImportedFile | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    setFile({ name: f.name, size: f.size });
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  return (
    <div className="px-8 pt-8 pb-8 flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Import de séances</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
          Importe un fichier de séances à envoyer sur Nolio.
        </p>
      </div>

      {/* Zone de drop / fichier importé */}
      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className="flex flex-col items-center justify-center gap-5 cursor-pointer transition-all duration-200"
          style={{
            flex: 1,
            minHeight: "420px",
            background: dragging ? "rgba(41,121,255,0.12)" : "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: dragging
              ? "2px dashed rgba(41,121,255,0.7)"
              : "2px dashed rgba(255,255,255,0.15)",
            borderRadius: "24px",
            transition: "all 0.2s",
          }}
        >
          <div
            className="flex items-center justify-center w-16 h-16"
            style={{
              background: dragging
                ? "linear-gradient(135deg, #2979ff, #00b0ff)"
                : "rgba(255,255,255,0.08)",
              borderRadius: "20px",
              transition: "all 0.2s",
              boxShadow: dragging ? "0 4px 24px rgba(41,121,255,0.4)" : "none",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 16V8m0 0l-3 3m3-3l3 3M6 20h12a2 2 0 002-2V8.5L14.5 3H6a2 2 0 00-2 2v13a2 2 0 002 2z"
                stroke={dragging ? "white" : "rgba(255,255,255,0.5)"}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
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
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Fichier importé */}
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
              <div
                className="flex items-center justify-center w-11 h-11 shrink-0"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "14px",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 2h9l5 5v15a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M14 2v5h5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-white">{file.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {formatSize(file.size)}
                </p>
              </div>
            </div>

            {/* Check vert */}
            <div
              className="flex items-center justify-center w-8 h-8 shrink-0"
              style={{
                background: "rgba(34,197,94,0.15)",
                border: "1px solid rgba(34,197,94,0.3)",
                borderRadius: "50%",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Changer de fichier */}
          <button
            onClick={() => { setFile(null); inputRef.current && (inputRef.current.value = ""); }}
            className="text-xs self-start transition-all duration-150"
            style={{ color: "rgba(255,255,255,0.35)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
          >
            Changer de fichier
          </button>
        </div>
      )}

      {/* Bouton Importer */}
      <div className="flex justify-end">
        <button
          disabled={!file}
          className="px-8 py-3 text-sm font-black text-white transition-all duration-200"
          style={{
            background: file
              ? "linear-gradient(135deg, #16a34a, #22c55e)"
              : "rgba(255,255,255,0.08)",
            borderRadius: "14px",
            border: "none",
            cursor: file ? "pointer" : "not-allowed",
            boxShadow: file ? "0 4px 20px rgba(34,197,94,0.35)" : "none",
            color: file ? "#fff" : "rgba(255,255,255,0.25)",
          }}
        >
          Importer
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}
