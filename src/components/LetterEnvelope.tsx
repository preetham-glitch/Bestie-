import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Star, Sparkles, Mail, HeartOff } from "lucide-react";
import { playChime, playSparkle } from "../utils/audio";

interface LetterEnvelopeProps {
  friendName: string;
  yourName: string;
  onOpen: () => void;
}

export default function LetterEnvelope({ friendName, yourName, onOpen }: LetterEnvelopeProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleOpen = () => {
    if (isOpened) return;
    setIsOpened(true);
    playSparkle();
    
    // Smooth timing transition to trigger the parent slide/reveal
    setTimeout(() => {
      onOpen();
    }, 1800);
  };

  return (
    <div id="envelope-section" className="flex flex-col items-center justify-center min-h-[75vh] p-4 text-center">
      {/* Decorative floating clouds/stars in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <motion.div
          animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-[10%] text-pink-300 text-3xl"
        >
          🌸
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 right-[15%] text-purple-300 text-4xl"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 left-[20%] text-amber-300 text-2xl"
        >
          🧸
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 right-[25%] text-pink-200 text-3xl"
        >
          💖
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full relative z-10 px-2 sm:px-0"
      >
        <h1 id="envelope-main-title" className="font-display text-3xl xs:text-4xl sm:text-5xl font-bold text-rose-700 tracking-tight mb-2 sm:mb-3">
          Special Delivery!
        </h1>
        <p id="envelope-subtitle" className="font-sans text-rose-500/80 font-medium mb-6 sm:mb-12 text-xs xs:text-sm sm:text-base px-2">
          A heartfelt story made with love, just for you.
        </p>

        {/* The Digital Envelope Container */}
        <div 
          id="envelope-visual-wrapper"
          className="relative w-[280px] xs:w-80 sm:w-96 h-48 xs:h-56 sm:h-64 mx-auto cursor-pointer"
          onClick={handleOpen}
          onMouseEnter={() => {
            setIsHovered(true);
            playChime(1.1);
          }}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence>
            {!isOpened && (
              <motion.div
                id="envelope-physical-body"
                className="absolute inset-0 bg-pink-100 rounded-2xl shadow-xl border-4 border-pink-200 flex flex-col items-center justify-between p-4 xs:p-6 overflow-hidden"
                animate={{
                  scale: isHovered ? 1.03 : 1,
                  y: isHovered ? -5 : 0,
                  boxShadow: isHovered 
                    ? "0 20px 25px -5px rgba(244, 63, 94, 0.15), 0 10px 10px -5px rgba(244, 63, 94, 0.1)" 
                    : "0 10px 15px -3px rgba(0, 0, 0, 0.05)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                exit={{ 
                  y: 100, 
                  opacity: 0, 
                  scale: 0.9,
                  transition: { duration: 0.6, ease: "backIn" } 
                }}
              >
                {/* Envelope fold styling lines */}
                <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-pink-50/50 to-transparent pointer-events-none" />
                
                {/* Back flap triangles (simulated by styles) - now responsive to container width */}
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 border-l-transparent border-t-transparent border-r-[140px] xs:border-r-[160px] sm:border-r-[190px] border-b-[96px] xs:border-b-[112px] sm:border-b-[128px] border-r-pink-200/40 border-b-pink-200/40 pointer-events-none rounded-br-2xl" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 border-r-transparent border-t-transparent border-l-[140px] xs:border-l-[160px] sm:border-l-[190px] border-b-[96px] xs:border-b-[112px] sm:border-b-[128px] border-l-pink-200/40 border-b-pink-200/40 pointer-events-none rounded-bl-2xl" />

                {/* Sender & Recipient Labels */}
                <div className="w-full text-left font-mono text-[9px] xs:text-[10px] text-pink-500 tracking-wider">
                  FROM: {yourName.toUpperCase()}
                </div>

                {/* Golden Wax Seal */}
                <motion.div
                  id="envelope-wax-seal"
                  className="z-20 w-14 h-14 xs:w-16 xs:h-16 bg-amber-400 rounded-full border-4 border-amber-300 shadow-md flex items-center justify-center flex-col text-red-500 relative"
                  animate={{
                    rotate: isHovered ? [0, -10, 10, -5, 5, 0] : 0
                  }}
                  transition={{ duration: 0.8 }}
                >
                  <Heart className="w-6 h-6 fill-red-500 text-red-600 animate-pulse" />
                  <span className="font-display font-semibold text-[7px] xs:text-[8px] text-amber-900 mt-0.5 tracking-wider uppercase">OPEN</span>
                </motion.div>

                <div className="w-full text-right font-display text-rose-600 font-bold tracking-wide text-xs xs:text-sm">
                  TO: MY DEAR {friendName.toUpperCase()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Letter sliding out animation */}
          <AnimatePresence>
            {isOpened && (
              <motion.div
                id="envelope-sliding-letter"
                initial={{ y: 50, opacity: 0, scale: 0.8 }}
                animate={{ y: -50, opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -120 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 120, damping: 15 }}
                className="absolute inset-x-3 xs:inset-x-4 top-0 h-36 xs:h-44 sm:h-48 bg-white rounded-xl shadow-lg border-2 border-rose-100 flex flex-col justify-center items-center p-3 xs:p-4 text-center z-10"
              >
                <div className="absolute -top-3 w-8 h-8 xs:w-10 xs:h-10 bg-rose-50 rounded-full border border-rose-100 flex items-center justify-center text-rose-500">
                  <Sparkles className="w-4 h-4 xs:w-5 xs:h-5 animate-spin-slow" />
                </div>
                
                <h3 className="font-serif text-xl xs:text-2xl text-rose-600 font-semibold mb-1 xs:mb-2">My Best Friend</h3>
                <p className="font-sans text-rose-800 text-[10px] xs:text-xs sm:text-sm px-2 xs:px-4 leading-relaxed">
                  "A sweet journey down memory lane is about to unfold. Get ready to smile!"
                </p>
                
                <div className="flex gap-1.5 mt-3 xs:mt-4">
                  <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-rose-300 animate-bounce delay-75" />
                  <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-rose-400 animate-bounce delay-150" />
                  <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-rose-500 animate-bounce delay-300" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Interaction hints */}
        {!isOpened ? (
          <p className="font-sans text-xs xs:text-sm text-pink-600/60 mt-6 sm:mt-12 animate-pulse flex items-center justify-center gap-1.5">
            <Mail className="w-3.5 h-3.5 xs:w-4 xs:h-4" /> Tap the wax seal to break open the letter
          </p>
        ) : (
          <p className="font-sans text-xs xs:text-sm text-pink-600/80 mt-6 sm:mt-12 animate-bounce font-medium">
            Opening your book of memories...
          </p>
        )}
      </motion.div>
    </div>
  );
}
