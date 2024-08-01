import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectedPin } from '../store/pins/pinsSlice';
import styles from "../Sass/modal.module.scss";
import { removeImageReferenceFromFirestore } from '../firebaseFunctions/writeDocument';
import { removeImageFromPin } from '../store/pins/pinsSlice';
import Carousel from "react-multi-carousel";
import { useAuth } from '../context/authContext'; // Import the useAuth hook

export default function ImageModal() {
    const selectedPin = useSelector(selectSelectedPin);
    const [images, setImages] = useState<string[]>([]); // Initialize with an empty array
    const dispatch = useDispatch();
    const [imageFullscreen, setimageFullscreen] = useState(false)
    const { user } = useAuth(); // Use the useAuth hook


    const responsiveConfig = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
          breakpoint: { max: 4000, min: 3000 },
          items: 1
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 1
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 1
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        
      }
      }


    useEffect(() => {
        // Update images state when selectedPin.imageUrls changes
        if (selectedPin) {
            setImages(selectedPin.imageUrls || []); // Handle the case when imageUrls is undefined
        }
    }, [selectedPin]); // Depend on selectedPin to trigger useEffect

    const handleDeleteImage = async (imageUrl: string) => {
        try {
            if (selectedPin) {
                await removeImageReferenceFromFirestore(`users/${user.uid}/pins`, selectedPin.id, imageUrl);
                dispatch(removeImageFromPin({ pinId: selectedPin.id, imageUrl }));
                // Optionally, update images state here as well to immediately reflect the change
                // This is useful if the redux store update does not cause the component to re-render
                setImages(currentImages => currentImages.filter(url => url !== imageUrl));
            }
        } catch (error) {
            console.error("Failed to delete image: ", error);
        }
    };

    return (
        <>
        
        <div className={styles.imageModal}>
            {images && images.map((url, index) => (
                <div key={index} className={styles.imageDiv}>
                    <img src={url} alt={`Image ${index}`} style={{ width: '100px', height: 'auto' }} />
                    <div>
                        <a onClick={() => handleDeleteImage(url)}>Delete</a>
                        <a onClick={() => setimageFullscreen(true)}>FullScreen</a>
                        <a href={url} target='_blank' rel='noopener noreferrer'>Download</a>
                    </div>
                </div>
            ))}
        </div>

        {images.length === 0 && <p>No images to display</p>}

        {imageFullscreen && 
        <div className={styles.imageModalFullScreen}>
          <button onClick={() => {setimageFullscreen(false)}}>Exit FullScreen</button>
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
        </div>}
        </>
    );
}
