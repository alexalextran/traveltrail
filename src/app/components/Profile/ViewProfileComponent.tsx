import React from 'react';
import styles from '../../Sass/ViewProfileComponent.module.scss';

interface ProfileData {
  friendID: string;
  displayName: string;
}

interface ModalProps {
  profileData: ProfileData;
}

export default function ProfileModal({ profileData }: ModalProps) {
    return (
      <div className={styles.profileModalContainer}>
        <div className={styles.profileModal}>
          <button className={styles.closeButton} >&times;</button>
          <div className={styles.profileContent}>
            <h2>{profileData.displayName}</h2>
            <p><strong>Friend ID:</strong> {profileData.friendID}</p>
          </div>
          <div className={styles.modalActions}>
            <button className={styles.actionButton}>Send Message</button>
            <button className={`${styles.actionButton} ${styles.danger}`}>Remove Friend</button>
          </div>
        </div>
      </div>
    );
  }
  