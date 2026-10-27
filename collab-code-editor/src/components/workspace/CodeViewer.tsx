import Editor from "@monaco-editor/react";
import type { Language } from "../../types/workspace";
import styles from "./CodeViewer.module.css";

interface CodeViewerProps {
  /** The current text content of the active file. */
  value: string;
  /** Monaco language identifier (matches our Language type directly). */
  language: Language;
  /** Called every time the user edits the code. */
  onChange: (value: string) => void;
}

/**
 * A thin wrapper around the Monaco Editor.
 */
function CodeViewer({ value, language, onChange }: CodeViewerProps) {
  const handleEditorChange = (newValue: string | undefined) => {
    onChange(newValue ?? "");
  };

  return (
    <div className={styles.container}>
      <Editor
        height="100%"
        theme="vs-dark"
        language={language}
        value={value}
        onChange={handleEditorChange}
        loading={
          <div className={styles.loading}>
            <span className={styles.spinner} />
            Loading editor…
          </div>
        }
        options={{
          lineNumbers: "on",
          minimap: { enabled: true },
          fontSize: 14,
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
          fontLigatures: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          wordWrap: "on",
          padding: { top: 16, bottom: 16 },
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          renderValidationDecorations: "on",
          bracketPairColorization: { enabled: true },
          renderLineHighlight: "line",
          smoothScrolling: true,
        }}
      />
    </div>
  );
}

export default CodeViewer;
