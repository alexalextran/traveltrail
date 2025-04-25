import React, { useState, useEffect } from "react";
import { Pin } from "../../types/pinData.ts";
import { Category } from "../../types/categoryData.ts";
import styles from "../../Sass/expandedInfoModal.module.scss";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import IconBar from "../ImageComponents/IconBar.tsx";
import { Rating } from "react-simple-star-rating";
import { useSpring, animated } from "@react-spring/web";
import NoImagesDisplay from "../ImageComponents/NoImagesDisplay.tsx";
import { useDispatch } from "react-redux";
import { setActivePin } from "../../store/activePinModal/activePinModalSlice.ts";
import { getContrastTextColor } from "../../utility";

export default function ExpandedInfoModal({
  pin,
  settoggleIWM,
  userLocation,
  filteredCategory,
}: {
  filteredCategory: Category;
  pin: Pin;
  settoggleIWM: any;
  userLocation: { lat: number; lng: number };
}) {
  const responsiveConfig = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const [images, setimages] = useState(pin.imageUrls || []);
  const [isClosing, setIsClosing] = useState(false);
  const dispatch = useDispatch();

  // Reset closing state when pin changes
  useEffect(() => {
    setIsClosing(false);
  }, [pin]);

  // Update the animation to handle both entrance and exit
  const slideAnimation = useSpring({
    opacity: isClosing ? 0 : 1,
    transform: isClosing
      ? `translate(-150%, 50%)` // Slide further left when closing
      : `translate(-50%, 50%)`, // Initial position after sliding from right
    from: {
      opacity: isClosing ? 1 : 0,
      transform: isClosing
        ? `translate(-50%, 50%)` // Start from current position when closing
        : `translate(50%, 50%)`, // Start from right when opening
    },
    config: { tension: 200, friction: 20 },
    onRest: () => {
      // When animation completes and we're closing, actually dispatch the action
      if (isClosing) {
        dispatch(setActivePin(null));
      }
    },
  });

  // Create a close handler function
  const handleClose = () => {
    setIsClosing(true);
    // The actual dispatch happens after animation completes in onRest
  };

  const geometryLibrary = useMapsLibrary("geometry");
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    if (!geometryLibrary) {
      console.error("geometry library not loaded.");
      return 0;
    }

    const from = new google.maps.LatLng(lat1, lng1);
    const to = new google.maps.LatLng(lat2, lng2);

    return (
      google.maps.geometry.spherical.computeDistanceBetween(from, to) / 1000
    ); // Distance in km
  };

  const parseOpeningHours = (text: any): string[] => {
    if (typeof text !== "string") {
      console.error("parseOpeningHours: Expected a string but received:", text);
      return [];
    }

    // Regular expression to match days followed by their hours
    const regex =
      /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):\s*/g;

    // Split text while keeping day names
    const parts = text.split(regex).filter((part) => part.trim() !== "");

    const openingHoursArray: string[] = [];

    for (let i = 0; i < parts.length; i += 2) {
      const day = parts[i].trim();
      const hours = parts[i + 1]
        ? parts[i + 1].trim().replace(/,\s?/g, " ")
        : "Closed";

      // Clean up weird formatting like en-dashes
      const formattedHours = hours.replace(/–/g, "-");

      openingHoursArray.push(`${day} ${formattedHours}`);
    }

    return openingHoursArray;
  };

  const result = parseOpeningHours(pin.openingHours);

  const distanceToUser = calculateDistance(
    pin.lat,
    pin.lng,
    userLocation.lat,
    userLocation.lng
  );

  return (
    <animated.div style={slideAnimation} className={styles.main}>
      <div className={styles.header}>
        <h1>{pin.title}</h1>
        <button onClick={handleClose}>Close</button>
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.addressInfo}>
            <p className={styles.address}>{pin.address}</p>
            <p>
              <span>{distanceToUser.toFixed(2)}</span>KM Away
            </p>
            {pin.website && (
              <a href={pin.website} target="_blank">
                Check Link
              </a>
            )}
          </div>

          <div className={styles.rating}>
            {pin.rating != 0 && pin.rating && (
              <Rating allowFraction={true} initialValue={pin.rating} readonly></Rating>
            )}
            <p className={styles.opening_hours}>
              {Array.isArray(result)
                ? result.map((item, index) => (
                  <span key={index}>
                    {item}
                    <br />
                  </span>
                ))
                : "No opening hours available"}
            </p>
          </div>
        </div>

        <div className={styles.expandedModalTags}>
          <p
            style={{
              border: `2px solid black`,
              color: ` ${getContrastTextColor(filteredCategory.categoryColor)}`,
              backgroundColor: `${filteredCategory.categoryColor}`,
            }}
          >
            {pin.category}
          </p>
          <p style={{
            backgroundColor: pin.visited ? "#3c763d" : "#dff0d8",
            color: pin.visited ? "#dff0d8" : "#3c763d",
          }}>{pin.visited ? "Visited" : "Unvisited"}</p>
        </div>
        {pin.description && (
          <p className={styles.description}>{pin?.description}</p>
        )}
      </div>

      <div className={styles.footer}>
        {images.length > 0 ? (
          <Carousel
            responsive={responsiveConfig}
            className={styles.carouselcontainer}
          >
            {images.map((src, index) => (
              <img key={index} src={src} alt="" />
            ))}
          </Carousel>
        ) : (
          <NoImagesDisplay pin={pin} setImages={setimages} />
        )}

        <IconBar
          enableImage={false}
          pin={pin}
          setchild={null}
          color={filteredCategory.categoryColor}
        />
      </div>
    </animated.div>
  );
}
