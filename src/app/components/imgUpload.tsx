import React, { useRef, useState } from 'react';
import { addPictures, updatePin, selectPin } from '../store/pins/pinsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { app } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addImageReferenceToFirestore } from '../firebaseFunctions/writeDocument';
import { FaImages } from "react-icons/fa";
import styles from '../Sass/pinItem.module.scss';
import { RootState } from '../store/store';
import { useAuth } from '../context/authContext'; // Import the useAuth hook

function ImgUpload({pinID}: {pinID: string}) {
  const [images, setImages] = useState<string[]>([]);
  const dispatch = useDispatch();
  const storage = getStorage(app);
  const fileInputRef = useRef<HTMLInputElement>(null!);
  const selectedPin = useSelector((state: RootState) => state.pins.pins.find(pin => pin.id === pinID));
  const { user } = useAuth(); // Use the useAuth hook

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImageUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const storageRef = ref(storage, `${pinID}/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        newImageUrls.push(url);
        await addImageReferenceToFirestore(`users/${user.uid}/pins` , pinID, url);
      }

      if (selectedPin) {
        const updatedPin = {
          ...selectedPin,
          imageUrls: [...selectedPin.imageUrls, ...newImageUrls]
        };
        dispatch(updatePin(updatedPin));
        dispatch(selectPin(updatedPin));
      }

      setImages(oldImages => [...oldImages, ...newImageUrls]);
      dispatch(addPictures({id: pinID, picture: [...images, ...newImageUrls]}));
    }
  }

  return (
    <div className={styles.uploadContainer}>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleUpload}
        className={styles.hiddenFileInput}
        multiple
      />
      <FaImages onClick={handleClick} />
    </div>
  );
}

export default ImgUpload;
