import styles from "./Footer.module.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>
          © {year} CollabCode — a learning project.
        </p>
        <p className={styles.builtWith}>
          Built with React, TypeScript &amp; Vite.
        </p>
      </div>
    </footer>
  );
}

export default Footer;