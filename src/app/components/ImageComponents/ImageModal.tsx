import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import { removeImageReferenceFromFirestore, updateToFirestore } from '../../firebaseFunctions/writeDocument';
import styles from '../../Sass/modal.module.scss';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { app } from "../../firebase"; // Ensure this path is correct
import { useSelector } from 'react-redux';
import { selectSelectedPin } from '../../store/pins/pinsSlice';
import { getFirestore, collection, onSnapshot, doc } from 'firebase/firestore';
import axios from 'axios';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

export default function ImageModal() {
  const placesLib = useMapsLibrary('places');  //from google maps api
  
  const [images, setImages] = useState<string[]>([]);
  const [imageFullscreen, setimageFullscreen] = useState(false);
  const { user } = useAuth();
  const selectedPin = useSelector(selectSelectedPin);
  const [pin, setpin] = useState<any>()

  const responsiveConfig = {
    superLargeDesktop: {
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

  useEffect(() => {
    const db = getFirestore(app);
  
    if (selectedPin) {
      const docRef = doc(db, `users/${user.uid}/pins/${selectedPin.id}`);
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        if (!snapshot.exists()) {
          // If the document is deleted, clear the images
          setImages([]);
          return;
        }
        
        const pinData = snapshot.data();
        if (pinData) {
          setpin({ ...pinData, id: snapshot.id });

          setImages(pinData.imageUrls || []);
        }
      });
  
      return () => unsubscribe(); // Cleanup listener on unmount
    }
  }, [selectedPin, user.uid]);
  

  const fetchGooglePlaceImages = async () => {
    if (!pin?.placeId) {
      console.error("No placeId found for the selected place.");
      return;
    }
    const placesService = new google.maps.places.PlacesService(document.createElement('div'));
    var photos: string[] = [];
    placesService.getDetails({ placeId: pin.placeId }, async (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        console.log(place)
        photos = place.photos ? place.photos.map((photo) => photo.getUrl({ maxWidth: 600, maxHeight: 600 })) : []
        const updatedPin = { ...pin, imageUrls: photos };
        console.log(updatedPin);
        await updateToFirestore(`users/${user.uid}/pins`, updatedPin);
        console.log("Firestore updated with images.");

      } else {
        console.error('Failed to fetch place details:', status);
      }
    });
  
  
  };
  
  


  const handleDeleteImage = async (imageUrl: string) => {
    try {
      if (selectedPin) {
        await removeImageReferenceFromFirestore(
          `users/${user.uid}/pins`,
          selectedPin.id,
          imageUrl
        );
        // Optionally, update images state here as well to immediately reflect the change
        // This is useful if the Firestore update does not cause the component to re-render
        setImages((currentImages) =>
          currentImages.filter((url) => url !== imageUrl)
        );
      }
    } catch (error) {
      console.error('Failed to delete image: ', error);
    }
  };

  return (
    <>
      <div className={styles.imageModal}>
        {images.map((url, index) => (
          <div key={index} className={styles.imageDiv}>
            <img
              src={url}
              alt={`Image ${index}`}
              style={{ width: '100px', height: 'auto' }}
            />
            <div>
              <a onClick={() => handleDeleteImage(url)}>Delete</a>
              <a onClick={() => setimageFullscreen(true)}>FullScreen</a>
              <a href={url} target="_blank" rel="noopener noreferrer">
                Download
              </a>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && 
      <>
      <p>No images to display</p>
      <button onClick={() => fetchGooglePlaceImages()}>Retrieve Images</button>
      </>
      }

      {imageFullscreen && (
        <div className={styles.imageModalFullScreen}>
          <button onClick={() => setimageFullscreen(false)}>
            Exit FullScreen
          </button>
          <div className={styles.FSmodal}>
            <Carousel
              responsive={responsiveConfig}
              className={styles.carousel}
              autoPlaySpeed={3000}
            >
              {images.map((url, index) => (
                <img key={index} src={url} alt="" />
              ))}
            </Carousel>
          </div>
        </div>
      )}
    </>
  );
}
