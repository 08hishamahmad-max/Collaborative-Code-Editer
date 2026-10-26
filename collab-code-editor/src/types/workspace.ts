export type Language = "javascript" | "html" | "css" | "typescript" | "json";

export interface WorkspaceFile {
  id: string;
  name: string;
  language: Language;
  content: string;
}

export type ConnectionStatus = "connected" | "connecting" | "offline";

/* ---------- Room & collaboration ---------- */

export interface Room {
  id: string;
  name: string;
  language: Language;
}

export type PresenceStatus = "online" | "idle" | "offline";

export interface Collaborator {
  id: string;
  name: string;
  /** Short label (1–2 letters) for the avatar circle. */
  initials: string;
  /** Hex color for the avatar background. */
  color: string;
  status: PresenceStatus;
  /** Marks baked-in demo participants vs. "you". */
  isMock: boolean;
}