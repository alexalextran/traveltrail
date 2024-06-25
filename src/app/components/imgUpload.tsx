import React, { useRef, useState } from 'react';
import { addPictures } from '../store/pins/pinsSlice';
import { useDispatch } from 'react-redux';
import { app } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addImageReferenceToFirestore } from '../firebaseFunctions/writeDocument';
import { FaImages } from "react-icons/fa";
import styles from '../Sass/pinItem.module.scss';

function ImgUpload({pinID}: {pinID: string}) {
  const [images, setImages] = useState<string[]>([]);
  const dispatch = useDispatch();
  const storage = getStorage(app);
  const fileInputRef = useRef<HTMLInputElement>(null!);



  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
  
        reader.onloadend = async () => {
          setImages(oldImages => [...oldImages, reader.result as string]);
          dispatch(addPictures({id: pinID, picture: [...images, reader.result as string]}));
          const storageRef = ref(storage, `${pinID}/${file.name}`);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          addImageReferenceToFirestore(pinID, url);
        };
  
        reader.readAsDataURL(file);
      }
    }
  }

  return (
    <div className={styles.uploadContainer}>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleUpload}
        className={styles.hiddenFileInput}
      />
        <FaImages onClick={handleClick}/>
    </div>
    
  );
}

export default ImgUpload;