import { useState, useEffect } from "react";
import { Gift, RotateCcw, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PrizeDrawProps {
  participants: string[];
}

export default function PrizeDraw({ participants }: PrizeDrawProps) {
  const [allowReplacement, setAllowReplacement] = useState(false);
  const [winners, setWinners] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDisplay, setCurrentDisplay] = useState<string>("準備抽籤");
  const [availablePool, setAvailablePool] = useState<string[]>(participants);

  // Update available pool when participants change or settings change
  useEffect(() => {
    if (allowReplacement) {
      setAvailablePool(participants);
    } else {
      setAvailablePool(participants.filter((p) => !winners.includes(p)));
    }
  }, [participants, allowReplacement, winners]);

  const drawWinner = () => {
    if (availablePool.length === 0) {
      alert("名單已空！");
      return;
    }

    setIsDrawing(true);

    // Animation logic
    let duration = 2000; // 2 seconds
    let interval = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;

      // Pick a random name for the animation
      const randomIndex = Math.floor(Math.random() * availablePool.length);
      setCurrentDisplay(availablePool[randomIndex]);

      // Slow down the animation towards the end
      if (elapsed > duration * 0.7) {
        interval = 150;
      }
      if (elapsed > duration * 0.9) {
        interval = 300;
      }

      if (elapsed >= duration) {
        clearInterval(timer);

        // Final winner
        const finalIndex = Math.floor(Math.random() * availablePool.length);
        const winner = availablePool[finalIndex];

        setCurrentDisplay(winner);
        setWinners((prev) => [winner, ...prev]);
        setIsDrawing(false);
      }
    }, interval);
  };

  const resetDraw = () => {
    if (confirm("確定要重置所有抽籤紀錄嗎？")) {
      setWinners([]);
      setCurrentDisplay("準備抽籤");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-200 text-center">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-indigo-900">
            <Gift className="w-6 h-6 text-indigo-500" />
            幸運抽籤
          </h2>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-indigo-600 rounded border-neutral-300 focus:ring-indigo-500"
                checked={allowReplacement}
                onChange={(e) => setAllowReplacement(e.target.checked)}
                disabled={isDrawing}
              />
              <span className="text-sm font-medium text-neutral-700">
                允許重複中獎
              </span>
            </label>
            <button
              onClick={resetDraw}
              disabled={isDrawing || winners.length === 0}
              className="text-sm text-neutral-500 hover:text-neutral-800 flex items-center gap-1 disabled:opacity-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              重置
            </button>
          </div>
        </div>

        <div className="py-12 flex flex-col items-center justify-center min-h-[300px] bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200 mb-8 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDisplay}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.1 }}
              className={`text-5xl md:text-7xl font-black tracking-tight ${
                isDrawing
                  ? "text-neutral-400"
                  : winners.length > 0 && currentDisplay === winners[0]
                    ? "text-indigo-600 scale-110"
                    : "text-neutral-300"
              } transition-all`}
            >
              {currentDisplay}
            </motion.div>
          </AnimatePresence>

          {winners.length > 0 &&
            !isDrawing &&
            currentDisplay === winners[0] && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-indigo-500/5 mix-blend-multiply rounded-2xl animate-pulse" />
              </motion.div>
            )}
        </div>

        <button
          onClick={drawWinner}
          disabled={isDrawing || availablePool.length === 0}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white text-xl font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-3 mx-auto"
        >
          <Gift className="w-6 h-6" />
          {isDrawing ? "抽籤中..." : "抽出幸運兒"}
        </button>

        <p className="text-sm text-neutral-500 mt-4">
          剩餘可抽籤人數：{availablePool.length} 人
        </p>
      </div>

      {winners.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            中獎名單 ({winners.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <AnimatePresence>
              {winners.map((winner, index) => (
                <motion.div
                  key={`${winner}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-3 flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-yellow-200 text-yellow-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {winners.length - index}
                  </div>
                  <span
                    className="font-medium text-neutral-800 truncate"
                    title={winner}
                  >
                    {winner}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
