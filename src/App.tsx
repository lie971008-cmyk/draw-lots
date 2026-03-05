import { useState, type ReactNode } from "react";
import { Users, Gift, FileText } from "lucide-react";
import DataSource from "./components/DataSource";
import PrizeDraw from "./components/PrizeDraw";
import AutoGrouping from "./components/AutoGrouping";

export default function App() {
  const [activeTab, setActiveTab] = useState<"data" | "draw" | "group">("data");
  const [participants, setParticipants] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-indigo-600 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Team & Draw
          </h1>
          <nav className="flex space-x-1">
            <TabButton
              active={activeTab === "data"}
              onClick={() => setActiveTab("data")}
              icon={<FileText className="w-4 h-4" />}
              label="名單來源"
            />
            <TabButton
              active={activeTab === "draw"}
              onClick={() => setActiveTab("draw")}
              icon={<Gift className="w-4 h-4" />}
              label="獎品抽籤"
            />
            <TabButton
              active={activeTab === "group"}
              onClick={() => setActiveTab("group")}
              icon={<Users className="w-4 h-4" />}
              label="自動分組"
            />
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "data" && (
          <DataSource
            participants={participants}
            setParticipants={setParticipants}
          />
        )}
        {activeTab === "draw" && <PrizeDraw participants={participants} />}
        {activeTab === "group" && <AutoGrouping participants={participants} />}
      </main>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
