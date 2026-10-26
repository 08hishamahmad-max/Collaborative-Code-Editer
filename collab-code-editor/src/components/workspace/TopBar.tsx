import { useState } from "react";
import type { ConnectionStatus } from "../../types/workspace";
import styles from "./TopBar.module.css";

interface TopBarProps {
  roomName: string;
  onLeave: () => void;
}

function TopBar({ roomName, onLeave }: TopBarProps) {
  const [status] = useState<ConnectionStatus>("connected");

  const handleShare = () => {
    // Mock: in a future task this will copy the real room URL.
    // eslint-disable-next-line no-alert
    alert("Share link copied (mock)");
  };

  const statusLabel: Record<ConnectionStatus, string> = {
    connected: "Connected",
    connecting: "Connecting…",
    offline: "Offline",
  };

  return (
    <header className={styles.topBar}>
      <div className={styles.left}>
        <button
          type="button"
          className={styles.brand}
          onClick={onLeave}
          aria-label="Back to landing page"
        >
          <span className={styles.logoMark} aria-hidden="true">
            {"</>"}
          </span>
          <span className={styles.brandName}>CollabCode</span>
        </button>

        <span className={styles.divider} aria-hidden="true" />

        <span className={styles.room}>
          <span className={styles.roomLabel}>Room</span>
          <span className={styles.roomName}>{roomName}</span>
        </span>
      </div>

      <div className={styles.right}>
        <span
          className={`${styles.status} ${styles[`status_${status}`]}`}
          title={statusLabel[status]}
        >
          <span className={styles.statusDot} aria-hidden="true" />
          {statusLabel[status]}
        </span>

        <button
          type="button"
          className={styles.shareButton}
          onClick={handleShare}
        >
          Share
        </button>

        <div
          className={styles.avatar}
          title="You"
          aria-label="Current user"
        >
          CC
        </div>
      </div>
    </header>
  );
}

export default TopBar;