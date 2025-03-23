import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { Pin } from '../../types/pinData';
import styles from '../../Sass/ListScreen.module.scss';

const DnDPin = ({ pin, userHasEditPermissions, collaborative }: { pin: Pin, userHasEditPermissions: boolean, collaborative: boolean }) => {
  const divRef = useRef<HTMLDivElement>(null); // Create a ref for the div

  // useDrag hook to enable drag-and-drop functionality
  const [{ opacity }, dragRef] = useDrag({
    type: 'addedPin', // Specify the type of item being dragged
    item: { pinObject: pin }, // Pass the pin id as the item being dragged
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1, // Adjust opacity when dragging
    }),
    canDrag: collaborative && userHasEditPermissions, // Disable drag if userHasEditPermissions is false
  });

  // Connect the drag source ref with the div ref
  if (collaborative && userHasEditPermissions) {
    dragRef(divRef);
  }

  return (
    <div ref={divRef} className={styles.DnDContainer} style={{ opacity }}>
      <div className={styles.pinInfo}>
        <h2>{pin.title}</h2>
        <p>{pin.address}</p>
      </div>
      <div>
        <p>{pin.category}</p>
        <p>{pin.visited ? 'Visited' : 'Unvisited'}</p>
      </div>
    </div>
  );
};

export default DnDPin;
