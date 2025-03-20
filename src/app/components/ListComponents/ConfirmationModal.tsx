import React from 'react';
import styles from '../../Sass/ListDnd.module.scss';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  placeName: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, placeName }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Add Duplicate Place?</h2>
        </div>
        <div className={styles.content}>
          <p>
            <span className={styles.placeName}>&quot;{placeName}&quot;</span> already exists in this list as a similar pin. Are you sure you want to add it?
          </p>
        </div>
        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.confirmButton} onClick={onConfirm}>
            Add Anyway
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;