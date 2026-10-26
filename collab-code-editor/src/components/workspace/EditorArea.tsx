import type { Language, WorkspaceFile } from "../../types/workspace";
import CodeViewer from "./CodeViewer";
import styles from "./EditorArea.module.css";

interface EditorAreaProps {
  tabs: WorkspaceFile[];
  activeFile: WorkspaceFile;
  activeLanguage: Language;
  onSelectTab: (fileId: string) => void;
  onCloseTab: (fileId: string) => void;
  onLanguageChange: (language: Language) => void;
}

const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
];

function EditorArea({
  tabs,
  activeFile,
  activeLanguage,
  onSelectTab,
  onCloseTab,
  onLanguageChange,
}: EditorAreaProps) {
  return (
    <section className={styles.editorArea} aria-label="Editor">
      <div className={styles.tabBar} role="tablist">
        <div className={styles.tabs}>
          {tabs.map((tab) => {
            const isActive = tab.id === activeFile.id;
            return (
              <div
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
                onClick={() => onSelectTab(tab.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectTab(tab.id);
                  }
                }}
                tabIndex={0}
              >
                <span className={styles.tabName}>{tab.name}</span>
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                  aria-label={`Close ${tab.name}`}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        <div className={styles.tabBarRight}>
          <label className={styles.languageLabel}>
            <span className={styles.srOnly}>Language</span>
            <select
              className={styles.languageSelect}
              value={activeLanguage}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className={styles.breadcrumb}>
        <span className={styles.breadcrumbItem}>demo-room</span>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbItem}>{activeFile.name}</span>
      </div>

      <div className={styles.viewer}>
        {tabs.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No files open.</p>
            <p className={styles.emptyHint}>
              Select a file from the sidebar to get started.
            </p>
          </div>
        ) : (
          <CodeViewer
            code={activeFile.content}
            language={activeLanguage}
          />
        )}
      </div>
    </section>
  );
}

export default EditorArea;