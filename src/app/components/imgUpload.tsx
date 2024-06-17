import React, { useState } from 'react';

function ImgUpload() {
  const [images, setImages] = useState<string[]>([]);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
    
        reader.onloadend = () => {
          setImages(oldImages => [...oldImages, reader.result as string]);
        };
    
        reader.readAsDataURL(file);
      }
    }
}
console.log(images)

  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={handleUpload} />
      {images.map((image, index) => (
        <img key={index} src={image} alt="Uploaded" />
      ))}
    </div>
  );
}

export default ImgUpload;