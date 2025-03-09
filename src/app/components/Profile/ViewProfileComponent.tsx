import React, { useEffect, useState } from 'react';
import styles from '../../Sass/ViewProfileComponent.module.scss';
import { getLists, getPinsFromList, getUserStatistics } from '../../firebaseFunctions/Lists';
import { handleAddToProfile } from '../../firebaseFunctions/Lists';
import { useAuth } from '@/app/context/authContext';
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

interface UserStatistics {
  totalLists: number;
  totalPins: number;
  totalCategories: number;
}

export default function ProfileModal({ profileData, setViewProfile }: ModalProps) {
  const [lists, setLists] = useState<List[]>([]);
  const [selectedList, setSelectedList] = useState<string>('');
  const [pins, setPins] = useState<Pin[]>([]);
  const [statistics, setStatistics] = useState<UserStatistics>({
    totalLists: 0,
    totalPins: 0,
    totalCategories: 0
  });
      const { user } = useAuth();
  


  useEffect(() => {
    async function fetchProfileData() {
      try {
        const fetchedLists = await getLists(profileData.friendID);
        setLists(fetchedLists);

        const userStats = await getUserStatistics(profileData.friendID);
        setStatistics(userStats);
      } catch (error) {
        console.error(error);
      }
    }
  
    fetchProfileData();
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
        <div className={styles.modalStatistics}>
          <div className={styles.statItem}>
            <strong>Total Lists:</strong> {statistics.totalLists}
          </div>
          <div className={styles.statItem}>
            <strong>Total Pins:</strong> {statistics.totalPins}
          </div>
          <div className={styles.statItem}>
            <strong>Unique Categories:</strong> {statistics.totalCategories}
          </div>
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
        {
          selectedList &&
          <div className={styles.buttonGroup}>
          <button className={styles.addToProfileButton} onClick={() => { handleAddToProfile(profileData.friendID, selectedList, user.uid); } }>Add To Profile</button>
          <button className={styles.addToProfileButton} onClick={() => { handleAddToProfile(profileData.friendID, selectedList, user.uid); } }>Request Collaboration</button>
          </div>

    }
          </div>
    </div>
  );
}