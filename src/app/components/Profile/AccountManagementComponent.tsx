import React, { useEffect, useRef, useState } from "react";
import styles from "../../Sass/ProfileComponent.module.scss";
import { useAuth } from "../../context/authContext";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { app } from "../../firebase";
import { updateListVisibility } from "../../firebaseFunctions/Lists";
import { toast } from "react-toastify";
import CollaboratorsModal from "./ManageCollaborators";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";


export default function ProfileComponent() {
  const { logout, user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [profilePicture, setProfilePicture] = useState<string | null>(user?.photoURL || null);
  const [lists, setLists] = useState<
    { id: string; visible: boolean; listName: string; collaborative: boolean; collaborators?: any[]; owner: string }[]
  >([]);
  const [showCollaboratorsModal, setShowCollaboratorsModal] = useState(false);
  const [selectedList, setSelectedList] = useState<{ id: string; listName: string; collaborators?: any[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const db = getFirestore(app);
    
    const listCollectionRef = collection(db, `users/${user.uid}/lists`);
    
    const unsubscribe = onSnapshot(listCollectionRef, (snapshot) => {
      const fetchedLists = snapshot.docs.filter((doc) => doc.data().owner === user.uid).map((doc) => ({
        id: doc.id,
        visible: doc.data().visible,
        listName: doc.data().listName,
        collaborative: doc.data().collaborative,
        collaborators: doc.data().collaborators,
        owner: doc.data().owner,
      }));
      setLists(fetchedLists);
    });

    const userDocRef = doc(db, `users/${user.uid}`);
    const userDocUnsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setDisplayName(userData.displayName);
        setProfilePicture(userData.photoURL || null);
      }
    });

    return () => {
      unsubscribe();
      userDocUnsubscribe();
    };
  }, []);

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload JPEG, PNG, or GIF.", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
      return;
    }

    if (file.size > maxSize) {
      toast.error("File is too large. Maximum size is 5MB.", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
      return;
    }

    try {
      const storage = getStorage(app);
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Update user document with new photo URL
      const userDocRef = doc(getFirestore(app), `users/${user.uid}`);
      await updateDoc(userDocRef, { photoURL: downloadURL });
      
      // Update local state
      setProfilePicture(downloadURL);
      
      toast.success("Profile picture updated successfully", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error("Failed to update profile picture", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
    }
  };

  const updateList = (id: string, checked: boolean) => {
    updateListVisibility(`users/${user.uid}/lists`, id, checked);
  };

  const updateDisplayName = async () => {
    try {
      const userDocRef = doc(getFirestore(app), `users/${user.uid}`);
      await updateDoc(userDocRef, { displayName });
      toast.success("Name updated successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      toast.error("Name could not be updated", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleManageCollaborators = (listId: string, listName: string, collaborators: string[]) => {
    setSelectedList({ id: listId, listName, collaborators });
    setShowCollaboratorsModal(true);
  };

  const handleBackToProfile = () => {
    setShowCollaboratorsModal(false);
    setSelectedList(null);
  };

  return (
    <div className={styles.profileContainer}>
      {showCollaboratorsModal && selectedList ? (
        <CollaboratorsModal 
          listId={selectedList.id} 
          listName={selectedList.listName} 
          onBack={handleBackToProfile} 
          listCollaborators={selectedList.collaborators || []}
        />
      ) : (
        <main className={styles.main}>
          <h2>Profile</h2>

          <div className={styles.profileInfoModal}> 
            <div>
              <div className={styles.profileInfo}>
                <label>Email</label>
                <p>{user?.email}</p>
              </div>

              <div className={styles.profileInfo}>
                <label>My Friend Code</label>
                <p>{user?.uid}</p>
              </div>
            </div>

            <div className={styles.profilePicture}>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleProfilePictureChange}
                accept="image/jpeg,image/png"
                style={{ display: 'none' }}
              />
              {profilePicture ? (
                <><img
                    src={profilePicture}
                    alt="Profile"
                    className={styles.profileImage}
                    onClick={triggerFileInput} /><p> Click to Change Profile Picture</p></>
              ) : (
                <div 
                  className={styles.profileImagePlaceholder}
                  onClick={triggerFileInput}
                >
                  Upload Profile Picture
                </div>
              )}
            </div>
          </div>

          <div className={styles.profileInfo}>
            <label>Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
            />
          </div>

          <div className={styles.buttonGroup}>
            <button onClick={updateDisplayName} className={styles.resetButton}>
              Update Display Name
            </button>
            <button onClick={() => logout()} className={styles.logoutButton}>
              Logout
            </button>
          </div>

          <div className={styles.publicListsSection}>
            <h2>My Public Lists</h2>
            <div className={styles.listContainer}>
              <ul>
                {lists.length > 0 ? (
                  lists.map((list) => (
                    <li key={list.id}>
                      <input
                        checked={list.visible}
                        type="checkbox"
                        onChange={(e) => updateList(list.id, e.target.checked)}
                        id={`list-${list.id}`}
                      />
                      <label htmlFor={`list-${list.id}`}>{list.listName}</label>
                      {list.collaborative && (
                        <button 
                          onClick={() => handleManageCollaborators(list.id, list.listName, list.collaborators || [])}
                          className={styles.manageButton}
                        >
                          {list.owner === user.uid && <p>Manage Collaborators</p> }
                        </button>
                      )}
                    </li>
                  ))
                ) : (
                  <li className={styles.emptyState}>No lists available</li>
                )}
              </ul>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}