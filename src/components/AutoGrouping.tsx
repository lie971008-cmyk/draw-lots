import { useState } from "react";
import { Users, Shuffle, Download } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AutoGroupingProps {
  participants: string[];
}

export default function AutoGrouping({ participants }: AutoGroupingProps) {
  const [groupSize, setGroupSize] = useState<number>(4);
  const [groups, setGroups] = useState<string[][]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateGroups = () => {
    if (participants.length === 0) {
      alert("名單為空，請先加入名單！");
      return;
    }
    if (groupSize < 1) {
      alert("每組人數必須大於 0");
      return;
    }

    setIsGenerating(true);

    // Simulate a slight delay for animation effect
    setTimeout(() => {
      // Shuffle array using Fisher-Yates algorithm
      const shuffled = [...participants];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      // Chunk into groups
      const newGroups: string[][] = [];
      for (let i = 0; i < shuffled.length; i += groupSize) {
        newGroups.push(shuffled.slice(i, i + groupSize));
      }

      setGroups(newGroups);
      setIsGenerating(false);
    }, 600);
  };

  const exportToCSV = () => {
    if (groups.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // Add BOM for Excel UTF-8 support

    // Find max group size to create headers
    const maxMembers = Math.max(...groups.map((g) => g.length));
    const headers = [
      "組別",
      ...Array.from({ length: maxMembers }, (_, i) => `成員 ${i + 1}`),
    ];
    csvContent += headers.join(",") + "\n";

    groups.forEach((group, index) => {
      const row = [`第 ${index + 1} 組`, ...group];
      // Pad with empty strings if group is smaller than max
      while (row.length < headers.length) {
        row.push("");
      }
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "分組名單.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="bg-indigo-50 p-3 rounded-xl">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">自動隨機分組</h2>
            <p className="text-sm text-neutral-500">
              目前總人數：{participants.length} 人
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-neutral-50 p-1.5 rounded-lg border border-neutral-200">
            <label
              htmlFor="groupSize"
              className="text-sm font-medium text-neutral-600 px-2"
            >
              每組人數
            </label>
            <input
              id="groupSize"
              type="number"
              min="1"
              max={Math.max(1, participants.length)}
              value={groupSize}
              onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
              className="w-16 text-center border border-neutral-300 rounded-md py-1 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <button
            onClick={generateGroups}
            disabled={isGenerating || participants.length === 0}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-300 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Shuffle
              className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`}
            />
            開始分組
          </button>
        </div>
      </div>

      {groups.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-lg font-semibold text-neutral-800">
              分組結果{" "}
              <span className="text-neutral-500 text-sm font-normal ml-2">
                共 {groups.length} 組
              </span>
            </h3>
            <button
              onClick={exportToCSV}
              className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              匯出 CSV
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {groups.map((group, groupIndex) => (
                <motion.div
                  key={`group-${groupIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.05 }}
                  className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="bg-indigo-50/50 border-b border-neutral-100 px-4 py-3 flex justify-between items-center">
                    <span className="font-bold text-indigo-900">
                      第 {groupIndex + 1} 組
                    </span>
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                      {group.length} 人
                    </span>
                  </div>
                  <ul className="p-2">
                    {group.map((member, memberIndex) => (
                      <li
                        key={`${member}-${memberIndex}`}
                        className="px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-300 shrink-0" />
                        <span className="truncate" title={member}>
                          {member}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
