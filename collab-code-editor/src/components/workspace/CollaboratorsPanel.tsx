import type { Collaborator, PresenceStatus } from "../../types/workspace";
import styles from "./CollaboratorsPanel.module.css";

interface CollaboratorsPanelProps {
  you: Collaborator;
  collaborators: Collaborator[];
}

const STATUS_LABEL: Record<PresenceStatus, string> = {
  online: "Online",
  idle: "Idle",
  offline: "Offline",
};

function CollaboratorRow({ person }: { person: Collaborator }) {
  return (
    <li className={styles.row}>
      <span
        className={styles.avatar}
        style={{ backgroundColor: person.color }}
        aria-hidden="true"
      >
        {person.initials}
        <span
          className={`${styles.presence} ${styles[`presence_${person.status}`]}`}
        />
      </span>
      <span className={styles.meta}>
        <span className={styles.name}>{person.name}</span>
        <span className={styles.status}>{STATUS_LABEL[person.status]}</span>
      </span>
    </li>
  );
}

function CollaboratorsPanel({ you, collaborators }: CollaboratorsPanelProps) {
  const total = collaborators.length + 1;

  return (
    <aside className={styles.panel} aria-label="Collaborators">
      <header className={styles.header}>
        <span className={styles.heading}>Collaborators</span>
        <span className={styles.count}>{total}</span>
      </header>

      <div className={styles.sectionLabel}>You</div>
      <ul className={styles.list}>
        <CollaboratorRow person={you} />
      </ul>

      <div className={styles.sectionLabel}>
        Mock collaborators
        <span className={styles.mockBadge} title="Demo only">
          demo
        </span>
      </div>

      {collaborators.length === 0 ? (
        <p className={styles.empty}>No mock collaborators for this room.</p>
      ) : (
        <ul className={styles.list}>
          {collaborators.map((person) => (
            <CollaboratorRow key={person.id} person={person} />
          ))}
        </ul>
      )}

      <p className={styles.disclaimer}>
        These participants are static mock data. Real-time collaboration is
        coming later.
      </p>
    </aside>
  );
}

export default CollaboratorsPanel;