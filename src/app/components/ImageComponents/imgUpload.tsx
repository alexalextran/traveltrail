import React, { useRef } from 'react';
import { app } from "../../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addImageReferenceToFirestore } from '../../firebaseFunctions/writeDocument';
import { FaCameraRetro } from "react-icons/fa";
import styles from '../../Sass/pinItem.module.scss';
import { useAuth } from '../../context/authContext'; // Import the useAuth hook

function ImgUpload({pinID}: {pinID: string}) {
  const storage = getStorage(app);
  const fileInputRef = useRef<HTMLInputElement>(null!);
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
        accept="image/jpeg, image/gif, image/png"
      />
      <FaCameraRetro onClick={handleClick} />
    </div>
  );
}

export default ImgUpload;
