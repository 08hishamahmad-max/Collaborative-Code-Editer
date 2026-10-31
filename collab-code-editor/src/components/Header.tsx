import styles from "./Header.module.css";

interface HeaderProps {
  onSignUpClick?: () => void;
  onSignInClick?: () => void;
}

function Header({ onSignUpClick, onSignInClick }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="/" className={styles.brand} aria-label="CollabCode home">
          <span className={styles.logoMark} aria-hidden="true">
            {"</>"}
          </span>
          <span className={styles.brandName}>CollabCode</span>
        </a>

        <nav className={styles.nav} aria-label="Primary">
          <button
            className={styles.navLink}
            onClick={onSignInClick}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}
          >
            Sign In
          </button>
          <button
            className={styles.navLink}
            onClick={onSignUpClick}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}
          >
            Sign Up
          </button>
          <a
            className={styles.navLink}
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
