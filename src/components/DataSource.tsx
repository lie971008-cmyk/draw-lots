import { useState, useRef, type ChangeEvent } from "react";
import { Upload, Trash2, UserPlus, Users } from "lucide-react";
import { motion } from "motion/react";

interface DataSourceProps {
  participants: string[];
  setParticipants: (p: string[]) => void;
}

export default function DataSource({
  participants,
  setParticipants,
}: DataSourceProps) {
  const [inputText, setInputText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddFromText = () => {
    const newNames = inputText
      .split(/\r?\n|,/)
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (newNames.length > 0) {
      setParticipants([...participants, ...newNames]);
      setInputText("");
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const newNames = text
        .split(/\r?\n|,/)
        .map((name) => name.trim())
        .filter((name) => name.length > 0);

      if (newNames.length > 0) {
        setParticipants([...participants, ...newNames]);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeParticipant = (index: number) => {
    const newParticipants = [...participants];
    newParticipants.splice(index, 1);
    setParticipants(newParticipants);
  };

  const clearAll = () => {
    if (confirm("確定要清空所有名單嗎？")) {
      setParticipants([]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-500" />
            手動輸入
          </h2>
          <p className="text-sm text-neutral-500 mb-3">
            請貼上或輸入姓名，每行一個名字，或以逗號分隔。
          </p>
          <textarea
            className="w-full h-48 p-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-shadow"
            placeholder="王小明&#10;李大華&#10;張三"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            onClick={handleAddFromText}
            disabled={!inputText.trim()}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium py-2.5 rounded-xl transition-colors"
          >
            加入名單
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-500" />
            上傳 CSV 檔案
          </h2>
          <p className="text-sm text-neutral-500 mb-4">
            支援 .csv 或 .txt 檔案，內容以逗號或換行分隔。
          </p>

          <input
            type="file"
            accept=".csv,.txt"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-600 font-medium py-8 rounded-xl transition-colors flex flex-col items-center gap-2"
          >
            <Upload className="w-6 h-6" />
            選擇檔案
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex flex-col h-[calc(100vh-12rem)] min-h-[500px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            目前名單
            <span className="bg-indigo-100 text-indigo-700 text-xs py-1 px-2 rounded-full">
              {participants.length} 人
            </span>
          </h2>
          {participants.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              清空
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
          {participants.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-400 space-y-3">
              <Users className="w-12 h-12 opacity-20" />
              <p>目前沒有名單，請從左側加入</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {participants.map((name, index) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={`${name}-${index}`}
                  className="bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 flex items-center justify-between group"
                >
                  <span
                    className="truncate text-sm font-medium text-neutral-700"
                    title={name}
                  >
                    {name}
                  </span>
                  <button
                    onClick={() => removeParticipant(index)}
                    className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
