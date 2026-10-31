import styles from "./Divider.module.css";

interface DividerProps {
  label?: string;
}

function Divider({ label }: DividerProps) {
  if (!label) {
    return <div className={styles.plain} role="separator" />;
  }
  return (
    <div className={styles.wrapper} role="separator" aria-label={label}>
      <span className={styles.line} />
      <span className={styles.label}>{label}</span>
      <span className={styles.line} />
    </div>
  );
}

export default Divider;
