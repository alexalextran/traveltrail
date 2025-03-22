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
} from "firebase/firestore";
import { app } from "../../firebase";
import { toast } from "react-toastify";
import { FaUserEdit, FaUserCog, FaArrowLeft, FaUserMinus } from "react-icons/fa";
import {returnUsers} from '../../firebaseFunctions/friends';

interface CollaboratorType {
  userID: string;
  displayName: string;
  accessLevel: "editor" | "viewer";
}

interface CollaboratorsModalProps {
  listId: string;
  listName: string;
  onBack: () => void;
  listCollaborators: string[];
}

export default function CollaboratorsModal({ listId, listName, onBack, listCollaborators }: CollaboratorsModalProps) {
  const { user } = useAuth();
  const [collaborators, setCollaborators] = useState<CollaboratorType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollaborators = async () => {
      setLoading(true);
      const collaboratorsData = await returnUsers(listCollaborators);
      setLoading(false);
      setCollaborators(collaboratorsData);
    };

    fetchCollaborators();
  }, [listId, user.uid]);

  const updateCollaboratorAccess = async (collaboratorId: string, newAccessLevel: "editor" | "viewer") => {
    try {
      const db = getFirestore(app);
      const listDocRef = doc(db, `users/${user.uid}/lists/${listId}`);
      
      // Find the collaborator and update their access level
      const updatedCollaborators = collaborators.map(collab => 
        collab.userID === collaboratorId ? { ...collab, accessLevel: newAccessLevel } : collab
      );
      
      await updateDoc(listDocRef, { collaborators: updatedCollaborators });
      
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
      
        // Remove the collaborator from the managers list
        //Remove the collaborator from the collaborative list
        await updateDoc(listDocRef, {
          collaborators: arrayRemove(collaboratorId)
        });

        await updateDoc(collaborativeList, {
          collaborators: arrayRemove(collaboratorId)
        });

        // Remove the list from the collaborator's list
        await deleteDoc(removedUserList);
        await deleteDoc(collaboratorRequest);
        await deleteDoc(userRequests);
        
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
      }
      catch (error) {

        toast.error(`Failed to remove collaborator, ${error}`, {
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
            {collaborators.map((collaborator) => (
              <li key={collaborator.userID} className={styles.collaboratorItem}>
                <div className={styles.avatar}>
                  {collaborator.displayName}
                </div>
                <div className={styles.collaboratorInfo}>
                  <span className={styles.collaboratorName}>
                    {collaborator.displayName }
                  </span>
                
                  <span className={styles.collaboratorAccess} data-access={collaborator.accessLevel}>
                    {collaborator.accessLevel === "editor" ? (
                      <>
                        <FaUserEdit className={styles.accessIcon} /> Editor
                      </>
                    ) : (
                      <>
                        <FaUserCog className={styles.accessIcon} /> Viewer
                      </>
                    )}
                  </span>
                </div>
                <div className={styles.collaboratorActions}>
                  {collaborator.accessLevel === "editor" ? (
                    <button 
                      onClick={() => updateCollaboratorAccess(collaborator.userID, "viewer")}
                      className={`${styles.accessButton} ${styles.viewerButton}`}
                    >
                      Make Viewer
                    </button>
                  ) : (
                    <button 
                      onClick={() => updateCollaboratorAccess(collaborator.userID, "editor")}
                      className={`${styles.accessButton} ${styles.editorButton}`}
                    >
                      Make Editor
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


