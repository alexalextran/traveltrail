import React, { useState, useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { getFirestore, doc, onSnapshot, DocumentSnapshot, DocumentReference, getDoc } from 'firebase/firestore';
import { app } from "../../firebase";
import { addPinToList } from '../../firebaseFunctions/Lists'; // Function to add pin to list
import DnDPin from './DnDPin';
import { Pin } from '../../types/pinData';
import { useAuth } from '../../context/authContext'; // Import the useAuth hook
import { animated, useTransition } from '@react-spring/web';


const ListDnD = ({ listId }: { listId: string }) => {
  const [pinData, setPinData] = useState<Pin[]>([]);
  const dropRef = useRef<HTMLDivElement>(null);
  const db = getFirestore(app);
  const { user } = useAuth(); 

  useEffect(() => {
    if (!listId) {
      setPinData([]);
      return; 
    }

    const listDocRef = doc(db, `users/${user.uid}/lists/${listId}`);
    const unsubscribe = onSnapshot(listDocRef, async (docSnapshot) => {
      if (docSnapshot.exists()) {
        const listData = docSnapshot.data();
        if (listData && listData.pins) {
          const promises = listData.pins.map(async (pinId: string) => {
            const pinDocRef = doc(db, `users/${user.uid}/pins/${pinId}`);
            const pinDocSnap = await getDoc(pinDocRef);
            if (pinDocSnap.exists()) {
              return { id: pinDocSnap.id, ...pinDocSnap.data() } as Pin;
            }
            return null;
          });

          const results = await Promise.all(promises);
          setPinData(results.filter((pin) => pin !== null) as Pin[]);
        } else {
          setPinData([]);
        }
      } else {
        console.log('List document does not exist');
        setPinData([]); // Clear pinData if list document does not exist
      }
    });

    return () => unsubscribe(); // Clean up listener
  }, [db, listId, user]);

  const [{ isOver }, drop] = useDrop({
    accept: 'pin',
    drop: (item: { id: string }) => {
      if (listId) {
        addPinToList(`users/${user.uid}/lists`, listId, item.id);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // Connect the drop ref to the drop target
  drop(dropRef);


  const transitions = useTransition( pinData, {
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
      <p>Drag and drop pins here to add and remove to the list</p>
      <div>

      {transitions((style, pin, _) => (
                        <animated.div style={style}>
                             <DnDPin key={pin.id} pin={pin} />
                        </animated.div>
                    ))}


        
      </div>
    </div>
  );
};

export default ListDnD;
