import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ChevronLeft, BookOpen, Sparkles, MessageCircleHeart } from "lucide-react";
import { StoryChapter } from "../types";
import { playChime, playSuccessChime } from "../utils/audio";

interface StoryBookProps {
  chapters: StoryChapter[];
  friendName: string;
  yourName: string;
  onFinish: () => void;
}

export default function StoryBook({ chapters, friendName, yourName, onFinish }: StoryBookProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [userResponse, setUserResponse] = useState("");
  const [savedResponses, setSavedResponses] = useState<Record<number, string>>({});
  const [showResponseFeedback, setShowResponseFeedback] = useState(false);

  const activeChapter = chapters[currentPage];

  // Simulating typewriter effects for the storytelling feel
  useEffect(() => {
    setTypedText("");
    let index = 0;
    const textPath = activeChapter.narrativeText;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + textPath.charAt(index));
      index++;
      if (index >= textPath.length) {
        clearInterval(interval);
      }
    }, 20); // speedy typewriter

    // Load any saved responses
    setUserResponse(savedResponses[activeChapter.id] || "");
    setShowResponseFeedback(false);

    return () => clearInterval(interval);
  }, [currentPage, activeChapter]);

  const handleNext = () => {
    if (currentPage < chapters.length - 1) {
      setCurrentPage((prev) => prev + 1);
      playChime(1.05);
    } else {
      playSuccessChime();
      onFinish();
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
      playChime(0.95);
    }
  };

  const saveResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userResponse.trim()) return;
    setSavedResponses((prev) => ({
      ...prev,
      [activeChapter.id]: userResponse,
    }));
    setShowResponseFeedback(true);
    playSuccessChime();
  };

  return (
    <div id="storybook-container" className="max-w-2xl w-full mx-auto p-2 xs:p-4 sm:p-6 bg-amber-50/40 rounded-3xl border border-amber-100 shadow-sm relative">
      {/* Page Progress Indicator */}
      <div className="flex justify-between items-center mb-4 sm:mb-6 px-1">
        <span className="font-mono text-[10px] sm:text-xs text-amber-800/60 font-semibold uppercase tracking-wider">
          Chapter {currentPage + 1} of {chapters.length}
        </span>
        <div className="flex gap-1">
          {chapters.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentPage ? "w-5 sm:w-6 bg-rose-400" : "w-1.5 bg-rose-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Book Container with paper texture */}
      <div 
        id="storybook-leaf"
        className="bg-white rounded-2xl shadow-xl border border-amber-100 relative min-h-[380px] xs:min-h-[420px] flex flex-col justify-between overflow-hidden"
      >
        {/* Soft binding spiral on the left for physical look (on desktop only) */}
        <div className="hidden sm:flex absolute left-4 top-0 bottom-0 w-2 flex-col justify-around py-6 pointer-events-none z-10">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-slate-100 border-2 border-slate-200 -ml-2 shadow-inner" />
          ))}
        </div>

        {/* Content Area */}
        <div className="p-4 xs:p-6 sm:p-10 pl-4 xs:pl-6 sm:pl-12 flex-grow flex flex-col justify-between relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Illustrative Icon Heading */}
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-3xl sm:text-4xl filter drop-shadow animate-bounce">{activeChapter.illustrativeIcon}</span>
                <h2 className="font-display text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-rose-700 tracking-tight leading-snug">
                  {activeChapter.title}
                </h2>
              </div>

              {/* Narrative Story (Main text) */}
              <p className="font-sans text-rose-900/90 leading-relaxed text-xs xs:text-sm sm:text-base min-h-[100px] xs:min-h-[120px] transition-all">
                {typedText}
                {typedText.length < activeChapter.narrativeText.length && (
                  <span className="inline-block w-1.5 h-3.5 sm:h-4 bg-rose-300 ml-1 animate-pulse" />
                )}
              </p>

              {/* Sweet Reflection Interaction */}
              {activeChapter.promptQuestion && (
                <div className="mt-4 sm:mt-8 p-3 sm:p-4 bg-pink-50/60 rounded-xl border border-pink-100 space-y-2 sm:space-y-3">
                  <h4 className="font-display text-[10px] sm:text-xs font-bold text-pink-700 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageCircleHeart className="w-3.5 h-3.5" /> A little question for {friendName}:
                  </h4>
                  <p className="font-sans font-medium text-xs sm:text-sm text-pink-900/80 italic">
                    "{activeChapter.promptQuestion}"
                  </p>
                  
                  {/* Small Response Form */}
                  <form onSubmit={saveResponse} className="flex gap-1.5 sm:gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Write your thought here..."
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                      className="flex-grow text-xs px-2.5 py-1.5 rounded-lg border border-pink-200 outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 placeholder-pink-300 text-rose-900 font-sans min-w-0"
                    />
                    <button
                      type="submit"
                      className="shrink-0 bg-rose-500 hover:bg-rose-600 font-display text-xs text-white font-medium px-3.5 py-1.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      Save
                    </button>
                  </form>

                  {showResponseFeedback && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] text-green-600 font-semibold font-sans mt-1"
                    >
                      ✨ Got it locked in! That is incredibly sweet.
                    </motion.p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="bg-rose-50/40 border-t border-rose-100 p-3 xs:p-4 px-4 sm:px-6 flex justify-between items-center z-10 gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={`flex items-center gap-0.5 sm:gap-1 font-display text-[10px] xs:text-xs font-semibold px-2 xs:px-3 py-1 xs:py-1.5 rounded-lg border transition-all cursor-pointer ${
              currentPage === 0
                ? "border-transparent text-gray-300 cursor-not-allowed"
                : "border-rose-200 text-rose-600 hover:bg-rose-50"
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5 xs:w-4 xs:h-4" /> Back
          </button>

          <span className="font-mono text-[9px] xs:text-[10px] text-rose-400 font-bold tracking-wider">
            {currentPage + 1} / {chapters.length}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-0.5 sm:gap-1 font-display text-[10px] xs:text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer shrink-0"
          >
            {currentPage === chapters.length - 1 ? (
              <>
                <span className="hidden xs:inline">Finish Chapter</span>
                <span className="xs:hidden">Finish</span> <Sparkles className="w-3 h-3 xs:w-3.5 xs:h-3.5" />
              </>
            ) : (
              <>
                <span className="hidden xs:inline">Next Page</span>
                <span className="xs:hidden">Next</span> <ChevronRight className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
