import React, { useEffect, useState } from 'react';
import styles from '../../Sass/ViewProfileComponent.module.scss';
import { getLists, getPinsFromList } from '../../firebaseFunctions/Lists';

interface ProfileData {
  friendID: string;
  displayName: string;
}

interface ModalProps {
  profileData: ProfileData;
  setViewProfile: (value: boolean) => void;
}

interface List {
  listID: string;
  listName: string;
  visible: boolean;
  pins?: string[];
}

interface Pin {
  id: string;
  address: string;
  category: string;
  description: string;
  imageUrls: string[];
  lat: number;
  lng: number;
  openingHours: string;
  placeId: string;
  rating: number;
  title: string;
  website: string;
}

export default function ProfileModal({ profileData, setViewProfile }: ModalProps) {
  const [lists, setLists] = useState<List[]>([]);
  const [selectedList, setSelectedList] = useState<string>('');
  const [pins, setPins] = useState<Pin[]>([]);

  useEffect(() => {
    async function fetchLists() {
      try {
        const fetchedLists = await getLists(profileData.friendID);
        setLists(fetchedLists);
      } catch (error) {
        console.error(error);
      }
    }
  
    fetchLists();
  }, [profileData.friendID]);

  const handleListSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedListID = event.target.value;
    setSelectedList(selectedListID);

    try {
      const fetchedPins = await getPinsFromList(profileData.friendID, selectedListID);
      setPins(fetchedPins);
    } catch (error) {
      console.error('Error fetching pins:', error);
      setPins([]);
    }
  };

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

        {lists.filter((list) => list.visible === true).length > 0 ? (
          <>
            <select 
              className={styles.selector} 
              value={selectedList} 
              onChange={handleListSelect}
            >
              <option value="">Select a List</option>
              {lists.filter((list) => list.visible === true).map((list) => (
                <option key={list.listID} value={list.listID}>
                  {list.listName}
                </option>
              ))}
            </select>

            {pins.length > 0 && (
              <div className={styles.pinsContainer}>
                <h3>Pins in <span>{lists.find(list => list.listID === selectedList)?.listName}</span></h3>
                {pins.map((pin) => (
                  <div key={pin.id} className={styles.pinCard}>
                    {pin.imageUrls && pin.imageUrls.length > 0 && (
                      <img 
                        src={pin.imageUrls[0]} 
                        alt={pin.title} 
                        className={styles.pinImage} 
                      />
                    )}
                    <div className={styles.pinDetails}>
                      <h4>{pin.title}</h4>
                      <p><strong>Category:</strong> {pin.category}</p>
                      <p><strong>Address:</strong> {pin.address}</p>
                      {pin.description && <p><strong>Description:</strong> {pin.description}</p>}
                      {pin.rating > 0 && <p><strong>Rating:</strong> {pin.rating}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className={styles.noPublic}>No Publicly Available Lists</p>
        )}
        <button>Add To Profile</button>
      </div>
    </div>
  );
}