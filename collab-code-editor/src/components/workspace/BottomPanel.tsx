import { useState } from "react";
import { mockTerminalLines } from "../../data/mockFiles";
import styles from "./BottomPanel.module.css";

type Tab = "terminal" | "output" | "problems";

interface BottomPanelProps {
  open: boolean;
  onToggle: () => void;
}

function BottomPanel({ open, onToggle }: BottomPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("terminal");

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "terminal", label: "Terminal" },
    { id: "output", label: "Output" },
    { id: "problems", label: "Problems", badge: 0 },
  ];

  return (
    <section
      className={`${styles.panel} ${open ? styles.open : styles.closed}`}
      aria-label="Terminal panel"
    >
      <div className={styles.header}>
        <div className={styles.tabs} role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={activeTab === tab.id}
              className={`${styles.tab} ${
                activeTab === tab.id ? styles.tabActive : ""
              }`}
              onClick={() => {
                setActiveTab(tab.id);
                if (!open) onToggle();
              }}
            >
              {tab.label}
              {typeof tab.badge === "number" && (
                <span className={styles.badge}>{tab.badge}</span>
              )}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={styles.toggleButton}
          onClick={onToggle}
          aria-expanded={open}
          aria-label={open ? "Collapse panel" : "Expand panel"}
        >
          {open ? "▾" : "▴"}
        </button>
      </div>

      {open && (
        <div className={styles.body}>
          {activeTab === "terminal" && (
            <pre className={styles.terminal}>
              {mockTerminalLines.join("\n")}
              {"\n"}
              <span className={styles.prompt}>$ </span>
              <span className={styles.cursor} aria-hidden="true" />
            </pre>
          )}

          {activeTab === "output" && (
            <div className={styles.empty}>No output yet.</div>
          )}

          {activeTab === "problems" && (
            <div className={styles.empty}>No problems detected.</div>
          )}
        </div>
      )}
    </section>
  );
}

export default BottomPanel;