import { useEffect } from "react";
import styles from "./Toast.module.css";

export type ToastVariant = "info" | "success" | "warning";

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  /** Auto-dismiss delay in ms. Set to 0 to disable auto-dismiss. */
  duration?: number;
  onDismiss: () => void;
}

function Toast({
  message,
  variant = "info",
  duration = 3500,
  onDismiss,
}: ToastProps) {
  useEffect(() => {
    if (duration <= 0) return;
    const timer = window.setTimeout(onDismiss, duration);
    return () => window.clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div
      className={`${styles.toast} ${styles[variant]}`}
      role="status"
      aria-live="polite"
    >
      <span className={styles.icon} aria-hidden="true">
        {variant === "success" ? "✓" : variant === "warning" ? "!" : "i"}
      </span>
      <span className={styles.message}>{message}</span>
      <button
        type="button"
        className={styles.closeButton}
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;