import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePin } from '../store/pins/pinsSlice'; // Adjust the import path as necessary
import { Pin } from '../types/pinData'; // Adjust the import path as necessary
import { selectSelectedPin } from '../store/pins/pinsSlice';
import styles from "../Sass/modal.module.scss";
import { Category } from '../types/categoryData.ts';
import { selectCategories } from '../store/categories/categoriesSlice'
import axios from 'axios';
import { updateToFirestore } from '../firebaseFunctions/writeDocument.ts'; // Adjust the import path as necessary

function EditPinForm() {
  const selectedPin = useSelector(selectSelectedPin);
  const categories = useSelector(selectCategories);

  const [title, setTitle] = useState(selectedPin?.title );
  const [address, setAddress] = useState(selectedPin?.address );
  const [description, setDescription] = useState(selectedPin?.description );
  const [category, setCategory] = useState(selectedPin?.category);
  const [visited, setVisited] = useState(selectedPin?.visited);

  const dispatch = useDispatch();

  useEffect(() => {
   if(selectedPin != null) {
    setTitle(selectedPin.title);
    setAddress(selectedPin.address);
    setDescription(selectedPin.description);
    setCategory(selectedPin.category);
    setVisited(selectedPin.visited);
    }
  }, [selectedPin]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.NEXT_PUBLIC_GOOGLEAPI_API_KEY}`);
    const data = response.data;
    const coords = data.results[0].geometry.location;

    const updatedPin = {
      id: selectedPin?.id,
      title: title,
      address: address,
      description: description,
      lat: coords.lat,
      lng: coords.lng,
      category: category,
      visited: visited,
      imageUrls: selectedPin?.imageUrls

    };
  

    try {
      await updateToFirestore(updatedPin); // Assuming this function returns a Promise
      dispatch(updatePin(updatedPin));
    } catch (error) {
      console.error("Failed to update pin:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}  className={styles.form}>
       <h1>Update Pin</h1>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter Title" />
      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter Address" />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
      {categories.map((category: Category) => (
              <option key={category.categoryName} value={category.categoryName}>
                {category.categoryName}
              </option>
            ))}
      </select>
      <label>
        <input type="checkbox" checked={visited} onChange={(e) => setVisited(e.target.checked)} />
        Visited
      </label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter Description" />
      <button type="submit">Update Pin</button>
    </form>
  );
}

export default EditPinForm;