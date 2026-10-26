import { useCallback, useEffect, useMemo, useState } from "react";
import TopBar from "../components/workspace/TopBar";
import Sidebar from "../components/workspace/Sidebar";
import EditorArea from "../components/workspace/EditorArea";
import BottomPanel from "../components/workspace/BottomPanel";
import CollaboratorsPanel from "../components/workspace/CollaboratorsPanel";
import Toast, { type ToastVariant } from "../components/Toast";
import { mockFiles } from "../data/mockFiles";
import { getCollaboratorsFor, youCollaborator } from "../data/mockRooms";
import type { Language, Room, WorkspaceFile } from "../types/workspace";
import styles from "./Workspace.module.css";

interface WorkspaceProps {
  room: Room;
  onLeave: () => void;
}

interface ToastState {
  message: string;
  variant: ToastVariant;
  id: number;
}

function Workspace({ room, onLeave }: WorkspaceProps) {
  const files: WorkspaceFile[] = mockFiles;

  const [activeFileId, setActiveFileId] = useState<string>(files[0].id);
  const [openTabIds, setOpenTabIds] = useState<string[]>([files[0].id]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [panelOpen, setPanelOpen] = useState<boolean>(true);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Language overrides per file. Seed the first file with the room's language
  // so switching rooms visibly affects the editor.
  const [languageOverrides, setLanguageOverrides] = useState<
    Record<string, Language>
  >(() => ({ [files[0].id]: room.language }));

  const activeFile = useMemo(
    () => files.find((f) => f.id === activeFileId) ?? files[0],
    [files, activeFileId],
  );

  const activeLanguage: Language =
    languageOverrides[activeFile.id] ?? activeFile.language;

  const collaborators = useMemo(() => getCollaboratorsFor(room.id), [room.id]);

  /* ---------- Toast ---------- */
  const showToast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      setToast({ message, variant, id: Date.now() });
    },
    [],
  );
  const dismissToast = useCallback(() => setToast(null), []);

  /* ---------- Announce room on mount / change ---------- */
  useEffect(() => {
    showToast(`Entered room "${room.name}"`, "success");
  }, [room.id, room.name, showToast]);

  /* ---------- File / tab actions ---------- */
  const openFile = useCallback((fileId: string) => {
    setActiveFileId(fileId);
    setOpenTabIds((prev) =>
      prev.includes(fileId) ? prev : [...prev, fileId],
    );
  }, []);

  const closeTab = useCallback(
    (fileId: string) => {
      setOpenTabIds((prev) => {
        const idx = prev.indexOf(fileId);
        if (idx === -1) return prev;
        const next = prev.filter((id) => id !== fileId);
        if (fileId === activeFileId && next.length > 0) {
          const neighbor = next[idx] ?? next[idx - 1] ?? next[0];
          setActiveFileId(neighbor);
        }
        return next;
      });
    },
    [activeFileId],
  );

  const handleLanguageChange = useCallback(
    (language: Language) => {
      setLanguageOverrides((prev) => ({ ...prev, [activeFile.id]: language }));
    },
    [activeFile.id],
  );

  const handleShare = useCallback(() => {
    showToast(
      `Sharing will be available in a future version. Room ID: ${room.id}`,
      "info",
    );
  }, [room.id, showToast]);

  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const togglePanel = useCallback(() => setPanelOpen((v) => !v), []);

  /* ---------- Keyboard shortcuts ---------- */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      const mod = event.ctrlKey || event.metaKey;
      if (!mod) return;
      if (event.key.toLowerCase() === "b") {
        event.preventDefault();
        toggleSidebar();
      } else if (event.key.toLowerCase() === "j") {
        event.preventDefault();
        togglePanel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar, togglePanel]);

  const openTabs = openTabIds
    .map((id) => files.find((f) => f.id === id))
    .filter((f): f is WorkspaceFile => Boolean(f));

  return (
    <div className={styles.workspace}>
      <TopBar
        roomName={room.name}
        roomId={room.id}
        onLeave={onLeave}
        onShare={handleShare}
      />

      <div className={styles.body}>
        <Sidebar
          files={files}
          activeFileId={activeFile.id}
          onSelectFile={openFile}
          collapsed={!sidebarOpen}
          onToggle={toggleSidebar}
        />

        <div className={styles.main}>
          <EditorArea
            tabs={openTabs}
            activeFile={activeFile}
            activeLanguage={activeLanguage}
            onSelectTab={setActiveFileId}
            onCloseTab={closeTab}
            onLanguageChange={handleLanguageChange}
          />

          <BottomPanel open={panelOpen} onToggle={togglePanel} />
        </div>

        <CollaboratorsPanel you={youCollaborator} collaborators={collaborators} />
      </div>

      <div className={styles.statusBar} role="status" aria-live="polite">
        <span>{activeFile.name}</span>
        <span className={styles.statusSpacer} />
        <span>Room: {room.id}</span>
        <span>{activeLanguage.toUpperCase()}</span>
        <span>UTF-8</span>
        <span>Ln 1, Col 1</span>
      </div>

      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          variant={toast.variant}
          onDismiss={dismissToast}
        />
      )}
    </div>
  );
}

export default Workspace;