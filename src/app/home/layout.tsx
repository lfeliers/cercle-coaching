import Sidebar from "@/components/Sidebar";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-full flex"
      style={{ background: "linear-gradient(135deg, #0f0c29 0%, #1a1a5e 40%, #1565c0 100%)" }}
    >
      {/* Blobs décoratifs */}
      <div className="fixed w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "#2979ff", top: "-80px", left: "-80px" }} />
      <div className="fixed w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: "#00b0ff", bottom: "-60px", right: "-60px" }} />

      <Sidebar />

      <main className="flex-1 flex flex-col min-h-full relative z-10" style={{ marginLeft: "220px" }}>
        {children}
      </main>
    </div>
  );
}
