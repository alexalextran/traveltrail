import React, { useEffect, useState, useRef } from 'react';
import Draggable from 'react-draggable';
import styles from "../Sass/modal.module.scss";
import { useDispatch, useSelector } from 'react-redux';
import { addPin } from '../../app/store/pins/pinsSlice.ts';
import { Pin } from '../../app/types/pinData.ts';
import {  useMapsLibrary } from '@vis.gl/react-google-maps';
import { writeToFirestore } from '../firebaseFunctions/writeDocument.ts'; // Adjust the import path as necessary
import { Category } from '../types/categoryData.ts';
import { selectCategories } from '../store/categories/categoriesSlice';
import axios from 'axios';
import { selectAddModal } from '../store/toggleModals/toggleModalSlice.ts';
import { toggleAddModal } from '../store/toggleModals/toggleModalSlice.ts';
import { selectFullScreen } from '../store/toggleModals/toggleModalSlice.ts';
import { useAuth } from '../context/authContext'; // Import the useAuth hook
import { Rating } from 'react-simple-star-rating';
import { toast } from 'react-toastify';

const Modal = () => {
  const placesLib = useMapsLibrary('places');
  const categories = useSelector(selectCategories);
  const ShowAddModal = useSelector(selectAddModal);
  const ShowFullScreen = useSelector(selectFullScreen);

  const [description, setDescription] = useState<string>('');
  const [visited, setVisited] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [openingHours, setOpeningHours] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [website, setWebsite] = useState<string>('');

  const dispatch = useDispatch();
  const { user } = useAuth(); 

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
    
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.NEXT_PUBLIC_GOOGLEAPI_API_KEY}`);
    const data = response.data;
    if(data.status === 'ZERO_RESULTS') {
      toast.error('Could not add a pin, please enter a valid address!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    } 
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
      openingHours: openingHours,
      rating: rating,
      website: website
    };

    writeToFirestore( user.uid, newPin)
      .then((docId) => {
        const completePin: Pin = { ...newPin, id: docId };
        dispatch(addPin(completePin));
        toast.success('Pin added successfully!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

      })
      .catch((error) => console.error('Error writing document: ', error));

    // Reset form fields
    setDescription('');
    setAddress('');
    setTitle('');
    setOpeningHours('');
    setWebsite('');
  };




  const handleRating = (rate: number) => {
    setRating(rate);
  };


  if (ShowFullScreen) {
    return (
      <>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h1>Add Pin</h1>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Title (Mandatory)"
            required
          />
          <input
            type="text"
            ref={addressInputRef}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address (Mandatory)"
            required
          />
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map((category: Category, index: number) => (
              <option key={index} value={category.categoryName}>{category.categoryName}</option>
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
          <div></div>
          <input
            type="text"
            value={openingHours}
            onChange={(e) => setOpeningHours(e.target.value)}
            placeholder="Opening Hours e.g 11am - 8pm"
          />
          <Rating
            allowFraction={true}
            onClick={handleRating}
          />
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="Related Website"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <button type="submit">Add Pin</button>
        </form>
      </>
    );
    
  }

  return (
    <>
      <button className={styles.button} onClick={() => { dispatch(toggleAddModal(!ShowAddModal)) }}>
        <p>+</p>
      </button>
      {ShowAddModal &&
      <div className={styles.modalWrapper}>
        <Draggable
        bounds="parent"
          handle=".modal-handle"
          defaultPosition={{ x: window.innerWidth / 1.5, y: window.innerHeight / 6 }}
        >
          <div className={styles.modal}>
            <div className="modal-handle" style={{ cursor: 'move' }}>
              <h1>Add Pin</h1>
              <p>Drag me here!</p>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Title (Mandatory)"
                required
              />
              <input
                type="text"
                ref={addressInputRef}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address (Mandatory)"
                required
              />
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                 <option value="">Select a category</option>
                {categories.map((category: Category, index: number) => (
                  <option key={index} value={category.categoryName}>{category.categoryName}</option>
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
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                placeholder="Opening Hours e.g 11am - 8pm"
              />
               <Rating
                onClick={handleRating} 
                initialValue={rating}
                allowFraction={true}
                />

              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Related Website"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />
              <button type="submit">Add Pin</button>
            </form>
          </div>
        </Draggable>
        </div>}
    </>
  );
};

export default Modal;
