import styles from "./Features.module.css";

interface Feature {
  title: string;
  description: string;
  icon: string;
}

const features: Feature[] = [
  {
    icon: "⚡",
    title: "Instant rooms",
    description:
      "Create a session with one click and share the link. No signup required.",
  },
  {
    icon: "👥",
    title: "True multiplayer",
    description:
      "See teammates' cursors and edits live, powered by conflict-free sync.",
  },
  {
    icon: "🧠",
    title: "Powered by Monaco",
    description:
      "The same editor that runs VS Code — right in your browser tab.",
  },
];

function Features() {
  return (
    <section className={styles.features} aria-labelledby="features-heading">
      <div className={styles.inner}>
        <h2 id="features-heading" className={styles.heading}>
          Built for pair-programming
        </h2>
        <p className={styles.subheading}>
          Everything you need to code with someone else, nothing you don't.
        </p>

        <ul className={styles.grid}>
          {features.map((feature) => (
            <li key={feature.title} className={styles.card}>
              <div className={styles.icon} aria-hidden="true">
                {feature.icon}
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Features;