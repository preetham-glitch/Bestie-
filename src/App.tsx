import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  Sparkles, 
  Settings, 
  BookOpen, 
  Trophy, 
  Gift, 
  Plus, 
  Trash2, 
  Clock, 
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { FriendshipData } from "./types";
import { DEFAULT_FRIENDSHIP_DATA, STORY_CHAPTERS } from "./data";
import { playChime, playSuccessChime, playSparkle } from "./utils/audio";

// Component imports
import LetterEnvelope from "./components/LetterEnvelope";
import StoryBook from "./components/StoryBook";
import Scrapbook from "./components/Scrapbook";
import ReasonsBasket from "./components/ReasonsBasket";

export default function App() {
  const [data, setData] = useState<FriendshipData>(DEFAULT_FRIENDSHIP_DATA);
  const [isOpened, setIsOpened] = useState(false);
  const [activeTab, setActiveTab] = useState<"story" | "scrapbook" | "jar" | "award">("story");
  const [showSettings, setShowSettings] = useState(false);
  const [newReason, setNewReason] = useState("");
  
  // Confetti / Floating heart particles state
  const [bubbles, setBubbles] = useState<{ id: number; left: number; delay: number; size: number; content: string }[]>([]);

  useEffect(() => {
    // Generate lovely floating particles for deep cozy aesthetics
    const symbols = ["🌸", "✨", "💖", "⭐", "🎈"];
    const generated = [...Array(15)].map((_, idx) => ({
      id: idx,
      left: Math.random() * 95,
      delay: Math.random() * 6,
      size: 14 + Math.random() * 18,
      content: symbols[idx % symbols.length],
    }));
    setBubbles(generated);
  }, []);

  // Live input handlers
  const updateDataField = (field: keyof FriendshipData, value: any) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddReason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReason.trim()) return;
    playChime(1.1);
    setData((prev) => ({
      ...prev,
      customReasons: [...prev.customReasons, newReason.trim()],
    }));
    setNewReason("");
  };

  const handleRemoveReason = (index: number) => {
    playChime(0.85);
    setData((prev) => ({
      ...prev,
      customReasons: prev.customReasons.filter((_, idx) => idx !== index),
    }));
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    playChime(1.0);
  };

  // Compute total days of friendship
  const getFriendshipDaysCount = () => {
    try {
      const anniversary = new Date(data.anniversaryDate);
      const today = new Date();
      const difference = today.getTime() - anniversary.getTime();
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 0;
    } catch {
      return 0;
    }
  };

  return (
    <div id="application-root" className="min-h-screen bg-linear-to-b from-rose-50/70 via-amber-50/50 to-purple-50/30 flex flex-col justify-between font-sans relative overflow-hidden pb-12">
      
      {/* Absolute floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            initial={{ y: "110vh", opacity: 0 }}
            animate={{ y: "-10vh", opacity: [0, 0.6, 0.6, 0] }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: bubble.delay,
              ease: "linear",
            }}
            style={{
              left: `${bubble.left}%`,
              fontSize: bubble.size,
              position: "absolute",
            }}
          >
            {bubble.content}
          </motion.div>
        ))}
      </div>

      {/* Persistent top bar - Settings Toggle & Title */}
      <header className="relative z-40 bg-white/70 backdrop-blur-md border-b border-rose-100 px-3 xs:px-4 sm:px-6 py-2.5 sm:py-3 flex justify-between items-center shadow-xs select-none">
        <div className="flex items-center gap-1 xs:gap-1.5 cursor-pointer" onClick={() => { playChime(); setIsOpened(false); }}>
          <Heart className="w-4 h-4 xs:w-5 xs:h-5 text-rose-500 fill-rose-300 animate-pulse" />
          <span className="font-serif text-sm xs:text-base sm:text-lg text-rose-700 font-bold hover:opacity-80 transition-opacity">
            sweet memories.
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => {
              playChime();
              setShowSettings(!showSettings);
            }}
            className="flex items-center gap-1 font-display text-[11px] xs:text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 xs:px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-inner shrink-0"
          >
            <Settings className="w-3 h-3 xs:w-3.5 xs:h-3.5 animate-spin-slow" /> 
            <span className="hidden xs:inline">{showSettings ? "Close Designer" : "Customize Gift!"}</span>
            <span className="xs:hidden">{showSettings ? "Close" : "Edit"}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center relative z-10 px-4 py-8">
        
        {/* SETTINGS / CUSTOMIZATION DRAWER CARD */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="absolute top-0 inset-x-4 max-w-4xl mx-auto z-30 bg-white rounded-3xl border border-rose-100 overflow-hidden shadow-2xl p-6 mb-12 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-rose-100 pb-3">
                <h3 className="font-display text-lg font-bold text-rose-800 flex items-center gap-2">
                  🎨 Gift Customization Panel
                </h3>
                <span className="font-mono text-[10px] text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full font-bold">
                  UPDATES LIVE PREVIEW
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Names and Anniversary Fields */}
                <div className="space-y-4">
                  <h4 className="font-display text-xs font-bold text-rose-700 uppercase tracking-wider">
                    Core Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-rose-700/80 font-semibold mb-1">
                        Best Friend's Name:
                      </label>
                      <input
                        type="text"
                        value={data.friendName}
                        onChange={(e) => updateDataField("friendName", e.target.value)}
                        className="w-full text-sm px-3.5 py-2 rounded-xl border border-rose-100 outline-none focus:ring-1 focus:ring-rose-400 placeholder-rose-200 text-rose-900"
                        placeholder="e.g. Ella"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-rose-700/80 font-semibold mb-1">
                        Your Name:
                      </label>
                      <input
                        type="text"
                        value={data.yourName}
                        onChange={(e) => updateDataField("yourName", e.target.value)}
                        className="w-full text-sm px-3.5 py-2 rounded-xl border border-rose-100 outline-none focus:ring-1 focus:ring-rose-400 placeholder-rose-200 text-rose-900"
                        placeholder="e.g. Charlotte"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-rose-700/80 font-semibold mb-1">
                        Friendly Anniversary Date:
                      </label>
                      <input
                        type="date"
                        value={data.anniversaryDate}
                        onChange={(e) => updateDataField("anniversaryDate", e.target.value)}
                        className="w-full text-sm px-3.5 py-2 rounded-xl border border-rose-100 outline-none focus:ring-1 focus:ring-rose-400 text-rose-900"
                      />
                    </div>
                  </div>


                </div>

                {/* Star Jar List Builder */}
                <div className="space-y-4">
                  <h4 className="font-display text-xs font-bold text-rose-700 uppercase tracking-wider">
                    Friendship Stars ({data.customReasons.length})
                  </h4>
                  
                  <form onSubmit={handleAddReason} className="flex gap-2">
                    <input
                      type="text"
                      value={newReason}
                      onChange={(e) => setNewReason(e.target.value)}
                      placeholder="e.g., You remember all my coffee preferences."
                      className="flex-grow text-xs px-3 py-2 rounded-xl border border-rose-100 outline-none focus:ring-1 focus:ring-rose-400 placeholder-rose-200 text-rose-900"
                    />
                    <button
                      type="submit"
                      className="bg-rose-500 hover:bg-rose-600 text-white font-display text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </form>

                  <div className="max-h-[180px] overflow-y-auto border border-rose-150 rounded-xl divide-y divide-rose-50 p-2 bg-rose-50/20">
                    {data.customReasons.map((reason, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 px-1 text-xs text-rose-900">
                        <span className="truncate pr-4 flex-grow">🌟 {reason}</span>
                        <button
                          onClick={() => handleRemoveReason(idx)}
                          className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => setShowSettings(false)}
                  className="bg-rose-100 hover:bg-rose-200 text-rose-700 font-display text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer"
                >
                  Save and Back to Reader View
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* READER VIEW STATES */}
        {!isOpened ? (
          /* State 1: Envelope Sealed letter */
          <LetterEnvelope 
            friendName={data.friendName} 
            yourName={data.yourName} 
            onOpen={() => setIsOpened(true)} 
          />
        ) : (
          /* State 2: Fold-out interactive card decks */
          <div className="w-full flex flex-col items-center gap-8 py-4">
            
            {/* Interactive Tab navigation rails with short and long labels */}
            <div 
              id="story-navigation-tabs" 
              className="flex justify-center items-center gap-0.5 xs:gap-1 p-1 bg-white/75 backdrop-blur-md rounded-2xl border border-pink-100 shadow-xs max-w-[96vw] overflow-x-auto no-scrollbar"
            >
              {[
                { id: "story", label: "📖 Our Story", shortLabel: "📖 Story", color: "bg-rose-100 text-rose-700" },
                { id: "scrapbook", label: "🧸 Collage Scrapbook", shortLabel: "🧸 Collage", color: "bg-amber-100 text-amber-800" },
                { id: "jar", label: "🍯 Jar of Truths", shortLabel: "🍯 Jar", color: "bg-cyan-100 text-cyan-800" },
                { id: "award", label: "🏆 Award Diploma", shortLabel: "🏆 Award", color: "bg-yellow-100 text-yellow-800" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as any)}
                  className={`text-[11px] xs:text-xs px-2.5 xs:px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-display font-medium cursor-pointer flex whitespace-nowrap transition-all items-center ${
                    activeTab === tab.id 
                      ? `${tab.color} shadow-sm font-bold scale-102` 
                      : "text-rose-900/60 hover:text-rose-800 hover:bg-rose-50"
                  }`}
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </button>
              ))}
            </div>

            {/* Render selected interaction zone */}
            <div className="w-full flex justify-center min-h-[460px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="w-full"
                >
                  {activeTab === "story" && (
                    <StoryBook
                      chapters={STORY_CHAPTERS}
                      friendName={data.friendName}
                      yourName={data.yourName}
                      onFinish={() => setActiveTab("scrapbook")}
                    />
                  )}

                  {activeTab === "scrapbook" && (
                    <Scrapbook friendName={data.friendName} />
                  )}

                  {activeTab === "jar" && (
                    <ReasonsBasket 
                      customReasons={data.customReasons} 
                      friendName={data.friendName} 
                    />
                  )}

                  {activeTab === "award" && (
                    <div id="award-section" className="max-w-xl w-full mx-auto p-2 xs:p-4 flex flex-col justify-center items-center text-center space-y-4 sm:space-y-6">
                      
                      {/* Interactive Diploma Frame Card */}
                      <motion.div 
                        initial={{ scale: 0.9, rotate: -2 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="bg-white p-4 xs:p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] border-4 xs:border-8 border-yellow-250 shadow-2xl relative w-full overflow-hidden"
                      >
                        {/* Golden corner decals */}
                        <div className="absolute top-2 left-2 w-6 h-6 xs:w-8 xs:h-8 border-t-2 border-l-2 border-yellow-500 rounded-tl-xl" />
                        <div className="absolute top-2 right-2 w-6 h-6 xs:w-8 xs:h-8 border-t-2 border-r-2 border-yellow-500 rounded-tr-xl" />
                        <div className="absolute bottom-2 left-2 w-6 h-6 xs:w-8 xs:h-8 border-b-2 border-l-2 border-yellow-500 rounded-bl-xl" />
                        <div className="absolute bottom-2 right-2 w-6 h-6 xs:w-8 xs:h-8 border-b-2 border-r-2 border-yellow-500 rounded-br-xl" />

                        {/* Retro Seal/Stamp */}
                        <div className="absolute right-2 top-2 xs:right-4 xs:top-4 sm:right-6 sm:top-6 w-11 h-11 xs:w-14 xs:h-14 sm:w-16 sm:h-16 bg-yellow-450 border border-yellow-500 text-yellow-950 rounded-full flex flex-col justify-center items-center font-display font-bold text-[6px] xs:text-[7px] sm:text-[8px] tracking-wider xs:tracking-widest leading-none xs:leading-tight uppercase rotate-[12deg] shadow-sm animate-pulse z-20">
                          <span>OFFICIAL</span>
                          <span>BESTIE</span>
                          <span>SEAL ♥</span>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                          <span className="font-serif text-amber-600 text-base xs:text-lg sm:text-2xl font-bold tracking-wide italic block">
                            Certificate of Pure Awesomeness
                          </span>
                          <div className="text-[8px] xs:text-[10px] text-zinc-400 font-mono tracking-widest uppercase font-bold">
                            Established and Recorded with Pride
                          </div>

                          <div className="py-3 xs:py-4 border-y border-dashed border-rose-100 my-3 xs:my-4 space-y-1.5 xs:space-y-2">
                            <span className="font-mono text-[8px] xs:text-[9px] uppercase tracking-wider text-rose-600 font-bold">
                              THIS AWARD IS PROUDLY GRANTED UNTO:
                            </span>
                            <h2 className="font-display text-xl xs:text-2xl sm:text-3xl md:text-4xl font-extrabold text-rose-800 tracking-tight leading-none uppercase break-words select-all px-1">
                              {data.friendName}
                            </h2>
                          </div>

                          <p className="font-sans text-rose-900/90 text-2xs xs:text-xs sm:text-sm leading-relaxed italic px-1 xs:px-4 break-words">
                            "For bringing pure, unadulterated sunshine to rainy ordinary days, having an incredibly infectious laughter, listening to caffeine-driven life theories, and being the sturdiest anchor a person could ever count on."
                          </p>

                          <div className="pt-4 xs:pt-6 grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 text-left border-t border-rose-100/60">
                            <div className="border-b xs:border-b-0 pb-2 xs:pb-0 border-rose-50">
                              <span className="block font-mono text-[8px] xs:text-[8.5px] text-amber-700/70 font-bold uppercase tracking-wider">
                                Co-Adventurer Signoff
                              </span>
                              <span className="font-serif text-sm xs:text-base sm:text-lg text-rose-600 font-bold leading-normal block pt-0.5 border-b border-rose-105">
                                {data.yourName}
                              </span>
                            </div>
                            <div>
                              <span className="block font-mono text-[8px] xs:text-[8.5px] text-amber-700/70 font-bold uppercase tracking-wider">
                                Days of Shared Laughs
                              </span>
                              <span className="font-mono text-xs xs:text-sm sm:text-base font-bold text-slate-800 flex items-center gap-1 pt-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400-slow" /> {getFriendshipDaysCount()} Days
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      <div className="flex gap-3 justify-center pt-1">
                        <button
                          onClick={() => {
                            playSparkle();
                            setIsOpened(false);
                          }}
                          className="font-display text-[11px] xs:text-xs font-bold text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-xl border border-rose-200 cursor-pointer"
                        >
                          ✉ Close and Lock Letter
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>



          </div>
        )}
      </main>

      {/* Sweet footer */}
      <footer className="text-center w-full py-4 relative z-10 select-none">
        <p className="font-display text-[10px] text-pink-600/70 font-bold flex items-center justify-center gap-1">
          Made with lots of sweet tea and cozy thoughts <Heart className="w-3 h-3 fill-pink-300 text-pink-400" />
        </p>
      </footer>
    </div>
  );
}
