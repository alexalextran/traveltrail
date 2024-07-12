import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
interface DnDPinProps {
  pin: {
    id: string;
    pinTitle: string;
  };
}

export default function DnDPin({ pin }: DnDPinProps) {


    const divRef = useRef<HTMLDivElement>(null); // Create a ref for the div
    const [{ opacity }, dragRef] = useDrag({
      type: 'addedPin',
      item: { id: pin.id },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
    });
    dragRef(divRef);

  return ( 
    <div ref={divRef} style={{ opacity }}>
      <p>Title: {pin.pinTitle}</p>
    </div>
  )
}
