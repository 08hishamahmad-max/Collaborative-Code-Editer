import { useState, useMemo } from "react";
import styles from "./SearchPanel.module.css";
import type { WorkspaceFile } from "../../types/workspace";

interface SearchResult {
  fileId: string;
  fileName: string;
  lineNumber: number;
  text: string;
}

interface SearchPanelProps {
  files: WorkspaceFile[];
  onSelectResult: (fileId: string, lineNumber: number) => void;
}

export default function SearchPanel({ files, onSelectResult }: SearchPanelProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const matches: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    for (const file of files) {
      const lines = file.content.split("\n");
      lines.forEach((line, index) => {
        if (line.toLowerCase().includes(lowerQuery)) {
          matches.push({
            fileId: file.id,
            fileName: file.name,
            lineNumber: index + 1,
            text: line,
          });
        }
      });
    }
    return matches;
  }, [query, files]);

  return (
    <div className={styles.panel}>
      <div className={styles.searchBox}>
        <input
          type="text"
          className={styles.input}
          placeholder="Search across files..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>
      <div className={styles.results}>
        {query.trim() ? (
          results.length > 0 ? (
            <ul className={styles.list}>
              {results.map((res, i) => (
                <li
                  key={i}
                  className={styles.item}
                  onClick={() => onSelectResult(res.fileId, res.lineNumber)}
                >
                  <div className={styles.fileHeader}>
                    <span className={styles.fileName}>{res.fileName}</span>
                    <span className={styles.lineNum}>ln {res.lineNumber}</span>
                  </div>
                  <div className={styles.snippet}>{res.text}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.empty}>No matches found for "{query}"</div>
          )
        ) : (
          <div className={styles.empty}>Enter a query to search the project</div>
        )}
      </div>
    </div>
  );
}
