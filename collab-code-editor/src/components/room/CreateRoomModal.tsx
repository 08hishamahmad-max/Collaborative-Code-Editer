import { useState, useCallback } from "react";
import Modal from "../Modal";
import Button from "../Button";
import { LANGUAGE_OPTIONS } from "../../data/mockRooms";
import { generateRoomId } from "../../utils/roomId";
import type { Language, Room } from "../../types/workspace";
import styles from "./CreateRoomModal.module.css";

interface CreateRoomModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (room: Room) => void;
}

interface Errors {
  name?: string;
}

function CreateRoomModal({ open, onClose, onCreate }: CreateRoomModalProps) {
  const [name, setName] = useState("");
  const [language, setLanguage] = useState<Language>("javascript");
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): Errors => {
    const next: Errors = {};
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      next.name = "Room name is required.";
    } else if (trimmed.length < 2) {
      next.name = "Room name must be at least 2 characters.";
    } else if (trimmed.length > 40) {
      next.name = "Room name must be 40 characters or fewer.";
    }
    return next;
  };

  const resetAndClose = useCallback(() => {
    setName("");
    setLanguage("javascript");
    setErrors({});
    setSubmitted(false);
    onClose();
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const room: Room = {
      id: generateRoomId(),
      name: name.trim(),
      language,
    };
    onCreate(room);
    resetAndClose();
  };

  // Live-validate once the user has attempted a submit.
  const handleNameChange = (value: string) => {
    setName(value);
    if (submitted) setErrors(validate());
  };

  return (
    <Modal
      open={open}
      title="Create a room"
      description="Rooms are stored only in this browser session for now."
      onClose={resetAndClose}
      footer={
        <>
          <Button variant="secondary" onClick={resetAndClose} type="button">
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            form="create-room-form"
          >
            Create room
          </Button>
        </>
      }
    >
      <form
        id="create-room-form"
        className={styles.form}
        onSubmit={handleSubmit}
        noValidate
      >
        <label className={styles.field}>
          <span className={styles.label}>Room name</span>
          <input
            type="text"
            className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Monday pairing"
            maxLength={60}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "create-room-name-error" : undefined}
            autoComplete="off"
          />
          {errors.name && (
            <span
              id="create-room-name-error"
              className={styles.errorText}
              role="alert"
            >
              {errors.name}
            </span>
          )}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Primary language</span>
          <select
            className={styles.input}
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className={styles.hint}>
            Used as the default language in the editor.
          </span>
        </label>
      </form>
    </Modal>
  );
}

export default CreateRoomModal;