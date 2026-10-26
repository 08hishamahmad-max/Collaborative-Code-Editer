import Button from "./Button";
import CodePreview from "./CodePreview";
import styles from "./Hero.module.css";

interface HeroProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

function Hero({ onCreateRoom, onJoinRoom }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>
            <span className={styles.pulse} aria-hidden="true" />
            Real-time collaboration, zero setup
          </span>

          <h1 className={styles.title}>
            Code together,{" "}
            <span className={styles.titleAccent}>in real time.</span>
          </h1>

          <p className={styles.tagline}>
            CollabCode is a browser-based collaborative code editor. Spin up a
            room, share the link, and start pair-programming instantly — no
            installs, no accounts.
          </p>

          <div className={styles.actions}>
            <Button variant="primary" onClick={onCreateRoom}>
              Create Room
            </Button>
            <Button variant="secondary" onClick={onJoinRoom}>
              Join Room
            </Button>
          </div>
        </div>

        <div className={styles.preview}>
          <CodePreview />
        </div>
      </div>
    </section>
  );
}

export default Hero;