import React, { useEffect, useState, useRef } from 'react';
import Draggable from 'react-draggable';
import styles from "../Sass/modal.module.scss";
import { useDispatch, useSelector } from 'react-redux';
import { addPin } from '../../app/store/pins/pinsSlice.ts';
import { Pin } from '../../app/types/pinData.ts';
import { APIProvider, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { writeToFirestore } from '../firebaseFunctions/writeDocument.ts'; // Adjust the import path as necessary
import { Category } from '../types/categoryData.ts';
import { selectCategories } from '../store/categories/categoriesSlice'
import axios from 'axios';
import { selectAddModal } from '../store/toggleModals/toggleModalSlice.ts';
import {toggleAddModal } from '../store/toggleModals/toggleModalSlice.ts';
import { selectFullScreen } from '../store/toggleModals/toggleModalSlice.ts';

const Modal = () => {
 
  const placesLib = useMapsLibrary('places');
  const categories = useSelector(selectCategories);
  const ShowAddModal = useSelector(selectAddModal);
  const ShowFullScreen = useSelector(selectFullScreen);
  const [description, setDescription] = useState('');
  const [visited, setVisited] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('Place');
  const dispatch = useDispatch();
  
  const addressInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (placesLib && addressInputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(addressInputRef.current);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setAddress(place.formatted_address);
        }
      });
    }
  }, [placesLib, ShowAddModal]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    // Logic to handle the form submission and add the pin using the entered address
    
   

    async function getData() {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.NEXT_PUBLIC_GOOGLEAPI_API_KEY}`);
      const data = response.data;
      return data;
    }
    const data = await getData();
    const coords = data.results[0].geometry.location;

    // Create a new pin
    const newPin: Omit<Pin, 'id'> = {
      title: title,
      address: address,
      description: description,
      lat: coords.lat,
      lng: coords.lng,
      category: category,
      visited: visited,
      imageUrls: [],
    };

    writeToFirestore('users/alextran/pins', newPin)
    .then((docId) => {
      const completePin: Pin = { ...newPin, id: docId };
      dispatch(addPin(completePin)); // Dispatch the action with the complete pin
    })
    .catch((error) => console.error('Error writing document: ', error));
};

if (ShowFullScreen) {
  return (
        <>
        <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Add Pin</h1>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Title"
          />
          <input
            type="text"
            value={address}
            ref={addressInputRef}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((category: Category) => (
              <option key={category.categoryName} value={category.categoryName}>
                {category.categoryName}
              </option>
            ))}
          </select>
          <label>
            <input
              type="checkbox"
              checked={visited}
              onChange={(e) => setVisited(e.target.checked)}
            />
            Visited
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          />
          <button type="submit">Add</button>
        </form>
    </>
  )
  }

  return (
    <>
      <button className={styles.button} onClick={() => {dispatch(toggleAddModal(!ShowAddModal))}}>
        <p>+</p>
      </button>
      {ShowAddModal &&
      <Draggable
        defaultPosition={{x: window.innerWidth / 2, y: window.innerHeight / 4}}
      >
        <div className={styles.modal}>
          <h1>Add Pin</h1>
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Title"
            />
            <input
              type="text"
              ref={addressInputRef}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {
                categories.map((category: Category) => (
                  <option key={category.categoryName} value={category.categoryName}>{category.categoryName}</option>
                ))
              }
             
            </select>
            
            <label>
              <input
                type="checkbox"
                checked={visited}
                onChange={(e) => setVisited(e.target.checked)}
              />
              Visited
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
            <button type="submit">Add Pin</button>
          </form>
        </div>
      </Draggable>}
    </>
  );
};

export default Modal;
