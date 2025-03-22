import React, { useEffect, useState } from "react";
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

export default function ProfileComponent() {
  const { logout, user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [lists, setLists] = useState<
    { id: string; visible: boolean; listName: string; collaborative: boolean; collaborators?: any[] }[]
  >([]);
  const [showCollaboratorsModal, setShowCollaboratorsModal] = useState(false);
  const [selectedList, setSelectedList] = useState<{ id: string; listName: string; collaborators?: any[] } | null>(null);

  useEffect(() => {
    const db = getFirestore(app);

    const listCollectionRef = collection(db, `users/${user.uid}/lists`);
    const unsubscribe = onSnapshot(listCollectionRef, (snapshot) => {
      const fetchedLists = snapshot.docs.map((doc) => ({
        id: doc.id,
        visible: doc.data().visible,
        listName: doc.data().listName,
        collaborative: doc.data().collaborative,
        collaborators: doc.data().collaborators,
      }));
      setLists(fetchedLists);
    });

    const userDocRef = doc(db, `users/${user.uid}`);
    const userDocUnsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setDisplayName(userData.displayName);
      }
    });

    return () => {
      unsubscribe();
      userDocUnsubscribe();
    };
  }, []);

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

          <div className={styles.profileInfo}>
            <label>Email</label>
            <p>{user?.email}</p>
          </div>

          <div className={styles.profileInfo}>
            <label>My Friend Code</label>
            <p>{user?.uid}</p>
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
                          Manage Collaborators
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