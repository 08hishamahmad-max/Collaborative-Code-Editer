import { useCallback, useMemo, useState } from "react";
import TopBar from "../components/workspace/TopBar";
import Sidebar from "../components/workspace/Sidebar";
import EditorArea from "../components/workspace/EditorArea";
import BottomPanel from "../components/workspace/BottomPanel";
import { mockFiles } from "../data/mockFiles";
import type { Language, WorkspaceFile } from "../types/workspace";
import styles from "./Workspace.module.css";

interface WorkspaceProps {
  onLeave: () => void;
}

function Workspace({ onLeave }: WorkspaceProps) {
  const files: WorkspaceFile[] = mockFiles;

  const [activeFileId, setActiveFileId] = useState<string>(files[0].id);
  const [openTabIds, setOpenTabIds] = useState<string[]>([files[0].id]);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [panelOpen, setPanelOpen] = useState<boolean>(true);

  // Per-file language overrides (default to file's own language)
  const [languageOverrides, setLanguageOverrides] = useState<
    Record<string, Language>
  >({});

  const activeFile = useMemo(
    () => files.find((f) => f.id === activeFileId) ?? files[0],
    [files, activeFileId],
  );

  const activeLanguage: Language =
    languageOverrides[activeFile.id] ?? activeFile.language;

  const openFile = useCallback((fileId: string) => {
    setActiveFileId(fileId);
    setOpenTabIds((prev) =>
      prev.includes(fileId) ? prev : [...prev, fileId],
    );
  }, []);

  const closeTab = useCallback(
    (fileId: string) => {
      setOpenTabIds((prev) => {
        const next = prev.filter((id) => id !== fileId);
        // If we closed the active tab, activate a neighbor
        if (fileId === activeFileId) {
          const idx = prev.indexOf(fileId);
          const fallback = next[idx] ?? next[idx - 1] ?? next[0];
          if (fallback) setActiveFileId(fallback);
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

  const openTabs = openTabIds
    .map((id) => files.find((f) => f.id === id))
    .filter((f): f is WorkspaceFile => Boolean(f));

  return (
    <div className={styles.workspace}>
      <TopBar roomName="demo-room" onLeave={onLeave} />

      <div className={styles.body}>
        <Sidebar
          files={files}
          activeFileId={activeFile.id}
          onSelectFile={openFile}
          collapsed={!sidebarOpen}
          onToggle={() => setSidebarOpen((v) => !v)}
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

          <BottomPanel
            open={panelOpen}
            onToggle={() => setPanelOpen((v) => !v)}
          />
        </div>
      </div>

      <div className={styles.statusBar} role="status" aria-live="polite">
        <span>{activeFile.name}</span>
        <span className={styles.statusSpacer} />
        <span>{activeLanguage.toUpperCase()}</span>
        <span>UTF-8</span>
        <span>Ln 1, Col 1</span>
      </div>
    </div>
  );
}

export default Workspace;