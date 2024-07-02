import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePin } from '../store/pins/pinsSlice'; // Adjust the import path as necessary
import { Pin } from '../types/pinData'; // Adjust the import path as necessary
import { selectSelectedPin } from '../store/pins/pinsSlice';
import styles from "../Sass/modal.module.scss";
import { Category } from '../types/categoryData.ts';
import { selectCategories } from '../store/categories/categoriesSlice'

function EditPinForm() {
  const selectedPin = useSelector(selectSelectedPin);
  const categories = useSelector(selectCategories);

  const [title, setTitle] = useState(selectedPin.title);
  const [address, setAddress] = useState(selectedPin.address);
  const [description, setDescription] = useState(selectedPin.description);
  const [category, setCategory] = useState(selectedPin.category);
  const [visited, setVisited] = useState(selectedPin.visited);

  const dispatch = useDispatch();

  useEffect(() => {
    setTitle(selectedPin.title);
    setAddress(selectedPin.address);
    setDescription(selectedPin.description);
    setCategory(selectedPin.category);
    setVisited(selectedPin.visited);
  }, [selectedPin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
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