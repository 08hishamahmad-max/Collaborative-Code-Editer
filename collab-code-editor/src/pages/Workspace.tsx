import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import TopBar from "../components/workspace/TopBar";
import Sidebar from "../components/workspace/Sidebar";
import EditorArea, { type EditorAreaHandle } from "../components/workspace/EditorArea";
import BottomPanel from "../components/workspace/BottomPanel";
import CollaboratorsPanel from "../components/workspace/CollaboratorsPanel";
import Toast, { type ToastVariant } from "../components/Toast";
import SearchPanel from "../components/workspace/SearchPanel";
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
  const [files, setFiles] = useState<WorkspaceFile[]>(() => {
    const saved = localStorage.getItem(`collab-code-room-${room.id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((f: any) => ({ ...f }));
      } catch (e) {
        console.error("Failed to load saved files:", e);
      }
    }
    return [...mockFiles];
  });
  const [activeFileId, setActiveFileId] = useState<string>(files[0].id);
  const [openTabIds, setOpenTabIds] = useState<string[]>([files[0].id]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [panelOpen, setPanelOpen] = useState<boolean>(true);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [savedVersions, setSavedVersions] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem(`collab-code-saved-${room.id}`);
    return saved ? JSON.parse(saved) : {};
  });
  const editorRef = useRef<EditorAreaHandle>(null);

  const handleSelectSearchResult = useCallback(
    (fileId: string, lineNumber: number) => {
      setActiveFileId(fileId);
      setOpenTabIds((prev) => (prev.includes(fileId) ? prev : [...prev, fileId]));

      // Use a small timeout to ensure Monaco has rendered the file before attempting to reveal the line
      setTimeout(() => {
        editorRef.current?.revealLine(lineNumber);
      }, 100);

      setShowSearch(false);
    },
    [setActiveFileId, setOpenTabIds],
  );

  /* ---------- Toast ---------- */
  const showToast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      setToast({ message, variant, id: Date.now() });
    },
    [],
  );
  const dismissToast = useCallback(() => setToast(null), []);

  /* ---------- File Content Updates ---------- */
  const updateFileContent = useCallback((fileId: string, newContent: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, content: newContent } : f)),
    );
  }, []);

  const saveActiveFile = useCallback(() => {
    const activeFile = files.find((f) => f.id === activeFileId);
    if (!activeFile) return;

    const newSaved = {
      ...savedVersions,
      [activeFile.id]: activeFile.content,
    };
    setSavedVersions(newSaved);
    localStorage.setItem(`collab-code-saved-${room.id}`, JSON.stringify(newSaved));
    localStorage.setItem(`collab-code-room-${room.id}`, JSON.stringify(files));
    showToast(`Saved ${activeFile.name}`, "success");
  }, [activeFileId, files, savedVersions, room.id, showToast]);

  const formatActiveFile = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.formatDocument();
      showToast("Document formatted", "info");
    }
  }, []);

  const isUnsaved = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    return file && file.content !== savedVersions[fileId];
  };

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
        // Special case for Ctrl+S inside editor
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
          event.preventDefault();
          saveActiveFile();
          return;
        }
        return;
      }
      const mod = event.ctrlKey || event.metaKey;
      if (!mod) return;
      if (event.key === "f" && mod && event.shiftKey) {
        event.preventDefault();
        setShowSearch((v) => !v);
      } else if (event.key.toLowerCase() === "b") {
        event.preventDefault();
        toggleSidebar();
      } else if (event.key.toLowerCase() === "j") {
        event.preventDefault();
        togglePanel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar, togglePanel, saveActiveFile]);

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
          {showSearch ? (
            <SearchPanel
              files={files}
              onSelectResult={handleSelectSearchResult}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{
                display: 'flex',
                gap: '8px',
                padding: '4px 12px',
                background: 'var(--ws-panel)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center'
              }}>
                <button
                  onClick={formatActiveFile}
                  style={{
                    background: 'var(--color-surface)',
                    color: 'var(--color-text)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)'
                  }}
                >
                  Format Document
                </button>
              </div>
              <EditorArea
                ref={editorRef}
                tabs={openTabs}
                activeFile={activeFile}
                activeLanguage={activeLanguage}
                onSelectTab={setActiveFileId}
                onCloseTab={closeTab}
                onLanguageChange={handleLanguageChange}
                onContentChange={(newContent) => updateFileContent(activeFile.id, newContent)}
                onSave={saveActiveFile}
                unsavedFiles={Object.keys(savedVersions).filter(id => isUnsaved(id))}
              />
            </div>
          )}

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
