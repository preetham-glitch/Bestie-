import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Heart, Star, Quote, RefreshCw } from "lucide-react";
import { playChime, playSparkle } from "../utils/audio";

interface ReasonsBasketProps {
  customReasons: string[];
  friendName: string;
}

export default function ReasonsBasket({ customReasons, friendName }: ReasonsBasketProps) {
  const [activeReason, setActiveReason] = useState<string | null>(null);
  const [starPositions] = useState(() => {
    // Generate deterministic but organic random coordinates for stars floating inside the jar
    return [...Array(9)].map((_, i) => ({
      id: i,
      x: 15 + (i * 8.5) % 65 + Math.random() * 5,
      y: 20 + (i * 9) % 55 + Math.random() * 5,
      size: 16 + (i % 3) * 6,
      color: ["text-amber-300", "text-amber-200", "text-pink-300", "text-rose-300", "text-teal-200", "text-purple-300"][i % 6],
    }));
  });

  const handleStarClick = (index: number) => {
    playChime(1.15);
    const selected = customReasons[index % customReasons.length];
    setActiveReason(selected);
  };

  const handlePullRandom = () => {
    playSparkle();
    const randomIndex = Math.floor(Math.random() * customReasons.length);
    setActiveReason(customReasons[randomIndex]);
  };

  return (
    <div id="reasons-basket-section" className="w-full max-w-xl mx-auto p-2 xs:p-4 sm:p-6 text-center space-y-4 xs:space-y-6">
      <div className="space-y-1.5 sm:space-y-2 px-1">
        <h3 className="font-display text-xl xs:text-2xl sm:text-3xl font-extrabold text-rose-700 flex items-center justify-center gap-1.5 flex-wrap">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 fill-amber-300 animate-pulse" /> 
          The Bestie Treasure Jar
        </h3>
        <p className="font-sans text-[11px] xs:text-xs sm:text-sm text-rose-600/80 max-w-md mx-auto leading-relaxed">
          Inside this starry little glass jar are secret reasons why you are the most precious friend in the entire universe. Tap a star to read one!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 py-2">
        {/* The Glass Jar Visual */}
        <div id="reasons-jar" className="relative w-40 xs:w-48 h-56 xs:h-64 bg-white/25 rounded-b-[3.5rem] xs:rounded-b-[4rem] rounded-t-3xl border-4 border-slate-100 shadow-xl flex items-center justify-center overflow-hidden backdrop-blur-xs shrink-0 select-none">
          {/* Wooden lid */}
          <div className="absolute top-0 inset-x-0 h-4 bg-amber-400 border-b-2 border-amber-500 rounded-t-lg shadow" />
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-10 xs:w-12 h-2 bg-amber-600 rounded-full" />

          {/* Liquid glass light reflections */}
          <div className="absolute left-2.5 xs:left-3 top-6 bottom-6 w-1 bg-white/40 rounded-full pointer-events-none" />
          <div className="absolute right-2.5 xs:right-3 top-10 bottom-16 w-0.5 bg-white/20 rounded-full pointer-events-none" />

          {/* Floating Stars Inside Jar */}
          {starPositions.map((star, idx) => (
            <motion.button
              key={star.id}
              onClick={() => handleStarClick(idx)}
              style={{ left: `${star.x}%`, top: `${star.y}%` }}
              className={`absolute cursor-pointer transition-all ${star.color} hover:scale-135 py-1 px-1 focus:outline-none focus:ring-1 focus:ring-amber-200 rounded`}
              animate={{
                y: [0, -6, 0],
                rotate: [0, 15, -15, 0]
              }}
              transition={{
                duration: 3 + (idx % 3),
                repeat: Infinity,
                delay: idx * 0.2,
                ease: "easeInOut"
              }}
            >
              <Star style={{ width: star.size * 0.9, height: star.size * 0.9 }} className="fill-current filter drop-shadow hover:filter-none" />
            </motion.button>
          ))}

          {/* Labeled Ribbon on Jar */}
          <div className="absolute bottom-10 xs:bottom-12 inset-x-3 xs:inset-x-4 bg-rose-400 border border-rose-300 text-white font-serif py-1 px-1.5 text-[9px] xs:text-[10px] tracking-wider uppercase rounded shadow rotate-[-2deg] pointer-events-none text-center truncate">
            For {friendName} ✨
          </div>
        </div>

        {/* Action button in case jar is full */}
        <div className="flex flex-col items-center gap-2 xs:gap-3">
          <button
            onClick={handlePullRandom}
            className="flex items-center gap-1.5 font-display text-xs font-bold bg-amber-400 hover:bg-amber-500 text-amber-950 px-4 py-2.5 xs:py-3 rounded-xl shadow-md cursor-pointer transition-colors active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" style={{ animationDuration: "8s" }} /> Pull a Star at Random!
          </button>
          
          <span className="font-mono text-[9px] text-rose-400/80 font-semibold uppercase tracking-wider">
            Total of {customReasons.length} golden stars
          </span>
        </div>
      </div>

      {/* Reason Unveiling Modal overlay */}
      <AnimatePresence>
        {activeReason && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-rose-950/20 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade"
            onClick={() => setActiveReason(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-4 xs:p-6 sm:p-8 max-w-sm sm:max-w-md w-[92vw] sm:w-full border-4 border-pink-100 shadow-2xl relative overflow-hidden"
            >
              {/* Cute corner decorations */}
              <div className="absolute top-0 right-0 w-12 h-12 xs:w-16 xs:h-16 bg-gradient-to-bl from-pink-100/30 to-transparent rounded-bl-3xl" />
              <div className="absolute bottom-0 left-0 w-12 h-12 xs:w-16 xs:h-16 bg-gradient-to-tr from-rose-100/30 to-transparent rounded-tr-3xl" />
              
              <div className="text-center space-y-3 xs:space-y-4">
                <div className="mx-auto w-10 h-10 xs:w-12 xs:h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                  <Star className="w-5 h-5 xs:w-6 xs:h-6 fill-amber-300" />
                </div>

                <div className="relative">
                  <Quote className="w-6 h-6 xs:w-8 xs:h-8 text-rose-200 absolute -top-3 -left-1 sm:-left-2 rotate-180 -z-0" />
                  <p className="font-sans text-rose-900 font-medium text-xs xs:text-sm sm:text-base leading-relaxed px-5 xs:px-6 py-1.5 xs:py-2 relative z-10 break-words">
                    "{activeReason}"
                  </p>
                </div>

                <div className="border-t border-rose-100 pt-3 xs:pt-4 flex justify-between items-center px-1 sm:px-4">
                  <span className="font-display font-semibold text-[9px] xs:text-[10px] text-pink-500 tracking-wider">
                    REASON TO CELEBRATE YOU
                  </span>
                  
                  <button
                    onClick={() => setActiveReason(null)}
                    className="font-display text-[10px] xs:text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 xs:px-3 py-1.5 rounded-lg border border-rose-200 cursor-pointer"
                  >
                    Hold Close 💖
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
