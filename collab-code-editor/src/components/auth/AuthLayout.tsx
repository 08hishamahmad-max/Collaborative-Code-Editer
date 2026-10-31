import type { ReactNode } from "react";
import styles from "./AuthLayout.module.css";

interface AuthLayoutProps {
  children: ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.layout}>
      {/* Decorative background layers */}
      <div className={styles.gridOverlay} aria-hidden="true" />
      <div className={styles.glowOne} aria-hidden="true" />
      <div className={styles.glowTwo} aria-hidden="true" />

      {/* Decorative code snippet in the lower-left corner (desktop only) */}
      <pre className={styles.codeDecor} aria-hidden="true">
        <code>
          <span className={styles.codeDim}>{`// collab-session.ts`}</span>
          {"\n"}
          <span className={styles.codeKeyword}>const</span>{" "}
          <span className={styles.codeVar}>session</span> ={" "}
          <span className={styles.codeKeyword}>await</span>{" "}
          <span className={styles.codeFn}>connect</span>({"{"}
          {"\n  "}
          <span className={styles.codeVar}>room</span>:{" "}
          <span className={styles.codeStr}>"team-alpha"</span>,
          {"\n  "}
          <span className={styles.codeVar}>user</span>:{" "}
          <span className={styles.codeVar}>currentUser</span>,
          {"\n"}
          {"});"}
        </code>
      </pre>

      {/* Brand header */}
      <header className={styles.header}>
        <a href="/" className={styles.brand} aria-label="CollabCode home">
          <span className={styles.logoMark} aria-hidden="true">
            {"</>"}
          </span>
          <span className={styles.brandName}>CollabCode</span>
        </a>
      </header>

      {/* Centered content slot */}
      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} CollabCode</span>
        <span className={styles.footerDot} aria-hidden="true">
          •
        </span>
        <a href="#" className={styles.footerLink}>
          Privacy
        </a>
        <span className={styles.footerDot} aria-hidden="true">
          •
        </span>
        <a href="#" className={styles.footerLink}>
          Terms
        </a>
      </footer>
    </div>
  );
}

export default AuthLayout;
