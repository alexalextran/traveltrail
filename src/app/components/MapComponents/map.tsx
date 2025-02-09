'use client';
import { APIProvider, Map, AdvancedMarker, MapCameraProps, MapCameraChangedEvent } from '@vis.gl/react-google-maps';
import PinComponent from './pin.tsx';
import { useSelector, useDispatch } from 'react-redux';
import { selectPins } from '../../store/pins/pinsSlice.ts';
import { fetchPins } from '../../store/pins/pinsSlice.ts';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { AppDispatch } from '../../store/store.ts'; // Import the AppDispatch type
import useGeolocation from '../../hooks/useGeolocation.ts'; // Import the custom hook
import { MdPersonPinCircle } from "react-icons/md";
import styles from '../../Sass/page.module.scss';
import { selectLocation } from '../../store/location/locationSlice.ts';
import { selectCategories } from '../../store/categories/categoriesSlice.ts';
import { useAuth } from '../../context/authContext.js'; // Import the useAuth hook
import { ToastContainer } from 'react-toastify';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';
import { app } from "../../firebase.js"; // Ensure this path is correct
import { Category } from '../../types/categoryData.ts';
import { Pin } from '../../types/pinData.ts';
import 'react-toastify/dist/ReactToastify.css';
import CustomPin from './customPin.tsx';
const MapComponent = ({pins}: {pins: Pin[]}) => {

  const dispatch = useDispatch<AppDispatch>();
  const { location, error } = useGeolocation();
  const locationRedux = useSelector(selectLocation);
  const { user, logout } = useAuth(); // Use the useAuth hook
  const [categories, setcategories] = useState<Category[]>([]);

  useEffect(() => {
    setCameraProps(prevCameraProps => ({
      ...prevCameraProps,
      center: { lat: locationRedux.lat, lng: locationRedux.lng }
    }));
  }, [locationRedux.lat, locationRedux.lng]);

  useEffect(() => {
    dispatch(fetchPins(user.uid));
  
    
  }, []);


 

  useEffect(() => {
    const db = getFirestore(app);
    const listCollectionRef = collection(db, `users/${user.uid}/categories`);
    const unsubscribe = onSnapshot(listCollectionRef, (snapshot) => {
        const fetchedCategories = snapshot.docs.map(doc => ({
            CategoryID: doc.id,
            categoryName: doc.data().categoryName,
            categoryColor: doc.data().categoryColor, // Fix the typo in the property name
            categoryEmoji: doc.data().categoryEmoji
        }));
        setcategories(fetchedCategories);
    });

    return () => unsubscribe(); // Clean up the subscription
}, []);

  const INITIAL_CAMERA = useMemo(() => ({
    center: { lat: location.lat, lng: location.lng },
    zoom: 5
  }), [location.lat, location.lng]);

  const [cameraProps, setCameraProps] = useState<MapCameraProps>(INITIAL_CAMERA);

  const handleCameraChange = useCallback((ev: MapCameraChangedEvent) => {
    setCameraProps(ev.detail);
  }, []);

  const centerCamera = () => {
    setCameraProps({
      center: { lat: location.lat, lng: location.lng },
      zoom: 13
    });
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLEAPI_API_KEY ?? ''}>
         <ToastContainer />
      <Map
        onCameraChanged={handleCameraChange}
        {...cameraProps}
        mapId={'efa788b3413cc48d'}
        style={{ width: '100vw', height: '100vh', right: '0', position: 'absolute', overflowY: 'hidden' }}
        defaultCenter={INITIAL_CAMERA.center}
        defaultZoom={INITIAL_CAMERA.zoom}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
         <button className={styles.centerButton} onClick={centerCamera}>Click To Center</button>
         <button className={styles.MobileLogout} onClick={() => logout()}>Logout</button>

        {pins.map((pin) => {
          const categoryProp = categories.find(category => category.categoryName === pin.category);
          if (!categoryProp) {
            // Handle the case when the category is not found
            return null;
          }
          return (
            <PinComponent key={pin.id} category={categoryProp} pinID={pin.id} lat={pin.lat} lng={pin.lng} userLocation={INITIAL_CAMERA.center} pin={pin} />
          );
        })}
         <AdvancedMarker position={{ lat: location.lat, lng: location.lng }}>
          <MdPersonPinCircle className={styles.svg}/>
        </AdvancedMarker> 

      </Map>
    </APIProvider>
  );
};

export default MapComponent;
