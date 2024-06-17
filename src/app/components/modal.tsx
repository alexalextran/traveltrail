import React, { useEffect, useState, useRef } from 'react';
import Draggable from 'react-draggable';
import styles from "../Sass/modal.module.scss";
import { useDispatch } from 'react-redux';
import { addPin } from '../../app/store/pins/pinsSlice.ts';
import { Pin } from '../../app/types/pinData.ts';
import { APIProvider, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

const Modal = () => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');

  const [description, setDescription] = useState('');
  const [visited, setVisited] = useState(false);
  const [toggle, settoggle] = useState(false);
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
  }, [placesLib, toggle]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    // Logic to handle the form submission and add the pin using the entered address
    
    async function getData(){
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.NEXT_PUBLIC_GOOGLEAPI_API_KEY}`);
      const data = await response.json();
      return data;
    }
    const data = await getData();
    const coords = data.results[0].geometry.location;

    console.log(category)

    // Create a new pin
    const newPin: Pin = {
      id: Math.random().toString(36).substr(2, 9), // Generate a random id
      title: title,
      address: address,
      description: description,
      lat: coords.lat, // These values should be replaced with actual coordinates
      lng: coords.lng, // You may need to use a geocoding service to get these from the address
      category: category,
      visited: visited,
    };

    console.log('New Pin:', newPin);

    // Dispatch the addPin action
    dispatch(addPin(newPin));

    // Reset the address and category inputs
 
  };

  return (
    <>
      <button className={styles.button} onClick={() => {settoggle(!toggle)}}>
        <p>+</p>
      </button>
      {toggle &&
      <Draggable
        defaultPosition={{x: window.innerWidth / 2, y: window.innerHeight / 2}}
      >
        <div className={styles.modal}>
          <h1>Map</h1>
          <form onSubmit={handleSubmit}>
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
              <option value="Place">Place</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Bar">Bar</option>
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
