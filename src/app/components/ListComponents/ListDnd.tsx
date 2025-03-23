import React, { useState, useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { app } from "../../firebase";
import { addPinToList, synchronizeCollaborativePin } from '../../firebaseFunctions/Lists';
import DnDPin from './DnDPin';
import { Pin } from '../../types/pinData';
import { useAuth } from '../../context/authContext';
import { animated, useTransition } from '@react-spring/web';
import { BsFillPeopleFill } from "react-icons/bs";
import ConfirmationModal from './ConfirmationModal';
import styles from "../../Sass/ListPin.module.scss";

const ListDnD = ({ listId }: { listId: string }) => {
  const [pinData, setPinData] = useState<Pin[]>([]);
  const dropRef = useRef<HTMLDivElement>(null);
  const db = getFirestore(app);
  const { user } = useAuth(); 
  const [list, setList] = useState<any>();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingPin, setPendingPin] = useState<any>(null);
  const [pendingCategory, setPendingCategory] = useState<any>(null);

  useEffect(() => {
    if (!listId) {
      setPinData([]);
      return; 
    }

    const listDocRef = doc(db, `users/${user.uid}/lists/${listId}`);
    const unsubscribe = onSnapshot(listDocRef, async (docSnapshot) => {
      const listData = docSnapshot.data();
      setList(listData);
      if (listData) {
        setPinData(listData.pins);
      }
    });

    return () => unsubscribe();
  }, [db, listId, user]);


  const userHasEditPermissions = list?.collaborators?.some((collaborator: any) => 
    collaborator.userID === user.uid && collaborator.edit
  );

  const handleAddPin = () => {
    if (listId && pendingPin && pendingCategory) {
      addPinToList(
        `users/${user.uid}/lists`, 
        listId, 
        pendingPin, 
        pendingCategory, 
        list.collaborative, 
        user.uid
      );
      setPendingPin(null);
      setPendingCategory(null);
    }
    setModalOpen(false);
  };
  
  const [{ isOver }, drop] = useDrop({
    accept: 'pin',
    drop: (pin: { pinObject: any; categoryObject: any }) => {
      if (list.collaborative && !userHasEditPermissions) return;

      const placeIdAlreadyInList = list.pins?.map((p: any) => p.placeId).includes(pin.pinObject.placeId);

      if (placeIdAlreadyInList) {
        setPendingPin(pin.pinObject);
        setPendingCategory(pin.categoryObject);
        setModalOpen(true);
      } else { 
        if (listId) {
          addPinToList(
            `users/${user.uid}/lists`, 
            listId, 
            pin.pinObject, 
            pin.categoryObject, 
            list.collaborative, 
            user.uid
          );
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  drop(dropRef);

  const transitions = useTransition(pinData, {
    from: { opacity: 0, y: -50 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: -50 },
    update: { opacity: 1, y: 0 },
    trail: 50,
    config: { tension: 200, friction: 20 }, 
    keys: (pin: Pin) => pin.id, 
  });

  return (
    <div ref={dropRef} className={`${styles.listContainer} ${isOver ? styles.dragOver : ''}`}>
    
      <p className={styles.listHeader}>
        Drag and drop pins here to add and remove to the list 
      </p>
      {list?.collaborative && (
      <p className={styles.permissionsText}>
        This is a collaborative list. {userHasEditPermissions ? "You have edit permissions." : "You have view-only permissions."}
      </p>
      )}
      
      {list?.collaborative && (
        <button className={styles.syncButton} onClick={() => synchronizeCollaborativePin(listId, user.uid)}>
          Download Collaborative Pins
        </button>
      )}

      <div className={styles.pinsContainer}>
        {transitions((style, pin) => (
          <animated.div style={style}>
            <DnDPin key={pin.id} pin={pin} userHasEditPermissions={userHasEditPermissions} collaborative={list.collaborative}/>
          </animated.div>
        ))}
      </div>
      
      <ConfirmationModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleAddPin}
        placeName={pendingPin?.title || "This place"}
      />
    </div>
  );
};

export default ListDnD;
