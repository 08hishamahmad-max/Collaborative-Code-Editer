export type Language = "javascript" | "html" | "css" | "typescript" | "json";

export interface WorkspaceFile {
  id: string;
  name: string;
  language: Language;
  content: string;
}

export type ConnectionStatus = "connected" | "connecting" | "offline";