export interface FriendshipData {
  friendName: string;
  yourName: string;
  anniversaryDate: string;
  favoriteSong: string;
  customReasons: string[];
  memories: {
    title: string;
    description: string;
    theme: string; // e.g. "rose", "lavender", "apricot", "teal"
  }[];
}

export interface Sticker {
  id: string;
  type: "emoji" | "text" | "polaroid" | "heart" | "drawing";
  content: string;
  x: number; // percentage
  y: number; // percentage
  size: number; // in pixels
  rotation: number; // in degrees
}

export interface StoryChapter {
  id: number;
  title: string;
  illustrativeIcon: string;
  narrativeText: string;
  promptQuestion?: string;
}
