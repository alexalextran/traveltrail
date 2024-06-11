import React, { useState } from 'react'
import Draggable from 'react-draggable';
import styles from "../Sass/modal.module.scss";
import { useDispatch } from 'react-redux';
import { addPin } from '../../app/store/pins/pinsSlice.ts';
import { Pin } from '../../app/types/pinData.ts';

const Modal = () => {
    const [toggle, settoggle] = useState(false)
    const [address, setAddress] = useState('');
    const dispatch = useDispatch();
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      // Logic to handle the form submission and add the pin using the entered address
      console.log('Address:', address);
  
      async function getData(){
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.NEXT_PUBLIC_GOOGLEAPI_API_KEY}`);
        const data = await response.json();
        return data;
      }
  
    const data = await getData();
    const coords = data.results[0].geometry.location;
      
  
      // Create a new pin
      const newPin: Pin = {
        id: Math.random().toString(36).substr(2, 9), // Generate a random id
        title: address,
        description: '',
        lat: coords.lat, // These values should be replaced with actual coordinates
        lng: coords.lng, // You may need to use a geocoding service to get these from the address
        category: 'place',
      };
  
      console.log('New Pin:', newPin);
  
      // Dispatch the addPin action
      dispatch(addPin(newPin));
  
      // Reset the address input
      setAddress('');
    };

    
return (
    <>
    <button className={styles.button} onClick={() => {settoggle(!toggle)}}>
        <p>+</p>
    </button>
    {   toggle &&
    <Draggable 
        defaultPosition={{x: window.innerWidth / 2, y: window.innerHeight / 2}}
    >
        <div className={styles.modal}>
        <h1>Map</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address"
        />
        <button type="submit">Add Pin</button>
      </form>
        </div>
    </Draggable> } 
    
    
    </>
)
}
export default Modal;