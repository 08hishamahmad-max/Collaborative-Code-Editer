import { useState, useCallback } from "react";
import Modal from "../Modal";
import Button from "../Button";
import { findRoomById, knownMockRooms } from "../../data/mockRooms";
import { isValidRoomIdShape, normalizeRoomId } from "../../utils/roomId";
import type { Room } from "../../types/workspace";
import styles from "./JoinRoomModal.module.css";

interface JoinRoomModalProps {
  open: boolean;
  onClose: () => void;
  onJoin: (room: Room) => void;
}

type FormError =
  | { kind: "shape"; message: string }
  | { kind: "notFound"; message: string }
  | null;

function JoinRoomModal({ open, onClose, onJoin }: JoinRoomModalProps) {
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState<FormError>(null);
  const [submitted, setSubmitted] = useState(false);

  const resetAndClose = useCallback(() => {
    setRoomId("");
    setError(null);
    setSubmitted(false);
    onClose();
  }, [onClose]);

  const validateAndFind = (value: string): { room?: Room; error: FormError } => {
    const trimmed = normalizeRoomId(value);
    if (trimmed.length === 0) {
      return { error: { kind: "shape", message: "Room ID is required." } };
    }
    if (!isValidRoomIdShape(trimmed)) {
      return {
        error: {
          kind: "shape",
          message:
            "Room ID can only contain letters, numbers, and hyphens (6–24 chars).",
        },
      };
    }
    const room = findRoomById(trimmed);
    if (!room) {
      return {
        error: {
          kind: "notFound",
          message: "No room found with that ID. Try one of the examples below.",
        },
      };
    }
    return { room, error: null };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const { room, error: nextError } = validateAndFind(roomId);
    setError(nextError);
    if (room) {
      onJoin(room);
      resetAndClose();
    }
  };

  const handleChange = (value: string) => {
    setRoomId(value);
    if (submitted) {
      const { error: nextError } = validateAndFind(value);
      setError(nextError);
    }
  };

  const handleExampleClick = (id: string) => {
    setRoomId(id);
    setError(null);
    setSubmitted(false);
  };

  return (
    <Modal
      open={open}
      title="Join a room"
      description="Enter a room ID to join. Mock rooms are listed below."
      onClose={resetAndClose}
      footer={
        <>
          <Button variant="secondary" onClick={resetAndClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="join-room-form">
            Join room
          </Button>
        </>
      }
    >
      <form
        id="join-room-form"
        className={styles.form}
        onSubmit={handleSubmit}
        noValidate
      >
        <label className={styles.field}>
          <span className={styles.label}>Room ID</span>
          <input
            type="text"
            className={`${styles.input} ${error ? styles.inputError : ""}`}
            value={roomId}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="e.g. demo-room"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "join-room-error" : undefined}
          />
          {error && (
            <span id="join-room-error" className={styles.errorText} role="alert">
              {error.message}
            </span>
          )}
        </label>

        <div className={styles.examples}>
          <span className={styles.examplesLabel}>Known mock rooms:</span>
          <ul className={styles.examplesList}>
            {knownMockRooms.map((room) => (
              <li key={room.id}>
                <button
                  type="button"
                  className={styles.exampleChip}
                  onClick={() => handleExampleClick(room.id)}
                >
                  <span className={styles.exampleId}>{room.id}</span>
                  <span className={styles.exampleName}>{room.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </form>
    </Modal>
  );
}

export default JoinRoomModal;