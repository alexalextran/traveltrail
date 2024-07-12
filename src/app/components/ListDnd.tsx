import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { addPinToList } from '../firebaseFunctions/Lists'; // Function to add pin to list

const ListDnD = ({ listId }: { listId: string }) => {
  const dropRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop({
    accept: 'pin',
    drop: (item: { id: string }) => {
      addPinToList(listId, item.id);
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
    </div>
  );
};

export default ListDnD;
