export type Tool = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  href: string;
};

export const tools: Tool[] = [
  {
    id: "import-seances",
    label: "Import de séances",
    description: "Importe tes séances depuis un fichier vers Nolio.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2v10m0 0l-3-3m3 3l3-3M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    href: "/home/import-seances",
  },
];
