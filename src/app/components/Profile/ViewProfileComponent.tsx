import React, { useEffect, useState } from 'react';
import styles from '../../Sass/ViewProfileComponent.module.scss';
import {getLists} from '../../firebaseFunctions/Lists';
interface ProfileData {
  friendID: string;
  displayName: string;
}

interface ModalProps {
  profileData: ProfileData;
  setViewProfile: (value: boolean) => void;
}




export default function ProfileModal({ profileData, setViewProfile}: ModalProps) {
const [lists, setlists] = useState([])
  useEffect(() => {
  

    async function fetchLists() {
      try {
        const lists = await getLists(profileData.friendID);
        console.log(lists)
        setlists(lists);
      } catch (error) {
        console.error(error);
      }
    }
  
    fetchLists();
  }, [profileData.friendID])

    return (
      <div className={styles.profileModalContainer}>
        <div className={styles.profileModal}>
          <button className={styles.closeButton} onClick={() => setViewProfile(false)}>&times;</button>
          <div className={styles.profileContent}>
            <h2>{profileData.displayName}</h2>
            <p><strong>Friend ID:</strong> {profileData.friendID}</p>
          </div>
          <div className={styles.modalActions}>
            <button className={styles.actionButton}>View Lists</button>
            <button className={`${styles.actionButton} ${styles.danger}`}>Remove Friend</button>
          </div>

          {
            lists.filter((list: any) => list.visible === true).length > 0 ?
           <select className={styles.selector}>
            {lists.filter((list: any) => list.visible === true).map((list: any) => {
              return <option key={list.listID}>{list.listName}</option>
            })}
            </select>
            : <p className={styles.noPublic}>No Publicly Available Lists</p>
          }
        </div>
      </div>
    );
  }
  