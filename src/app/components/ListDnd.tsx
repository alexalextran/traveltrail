import React, { useState, useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { getFirestore, doc, onSnapshot, DocumentSnapshot, DocumentReference, getDoc } from 'firebase/firestore';
import { app } from "../firebase";
import { addPinToList } from '../firebaseFunctions/Lists'; // Function to add pin to list
import DnDPin from './DnDPin';
const ListDnD = ({ listId }: { listId: string }) => {
  const [pinData, setPinData] = useState<{ id: string, pinTitle: string }[]>([]);
  const dropRef = useRef<HTMLDivElement>(null);
  const db = getFirestore(app);

  useEffect(() => {
    if (!listId) {
      setPinData([]);
      return; // Exit early if listId is null or undefined
    }

    const listDocRef = doc(db, `users/alextran/lists/${listId}`);
    const unsubscribe = onSnapshot(listDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const listData = docSnapshot.data();
        if (listData && listData.pins) {
          const promises = listData.pins.map(async (pinId: string) => {
            const pinDocRef = doc(db, `users/alextran/pins/${pinId}`);
            const pinDocSnap = await getDoc(pinDocRef);
            if (pinDocSnap.exists()) {
              const pinData = pinDocSnap.data();
              if (pinData) {
                return { id: pinId, pinTitle: pinData.title };
              }
            }
            return null;
          });

          Promise.all(promises).then((results) => {
            setPinData(results);
          });
        }
      } else {
        console.log('List document does not exist');
        setPinData([]); // Clear pinData if list document does not exist
      }
    });

    return () => unsubscribe(); // Clean up listener
  }, [db, listId]);

  const [{ isOver }, drop] = useDrop({
    accept: 'pin',
    drop: (item: { id: string }) => {
      if (listId) {
        addPinToList(listId, item.id);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // Connect the drop ref to the drop target
  drop(dropRef);

  return (
    <div ref={dropRef} style={{ border: isOver ? '2px solid green' : '2px solid gray', padding: '20px', margin: '10px' }}>
      Drop pins here to add to the list
      <div>
        {pinData.map((pin) => (
          <DnDPin pin={pin} key={pin.id}/>
        ))}
      </div>
    </div>
  );
};

export default ListDnD;
