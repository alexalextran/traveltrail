import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPin } from '../../app/store/pins/pinsSlice.ts';
import { Pin } from '../../app/types/pinData.ts';
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps';
import { writeToFirestore } from '../firebaseFunctions/writeDocument.ts';
import { Category } from '../types/categoryData.ts';
import { selectCategories } from '../store/categories/categoriesSlice';
import styles from '../Sass/FullScreen.module.scss';
import { useAuth } from '../context/authContext'; // Import the useAuth hook

const Modal = () => {
  const placesLib = useMapsLibrary('places');
  const categories = useSelector(selectCategories);

  const [description, setDescription] = useState('');
  const [visited, setVisited] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('Place');
  const dispatch = useDispatch();
  const { user } = useAuth(); // Use the useAuth hook

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
  }, [placesLib]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.NEXT_PUBLIC_GOOGLEAPI_API_KEY}`);
    const data = await response.json();
    const coords = data.results[0].geometry.location;

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

    try {
      const docId = await writeToFirestore(`users/${user.uid}/pins`, newPin);
      const completePin: Pin = { ...newPin, id: docId };
      dispatch(addPin(completePin));
    } catch (error) {
      console.error('Error writing document: ', error);
    }

    setDescription('');
    setAddress('');
    setTitle('');
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLEAPI_API_KEY ?? ''}>
      <div className={styles.form}>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Add Pin</button>
        </form>
      </div>
    </APIProvider>
  );
};

export default Modal;
