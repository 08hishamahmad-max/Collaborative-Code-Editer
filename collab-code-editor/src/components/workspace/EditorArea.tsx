import Editor from "@monaco-editor/react";
import { useRef, useImperativeHandle, forwardRef } from "react";
import type { Language, WorkspaceFile } from "../../types/workspace";
import styles from "./EditorArea.module.css";

export interface EditorAreaHandle {
  revealLine: (lineNumber: number) => void;
  formatDocument: () => void;
}

interface EditorAreaProps {
  tabs: WorkspaceFile[];
  activeFile: WorkspaceFile;
  activeLanguage: Language;
  onSelectTab: (fileId: string) => void;
  onCloseTab: (fileId: string) => void;
  onLanguageChange: (language: Language) => void;
  onContentChange: (content: string) => void;
  onSave: () => void;
  unsavedFiles: string[];
}

const EditorArea = forwardRef<EditorAreaHandle, EditorAreaProps>(({
  tabs,
  activeFile,
  activeLanguage,
  onSelectTab,
  onCloseTab,
  onLanguageChange,
  onContentChange,
  onSave,
  unsavedFiles,
}, ref) => {
  const monacoRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    revealLine: (lineNumber: number) => {
      if (monacoRef.current) {
        const editor = monacoRef.current;
        editor.revealLineInCenter(lineNumber);
        editor.setSelection({
          startLineNumber: lineNumber,
          startColumn: 1,
          endLineNumber: lineNumber,
          endColumn: 1,
        });
      }
    },
    formatDocument: () => {
      if (monacoRef.current) {
        monacoRef.current.trigger("editor.action.formatDocument");
      }
    },
  }));

  function handleEditorDidMount(editor: any, _model: any) {
    monacoRef.current = editor;
  }

  return (
    <section className={styles.editorArea} aria-label="Editor">
      <div className={styles.tabBar} role="tablist">
        <div className={styles.tabs}>
          {tabs.map((tab) => {
            const isActive = tab.id === activeFile.id;
            const hasUnsavedChanges = unsavedFiles.includes(tab.id);
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
                {hasUnsavedChanges && <span className={styles.unsavedDot} aria-hidden="true" />}
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
          <button
            type="button"
            className={styles.saveButton}
            onClick={onSave}
          >
            Save
          </button>
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
          <Editor
            height="100%"
            language={activeLanguage}
            value={activeFile.content}
            onChange={(value: string | undefined) => onContentChange(value || "")}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 10, bottom: 10 },
              automaticLayout: true,
            }}
          />
        )}
      </div>
    </section>
  );
});

const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
];

export default EditorArea;
