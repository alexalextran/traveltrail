// PinContainer.tsx
import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import styles from '../../Sass/ListScreen.module.scss';
import { Pin } from '../../types/pinData';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const PinCard = ({ pin, responsiveConfig, categoryColor }: { pin: Pin, responsiveConfig: any, categoryColor: string }) => {
  const divRef = useRef<HTMLDivElement>(null); // Create a ref for the div
  const [{ opacity }, dragRef] = useDrag({
    type: 'pin',
    item: { pinObject: pin, categoryId: pin.categoryId },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    }),
  });

  // Connect the drag source ref with the div ref
  dragRef(divRef);

  return (
    <div ref={divRef} className={styles.pinContainer} style={{ opacity }}>
      <div className={styles.pinInfo}>
        <h2>{pin.title}</h2>
        <p>{pin.address}</p>
        <p style={{ color: categoryColor, border: `2px solid ${categoryColor}` }}>{pin.category}</p>
        <p>{pin.visited ? "Visited" : "Unvisited"}</p>
        <p>{pin.description}</p>
      </div>
      {pin.imageUrls && pin.imageUrls.length > 0 && (
        <Carousel responsive={responsiveConfig} className={styles.carousel}>
          {pin.imageUrls.map((src, index) => (
            <img key={index} src={src} alt="" />
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default PinCard;
