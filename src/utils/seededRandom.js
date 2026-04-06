// Simple seeded PRNG (mulberry32)
// Given the same seed, always produces the same sequence of numbers
export function createSeededRandom(seed) {
  let h = seed;
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

// Convert a date string like "2026-04-06" to a numeric seed
export function dateToSeed(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

// Shuffle an array in place using the seeded random function
export function seededShuffle(array, random) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Get today's date as YYYY-MM-DD string
export function getTodayString() {
  const now = new Date();
  return now.toISOString().split("T")[0];
}
