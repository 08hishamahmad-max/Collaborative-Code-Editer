/**
 * Mock room-ID helpers. Format: 3 lowercase alphanumeric groups separated by
 * hyphens, e.g. "k3f-9ap-x72". Picked to look friendly and be easy to type.
 */

const ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789"; // no 0/1/l/o to avoid confusion
const GROUP_LEN = 3;
const GROUP_COUNT = 3;

export function generateRoomId(): string {
  const groups: string[] = [];
  for (let g = 0; g < GROUP_COUNT; g++) {
    let group = "";
    for (let i = 0; i < GROUP_LEN; i++) {
      group += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
    groups.push(group);
  }
  return groups.join("-");
}

/**
 * Permissive validator: trims, lower-cases, and accepts either our generated
 * format or any 6–24 char slug of letters/digits/hyphens. The Join modal uses
 * this for shape validation before checking existence against mock rooms.
 */
export function normalizeRoomId(input: string): string {
  return input.trim().toLowerCase();
}

export function isValidRoomIdShape(input: string): boolean {
  const value = normalizeRoomId(input);
  if (value.length < 6 || value.length > 24) return false;
  return /^[a-z0-9-]+$/.test(value);
}