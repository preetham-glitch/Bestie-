import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { Sparkles, Trash2, Plus, Smile, Image, Type, RotateCw, Heart } from "lucide-react";
import { Sticker } from "../types";
import { playChime, playSparkle } from "../utils/audio";

interface ScrapbookProps {
  friendName: string;
}

export default function Scrapbook({ friendName }: ScrapbookProps) {
  const [stickers, setStickers] = useState<Sticker[]>([
    {
      id: "sticker-1",
      type: "polaroid",
      content: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=400",
      x: 15,
      y: 12,
      size: 160,
      rotation: -6,
    },
    {
      id: "sticker-2",
      type: "emoji",
      content: "🌸",
      x: 65,
      y: 10,
      size: 45,
      rotation: 12,
    },
    {
      id: "sticker-3",
      type: "text",
      content: "Best Friends 4ever! ✨",
      x: 10,
      y: 75,
      size: 130,
      rotation: 4,
    },
    {
      id: "sticker-4",
      type: "emoji",
      content: "🧸",
      x: 72,
      y: 65,
      size: 55,
      rotation: -10,
    }
  ]);

  const [inputText, setInputText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const dragInfo = useRef<{ stickerId: string; startX: number; startY: number; origX: number; origY: number } | null>(null);

  const addEmoji = (emoji: string) => {
    playChime(1.0);
    const newSticker: Sticker = {
      id: `emoji-${Date.now()}`,
      type: "emoji",
      content: emoji,
      x: 35 + Math.random() * 20,
      y: 35 + Math.random() * 20,
      size: 50,
      rotation: (Math.random() - 0.5) * 30,
    };
    setStickers((prev) => [...prev, newSticker]);
  };

  const addTextSticker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    playSparkle();
    const newSticker: Sticker = {
      id: `text-${Date.now()}`,
      type: "text",
      content: inputText,
      x: 30 + Math.random() * 20,
      y: 30 + Math.random() * 20,
      size: 140,
      rotation: (Math.random() - 0.5) * 15,
    };
    setStickers((prev) => [...prev, newSticker]);
    setInputText("");
  };

  const addImagePolaroid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    playSparkle();
    const newSticker: Sticker = {
      id: `img-${Date.now()}`,
      type: "polaroid",
      content: imageUrl,
      x: 25 + Math.random() * 20,
      y: 25 + Math.random() * 20,
      size: 160,
      rotation: (Math.random() - 0.5) * 20,
    };
    setStickers((prev) => [...prev, newSticker]);
    setImageUrl("");
  };

  // Sticker dragging logic
  const handleStickerPointerDown = (e: React.PointerEvent, sticker: Sticker) => {
    e.preventDefault();
    setSelectedSticker(sticker.id);
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    dragInfo.current = {
      stickerId: sticker.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: (sticker.x / 100) * rect.width,
      origY: (sticker.y / 100) * rect.height,
    };
    boardRef.current.setPointerCapture(e.pointerId);
  };

  const handleBoardPointerMove = (e: React.PointerEvent) => {
    if (!dragInfo.current || !boardRef.current) return;
    const info = dragInfo.current;
    const rect = boardRef.current.getBoundingClientRect();
    
    // Calc delta
    const dX = e.clientX - info.startX;
    const dY = e.clientY - info.startY;

    // Target pixels
    const newPixelX = info.origX + dX;
    const newPixelY = info.origY + dY;

    // Convert to responsive percentages
    let percentageX = (newPixelX / rect.width) * 100;
    let percentageY = (newPixelY / rect.height) * 100;

    // Clamp inside board boundaries
    percentageX = Math.max(0, Math.min(90, percentageX));
    percentageY = Math.max(0, Math.min(90, percentageY));

    setStickers((prev) =>
      prev.map((s) => (s.id === info.stickerId ? { ...s, x: percentageX, y: percentageY } : s))
    );
  };

  const handleBoardPointerUp = (e: React.PointerEvent) => {
    if (dragInfo.current && boardRef.current) {
      boardRef.current.releasePointerCapture(e.pointerId);
    }
    dragInfo.current = null;
  };

  const rotateSticker = (id: string) => {
    playChime(1.1);
    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, rotation: (s.rotation + 15) % 360 } : s))
    );
  };

  const resizeSticker = (id: string, delta: number) => {
    playChime(0.9);
    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, size: Math.max(40, Math.min(300, s.size + delta)) } : s))
    );
  };

  const deleteSticker = (id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
    if (selectedSticker === id) setSelectedSticker(null);
    playChime(0.8);
  };

  return (
    <div id="scrapbook-section" className="w-full max-w-4xl mx-auto p-2 xs:p-4 sm:p-6 space-y-4 xs:space-y-6">
      <div className="text-center space-y-1 px-1">
        <h3 className="font-display text-xl xs:text-2xl sm:text-3xl font-extrabold text-rose-700 flex items-center justify-center gap-1.5 flex-wrap">
          🧸 Memory Lane Scrapbook
        </h3>
        <p className="font-sans text-[11px] xs:text-xs sm:text-sm text-pink-600/80 max-w-lg mx-auto leading-relaxed">
          Design a cozy collage card for {friendName}! Drag elements, rotate them, or add custom notes and polaroids.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Scrapbook Sidebar Controls */}
        <div id="scrapbook-controls" className="lg:col-span-1 bg-white/70 backdrop-blur-xs rounded-2xl p-4 border border-rose-100 space-y-5 shadow-sm">
          {/* Emojis Selector */}
          <div className="space-y-2">
            <h4 className="font-display text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
              <Smile className="w-3.5 h-3.5" /> Emoji Stickers
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {["💖", "✨", "🧸", "🌸", "🍕", "🧁", "🐨", "🎈", "🐱", "☕"].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => addEmoji(emoji)}
                  className="text-xl hover:scale-125 transition-transform p-1.5 bg-rose-50 hover:bg-rose-100 rounded-lg cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Texts Selector */}
          <div className="space-y-2">
            <h4 className="font-display text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
              <Type className="w-3.5 h-3.5" /> Custom Quote Label
            </h4>
            <form onSubmit={addTextSticker} className="flex gap-1.5">
              <input
                type="text"
                placeholder="e.g., Besties!"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-rose-100 outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 placeholder-rose-200 text-rose-900"
              />
              <button
                type="submit"
                className="bg-rose-500 hover:bg-rose-600 text-white p-1.5 rounded-lg cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Custom Polaroid / Image Sticker */}
          <div className="space-y-2">
            <h4 className="font-display text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
              <Image className="w-3.5 h-3.5" /> Image Polaroid
            </h4>
            <form onSubmit={addImagePolaroid} className="flex gap-1.5">
              <input
                type="text"
                placeholder="Insert image URL..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-rose-100 outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 placeholder-rose-200 text-rose-900"
              />
              <button
                type="submit"
                className="bg-rose-500 hover:bg-rose-600 text-white p-1.5 rounded-lg cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-pink-500/70 italic xs:leading-normal">
              Psst: Use any online link to put a real image of you two!
            </p>
          </div>

          {/* Selected sticker actions */}
          {selectedSticker && (
            <div className="pt-2 border-t border-rose-100 space-y-2">
              <h4 className="font-display text-[9px] xs:text-[10px] font-bold text-rose-800 uppercase">Selected Item Controls:</h4>
              <div className="flex flex-wrap gap-1 md:gap-1.5 justify-between items-center">
                <button
                  onClick={() => rotateSticker(selectedSticker)}
                  className="flex items-center gap-0.5 text-[9px] xs:text-[10px] bg-slate-100 hover:bg-slate-200 font-bold px-2 py-1 rounded cursor-pointer text-slate-700 shrink-0"
                >
                  <RotateCw className="w-2.5 h-2.5 xs:w-3 xs:h-3" /> Rotate
                </button>
                <div className="flex gap-0.5 xs:gap-1 items-center">
                  <button
                    onClick={() => resizeSticker(selectedSticker, 15)}
                    className="text-[9px] xs:text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded cursor-pointer font-bold text-slate-700"
                  >
                    +
                  </button>
                  <button
                    onClick={() => resizeSticker(selectedSticker, -15)}
                    className="text-[9px] xs:text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded cursor-pointer font-bold text-slate-700"
                  >
                    -
                  </button>
                </div>
                <button
                  onClick={() => deleteSticker(selectedSticker)}
                  className="flex items-center gap-0.5 text-[9px] xs:text-[10px] bg-rose-100 hover:bg-rose-200 font-bold px-2 py-1 rounded text-rose-700 cursor-pointer shrink-0"
                >
                  <Trash2 className="w-2.5 h-2.5 xs:w-3 xs:h-3" /> Trash
                </button>
              </div>
            </div>
          )}
        </div>

        {/* The Drag Canvas Board */}
        <div className="lg:col-span-3">
          <div
            id="scrapbook-canvas"
            ref={boardRef}
            onPointerMove={handleBoardPointerMove}
            onPointerUp={handleBoardPointerUp}
            className="w-full h-[320px] xs:h-[380px] sm:h-[450px] relative bg-amber-50/50 rounded-3xl border-4 border-amber-100/60 shadow-inner overflow-hidden select-none"
            style={{ touchAction: "none" }}
          >
            {/* Scrapbook cork/wood background design */}
            <div className="absolute inset-0 bg-radial-gradient from-white/70 to-pink-50/20 pointer-events-none" />
            <div className="absolute right-4 bottom-4 font-serif text-[10px] text-pink-300 font-semibold tracking-wider pointer-events-none flex items-center gap-1 z-0">
              <Heart className="w-3 h-3 fill-pink-200 text-pink-300 rotate-[-12deg]" /> ours memory scrapbook board
            </div>

            {stickers.length === 0 && (
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 pointer-events-none">
                <Sparkles className="w-8 h-8 text-rose-300 mb-2 animate-pulse" />
                <p className="font-serif text-sm text-pink-600/80">The canvas is silent and waiting.</p>
                <p className="font-sans text-xs text-pink-400">Add stickers from the panel on the left to start drawing your memories!</p>
              </div>
            )}

            {/* Render Stickers */}
            {stickers.map((s) => {
              const rotateStr = `${s.rotation}deg`;
              const isSelected = selectedSticker === s.id;

              return (
                <div
                  key={s.id}
                  onPointerDown={(e) => handleStickerPointerDown(e, s)}
                  style={{
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    transform: `rotate(${rotateStr})`,
                    position: "absolute",
                    cursor: "grab",
                    zIndex: isSelected ? 40 : 10,
                  }}
                  className={`group relative select-none rounded p-1 transition-shadow hover:shadow ${
                    isSelected ? "ring-2 ring-rose-400 ring-offset-2 shadow-lg" : ""
                  }`}
                >
                  {/* Polaroid Frame rendering */}
                  {s.type === "polaroid" && (
                    <div
                      style={{ width: s.size, maxWidth: "78vw" }}
                      className="bg-white p-2.5 pb-8 shadow-md rounded border border-gray-100 flex flex-col items-center justify-center pointer-events-none"
                    >
                      <img
                        src={s.content}
                        alt="Scrapbook Memory"
                        referrerPolicy="no-referrer"
                        className="w-full aspect-square object-cover bg-slate-50 border border-slate-100"
                        onError={(e) => {
                          // Fallback safe placeholder
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300";
                        }}
                      />
                      <div className="w-full text-center font-serif text-[10px] text-gray-500 font-semibold tracking-wider mt-2 rotate-[-1deg] truncate max-w-full">
                        ♥ snapshot ♥
                      </div>
                    </div>
                  )}

                  {/* Emoji sticker rendering */}
                  {s.type === "emoji" && (
                    <span 
                      style={{ fontSize: s.size * 0.8 }} 
                      className="filter drop-shadow-md select-none block leading-none pointer-events-none"
                    >
                      {s.content}
                    </span>
                  )}

                  {/* Custom script text render */}
                  {s.type === "text" && (
                    <div
                      style={{ width: s.size, maxWidth: "78vw" }}
                      className="px-3 py-1.5 bg-yellow-100 rounded-lg shadow border border-yellow-200 text-center font-serif text-amber-900 font-bold text-xs pointer-events-none whitespace-normal break-words"
                    >
                      {s.content}
                    </div>
                  )}

                  {/* Doubleclick hint delete triggers */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSticker(s.id);
                    }}
                    className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-50 cursor-pointer shadow-md hover:bg-rose-600 pointer-events-auto"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
