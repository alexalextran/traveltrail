import React from 'react'
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import styles from '../../Sass/NoImagesDisplay.module.scss';
interface NoImagesDisplayProps {
  pin: { placeId: string };
  setImages: (images: string[]) => void;
}

export default function NoImagesDisplay({ pin, setImages }: NoImagesDisplayProps) {


    const fetchGooglePlaceImages = async () => {
        if (!pin?.placeId) {
          console.error("No placeId found for the selected place.");
          return;
        }
        const placesService = new google.maps.places.PlacesService(document.createElement('div'));
        var photos: string[] = [];
        placesService.getDetails({ placeId: pin.placeId }, async (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            photos = place.photos ? place.photos.map((photo) => photo.getUrl({ maxWidth: 600, maxHeight: 600 })) : []
            setImages(photos);
          } else {
            console.error('Failed to fetch place details:', status);
          }
        });
      
      
      };



  return (
    <div className={styles.noImagesDisplay}>
    <p>No images to display</p>
    <button onClick={() => fetchGooglePlaceImages()}>Generate Temporary Images?</button>
    </div>
  )
}
