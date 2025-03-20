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
import ConfirmationModal from './ConfirmationModal'; // Import the new modal component

const ListDnD = ({ listId }: { listId: string }) => {
  const [pinData, setPinData] = useState<Pin[]>([]);
  const dropRef = useRef<HTMLDivElement>(null);
  const db = getFirestore(app);
  const { user } = useAuth(); 
  const [list, setlist] = useState<any>();
  
  // State for the confirmation modal
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
      setlist(listData);
      if (listData) {
        setPinData(listData.pins);
      }
    });

    return () => unsubscribe(); // Clean up listener
  }, [db, listId, user]);
  
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
      // Reset pending pin data
      setPendingPin(null);
      setPendingCategory(null);
    }
    setModalOpen(false);
  };
  
  const [{ isOver }, drop] = useDrop({
    accept: 'pin',
    drop: (pin: { pinObject: any; categoryObject: any }) => {
      const placeIdAlreadyInList = list.pins?.map((p: any) => p.placeId).includes(pin.pinObject.placeId);

      if (placeIdAlreadyInList) {
        
        // Store the pin info and show confirmation modal
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

  // Connect the drop ref to the drop target
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
    <div ref={dropRef} style={{ border: isOver ? '2px solid green' : '2px solid gray', padding: '20px', margin: '10px' }}>
      <p>Drag and drop pins here to add and remove to the list {list?.collaborative && <BsFillPeopleFill size="1em" color="black" />}</p>
      
      <div>
        {list?.collaborative && (
          <div>
            <p>Sync To Current Map?</p>
            <input 
              type='checkbox' 
              onChange={(e) => { 
                if(e.target.checked) { 
                  synchronizeCollaborativePin(listId, user.uid);
                } 
              }}
            />
          </div>
        )}

        {transitions((style, pin, _) => (
          <animated.div style={style}>
            <DnDPin key={pin.id} pin={pin} />
          </animated.div>
        ))}
      </div>
      
      {/* Confirmation Modal */}
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