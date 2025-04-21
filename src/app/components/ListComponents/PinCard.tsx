// PinContainer.tsx
import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import styles from "../../Sass/ListScreen.module.scss";
import { Pin } from "../../types/pinData";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const PinCard = ({
  pin,
  responsiveConfig,
  category,
}: {
  pin: Pin;
  responsiveConfig: any;
  category: any;
}) => {
  const divRef = useRef<HTMLDivElement>(null); // Create a ref for the div
  const [{ opacity }, dragRef] = useDrag({
    type: "pin",
    item: { pinObject: pin, categoryObject: category },
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
        <p
          style={{
            color: category.categoryColor,
            border: `2px solid ${category.categoryColor}`,
          }}
        >
          {pin.category}
        </p>
        <p
          style={{
            backgroundColor: pin.visited ? "#3c763d" : "#dff0d8",
            color: pin.visited ? "#dff0d8" : "#3c763d",
          }}
        >
          {pin.visited ? "Visited" : "Unvisited"}
        </p>
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
