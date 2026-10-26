import type { Collaborator, Language, Room } from "../types/workspace";

/**
 * A small, static set of rooms the Join modal recognises. Anything not in
 * this list is treated as "not found" so the user sees an error state.
 * This is 100% mock — no network, no persistence.
 */
export const knownMockRooms: Room[] = [
  { id: "demo-room", name: "Demo Room", language: "javascript" },
  { id: "abc-123-xyz", name: "Pair Practice", language: "typescript" },
  { id: "web-ui-lab", name: "Web UI Lab", language: "html" },
];

/**
 * Mock collaborators per known room. If a room isn't in this map we fall back
 * to `defaultMockCollaborators` so freshly created rooms still look alive.
 */
export const mockCollaboratorsByRoom: Record<string, Collaborator[]> = {
  "demo-room": [
    {
      id: "u-ada",
      name: "Ada Lovelace",
      initials: "AL",
      color: "#6366f1",
      status: "online",
      isMock: true,
    },
    {
      id: "u-linus",
      name: "Linus T.",
      initials: "LT",
      color: "#22d3ee",
      status: "idle",
      isMock: true,
    },
  ],
  "abc-123-xyz": [
    {
      id: "u-grace",
      name: "Grace Hopper",
      initials: "GH",
      color: "#f472b6",
      status: "online",
      isMock: true,
    },
    {
      id: "u-dennis",
      name: "Dennis R.",
      initials: "DR",
      color: "#fbbf24",
      status: "offline",
      isMock: true,
    },
  ],
};

export const defaultMockCollaborators: Collaborator[] = [
  {
    id: "u-sam",
    name: "Sam Chen",
    initials: "SC",
    color: "#22c55e",
    status: "online",
    isMock: true,
  },
  {
    id: "u-mika",
    name: "Mika P.",
    initials: "MP",
    color: "#a78bfa",
    status: "idle",
    isMock: true,
  },
];

/** The local "you" entry. Rendered separately from mock participants. */
export const youCollaborator: Collaborator = {
  id: "u-you",
  name: "You",
  initials: "CC",
  color: "#818cf8",
  status: "online",
  isMock: false,
};

export function findRoomById(roomId: string): Room | undefined {
  return knownMockRooms.find((r) => r.id === roomId);
}

export function getCollaboratorsFor(roomId: string): Collaborator[] {
  return mockCollaboratorsByRoom[roomId] ?? defaultMockCollaborators;
}

export const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
];