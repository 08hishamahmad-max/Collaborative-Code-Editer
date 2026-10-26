import type { WorkspaceFile } from "../../types/workspace";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  files: WorkspaceFile[];
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

// Map file extensions to a tiny label used as a mock icon.
function fileIcon(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  switch (ext) {
    case "js":
      return "JS";
    case "ts":
      return "TS";
    case "html":
      return "<>";
    case "css":
      return "#";
    case "json":
      return "{}";
    default:
      return "•";
  }
}

function Sidebar({
  files,
  activeFileId,
  onSelectFile,
  collapsed,
  onToggle,
}: SidebarProps) {
  return (
    <aside
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}
      aria-label="File explorer"
    >
      <div className={styles.header}>
        {!collapsed && <span className={styles.heading}>Explorer</span>}
        <button
          type="button"
          className={styles.toggle}
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      {!collapsed && (
        <>
          <div className={styles.sectionLabel}>DEMO-ROOM</div>
          <ul className={styles.fileList}>
            {files.map((file) => {
              const isActive = file.id === activeFileId;
              return (
                <li key={file.id}>
                  <button
                    type="button"
                    className={`${styles.fileItem} ${
                      isActive ? styles.active : ""
                    }`}
                    onClick={() => onSelectFile(file.id)}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span className={styles.icon} aria-hidden="true">
                      {fileIcon(file.name)}
                    </span>
                    <span className={styles.fileName}>{file.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </aside>
  );
}

export default Sidebar;