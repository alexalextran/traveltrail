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
  const [list, setlist] = useState<any>()

  useEffect(() => {
    if (!listId) {
      setPinData([]);
      return; 
    }

    const listDocRef = doc(db, `users/${user.uid}/lists/${listId}`);
    const unsubscribe = onSnapshot(listDocRef, async (docSnapshot) => {
     
        const listData = docSnapshot.data();
        setlist(listData)
        if (listData) {
          setPinData(listData.pins);
        }
        

          
      
    });

    return () => unsubscribe(); // Clean up listener
  }, [db, listId, user]);
  
  const [{ isOver }, drop] = useDrop({
    accept: 'pin',
    drop: (pin: { pinObject: any; categoryId: string }) => {
      if (listId) {
        addPinToList(`users/${user.uid}/lists`, listId, pin.pinObject, pin.categoryId, list.collaborative, user.uid);
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
console.log(pinData)


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
