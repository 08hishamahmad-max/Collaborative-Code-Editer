import type { ReactNode } from "react";
import styles from "./AuthCard.module.css";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className={styles.wrapper}>
      {/* Outer soft glow */}
      <div className={styles.glow} aria-hidden="true" />

      <section className={styles.card} aria-labelledby="auth-card-title">
        <header className={styles.header}>
          <h1 id="auth-card-title" className={styles.title}>
            {title}
          </h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </header>

        <div className={styles.body}>{children}</div>

        {footer && <div className={styles.footer}>{footer}</div>}
      </section>
    </div>
  );
}

export default AuthCard;
