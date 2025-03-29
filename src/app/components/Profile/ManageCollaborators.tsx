import React, { useEffect, useState } from "react";
import styles from "../../Sass/manageCollaborators.module.scss";
import { useAuth } from "../../context/authContext";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  updateDoc,
  arrayRemove,
  DocumentData,
  DocumentReference,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { app } from "../../firebase";
import { toast } from "react-toastify";
import { FaUserEdit, FaUserCog, FaArrowLeft, FaUserMinus } from "react-icons/fa";
import {returnUsers} from '../../firebaseFunctions/friends';

interface CollaboratorType {
  userID: string;
  displayName: string;
  edit: boolean;
}

interface CollaboratorsModalProps {
  listId: string;
  listName: string;
  onBack: () => void;
  listCollaborators: any[];
}

export default function CollaboratorsModal({ listId, listName, onBack, listCollaborators }: CollaboratorsModalProps) {
  const { user } = useAuth();
  const [collaborators, setCollaborators] = useState<CollaboratorType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollaborators = async () => {
     
      setLoading(false);
      setCollaborators(listCollaborators);
    };

    fetchCollaborators();
  }, [listId, user.uid, listCollaborators]);

  const updateCollaboratorAccess = async (collaboratorId: string, newAccessLevel: boolean) => {
    try {
      const db = getFirestore(app);
      const listDocRef = doc(db, `users/${user.uid}/lists/${listId}`);
      const collaborativeList = doc(db, `collaborativeLists/${listId}`);
      const collaboratorList = doc(db, `users/${collaboratorId}/lists/${listId}`);

      const updateCollaboratorField = async (docRef: DocumentReference) => {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const updatedCollaborators = data.collaborators.map((collab: any) =>
            collab.userID === collaboratorId ? { ...collab, edit: newAccessLevel } : collab
          );
          await updateDoc(docRef, { collaborators: updatedCollaborators });
        }
      };

      await Promise.all([
        updateCollaboratorField(listDocRef),
        updateCollaboratorField(collaborativeList),
        updateCollaboratorField(collaboratorList),
      ]);

      toast.success(`Access level updated successfully`, {
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
      toast.error("Failed to update access level", {
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


  const removeCollaborator = async (collaboratorId: string, displayName: string) => {
    try {
      const db = getFirestore(app);
      const listDocRef = doc(db, `users/${user.uid}/lists/${listId}`);
      const collaborativeList = doc(db, `collaborativeLists/${listId}`);
      const removedUserList = doc(db, `users/${collaboratorId}/lists/${listId}`);
      const collaboratorRequest = doc(db, `users/${collaboratorId}/collaborativeRequests/${listId}`);
      const userRequests = doc(db, `users/${user.uid}/collaborativeRequests/${listId}`);
  
      // Get the current list document
      const listSnap = await getDoc(listDocRef);
      if (!listSnap.exists()) throw new Error("List not found");
  
      const listData = listSnap.data();
      const currentCollaborators = listData.collaborators || [];
  
      // Filter out the collaborator object that matches the userID
      const updatedCollaborators = currentCollaborators.filter(
        (collab: { userID: string }) => collab.userID !== collaboratorId
      );
  
      // Update Firestore with the new collaborators array
      await updateDoc(listDocRef, {
        collaborators: updatedCollaborators
      });
  
      await updateDoc(collaborativeList, {
        collaborators: updatedCollaborators
      });
  
      // Remove the list from the collaborator's collection
      await deleteDoc(removedUserList);
      await deleteDoc(collaboratorRequest);
      await deleteDoc(userRequests);
  
      // Show success toast
      toast.success(`${displayName} removed from collaborators`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setCollaborators(updatedCollaborators)
  
    } catch (error) {
      toast.error(`Failed to remove collaborator: ${error}`, {
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
  

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <button 
          onClick={onBack} 
          className={styles.backButton}
          aria-label="Go back"
        >
          <FaArrowLeft /> Back
        </button>
        <div className={styles.titleContainer}>
          <h2 className={styles.modalTitle}>Manage Collaborators</h2>
          <p className={styles.listName}>{listName}</p>
        </div>
      </div>

      <div className={styles.modalContent}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading collaborators...</p>
          </div>
        ) : collaborators.length > 0 ? (
          <ul className={styles.collaboratorsList}>
            {collaborators.filter((collaborator) => collaborator.userID != user.uid).map((collaborator) => (
              <li key={collaborator.userID} className={styles.collaboratorItem}>
                <div className={styles.avatar}>
                  {collaborator.displayName}
                </div>
                <div className={styles.collaboratorInfo}>
                  <span className={styles.collaboratorName}>
                    {collaborator.displayName }
                  </span>
                
                  <span className={styles.collaboratorAccess} data-access={collaborator.edit}>
                    {collaborator.edit === false ? (
                       <>
                       <FaUserCog className={styles.accessIcon} /> Viewer
                     </>
                    ) : (
                    
                       <>
                       <FaUserEdit className={styles.accessIcon} /> Editor
                     </>
                    )}
                  </span>
                </div>
                <div className={styles.collaboratorActions}>
                  {collaborator.edit === false ? (
                   <button 
                   onClick={() => updateCollaboratorAccess(collaborator.userID, true)}
                   className={`${styles.accessButton} ${styles.editorButton}`}
                 >
                   Make Editor
                 </button>
                  ) : (
                    <button 
                      onClick={() => updateCollaboratorAccess(collaborator.userID, false)}
                      className={`${styles.accessButton} ${styles.viewerButton}`}
                    >
                      Make Viewer
                    </button>
                  )}
                  <button 
                    onClick={() => removeCollaborator(collaborator.userID, collaborator.displayName)}
                    className={styles.removeButton}
                    aria-label="Remove collaborator"
                  >
                    <FaUserMinus className={styles.removeIcon} /> Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>👥</div>
            <p>No collaborators for this list</p>
            <p className={styles.emptyStateHint}>Invite people to collaborate on this list</p>
          </div>
        )}
      </div>
    </div>
  );
}


