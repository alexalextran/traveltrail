import React, { useState } from 'react';
import { addPictures } from '../store/pins/pinsSlice';
import { useDispatch } from 'react-redux';

function ImgUpload({pinID}: {pinID: string}) {
  const [images, setImages] = useState<string[]>([]);
  const dispatch = useDispatch();






  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
  
        reader.onloadend = () => {
          setImages(oldImages => [...oldImages, reader.result as string]);
          dispatch(addPictures({id: pinID, picture: [...images, reader.result as string]}));
        };
  
        reader.readAsDataURL(file);
      }
    }
  }

  return (
  
      <input type="file" accept="image/*" multiple onChange={handleUpload} />
    
  );
}

export default ImgUpload;