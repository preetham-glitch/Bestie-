import { FriendshipData, StoryChapter } from "./types";

export const DEFAULT_FRIENDSHIP_DATA: FriendshipData = {
  friendName: "Bestie",
  yourName: "Your Friend",
  anniversaryDate: "2018-09-15",
  favoriteSong: "Lullaby Giggles",
  customReasons: [
    "You always know exactly when I need a hug, even from miles away.",
    "You listen to my endless rants about the tiniest things and make them feel important.",
    "We have a secret language of subtle glances, weird noises, and inside jokes.",
    "You are the absolute first person I want to text when something good or chaotic happens.",
    "You celebrate my smallest ordinary wins like I won a global gold medal.",
    "You make the simplest things—like sitting in silence or grocery shopping—an absolute adventure.",
    "With you, I can be 100% my strange, goofy, unpolished, authentic self.",
    "You see all my flaws and simply choose to wrap them in warm, kind patience.",
    "You have a magical way of making the heavy world feel light and full of laughter."
  ],
  memories: [
    {
      title: "The Rainy Day Adventure",
      description: "When we got completely drenched in that sudden downpour and ended up eating warm fries in a quiet cafe. Everything was damp, but our spirits were sparkling.",
      theme: "teal"
    },
    {
      title: "Late-Night Cozy Talks",
      description: "Those beautiful hours spent wrapped in blankets on the floor, talking about stars, fears, and silly childhood dreams until our voices grew soft and heavy.",
      theme: "rose"
    },
    {
      title: "The Cafe Giggles Storm",
      description: "A simple look across the table made us burst into silent, stomach-hurting giggles for a solid ten minutes. The people next to us were confused, but we were in our own happy world.",
      theme: "amber"
    }
  ]
};

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 1,
    title: "Once Upon a Time...",
    illustrativeIcon: "✨",
    narrativeText: "In a world spinning super fast, where days can blur and paths can cross, two souls clicked. It wasn't a giant fanfare; it was simple, quiet, and magical. That was the day our friendship began to blossom, turning ordinary days into bright, cozy updates.",
    promptQuestion: "Remember our very first conversation?"
  },
  {
    id: 2,
    title: "The Magic of Small Days",
    illustrativeIcon: "☕",
    narrativeText: "We soon discovered that friendship isn't about grand stages, but about the silly, beautiful micro-moments in-between. Sharing cups of cold coffee, taking long walks to nowhere, sending ugly selfies, and laughing at jokes only we understand.",
    promptQuestion: "What is your absolute favorite inside joke of ours?"
  },
  {
    id: 3,
    title: "Drying the Rainy Days",
    illustrativeIcon: "🌧️",
    narrativeText: "Not every day has been full of sunshine. When life got heavy, we held umbrellas for each other. You held my hand in the dark, sat with me in quiet tears, and gentle-reminded me of my own strength when I had completely forgotten it.",
    promptQuestion: "Thank you for always being my safe harbor."
  },
  {
    id: 4,
    title: "My Promise to You",
    illustrativeIcon: "🌸",
    narrativeText: "So here is my little vow, written in soft pastel lines: I promise to cheer you on in every chapter, to sit with you through quiet storms, and to always have a bucket of popcorn and caffeine ready for our next adventure. You are a treasure.",
    promptQuestion: "Through every twist and turn, I'm by your side."
  }
];
