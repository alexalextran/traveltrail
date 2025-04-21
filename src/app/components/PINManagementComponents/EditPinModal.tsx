import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedPin } from "../../store/pins/pinsSlice";
import styles from "../../Sass/modal.module.scss";
import { Category } from "../../types/categoryData";
import axios from "axios";
import { updateToFirestore } from "../../firebaseFunctions/writeDocument";
import { selectFullScreen } from "../../store/toggleModals/toggleModalSlice";
import { toggleEditModal } from "../../store/toggleModals/toggleModalSlice";
import Draggable from "react-draggable";
import { useAuth } from "../../context/authContext";
import { Rating } from "react-simple-star-rating";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { app } from "../../firebase";
import { toast } from "react-toastify";

function EditPinForm() {
  const placesLib = useMapsLibrary("places");

  const selectedPin = useSelector(selectSelectedPin);
  const [categories, setcategories] = useState<Category[]>([]);
  const FullScreen = useSelector(selectFullScreen);
  const { user } = useAuth();

  const [title, setTitle] = useState<string>(selectedPin?.title || "");
  const [address, setAddress] = useState<string>(selectedPin?.address || "");
  const [description, setDescription] = useState<string>(
    selectedPin?.description || ""
  );
  const [category, setCategory] = useState<string>(selectedPin?.category || "");
  const [visited, setVisited] = useState<boolean>(
    selectedPin?.visited || false
  );
  const [rating, setRating] = useState<number>(selectedPin?.rating || 0);
  const [website, setWebsite] = useState<string>(selectedPin?.website || "");
  const [openingHours, setOpeningHours] = useState<string>(
    selectedPin?.openingHours || ""
  );
  const [placeId, setplaceId] = useState<string>(selectedPin?.placeId || "");

  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  useEffect(() => {
    const db = getFirestore(app);
    const listCollectionRef = collection(db, `users/${user.uid}/categories`);
    const unsubscribe = onSnapshot(listCollectionRef, (snapshot) => {
      const fetchedCategories = snapshot.docs.map((doc) => ({
        CategoryID: doc.id,
        categoryName: doc.data().categoryName,
        categoryColor: doc.data().categoryColor,
        categoryEmoji: doc.data().categoryEmoji,
      }));
      setcategories(fetchedCategories);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedPin != null) {
      setTitle(selectedPin.title || "");
      setAddress(selectedPin.address || "");
      setDescription(selectedPin.description || "");
      setCategory(selectedPin.category || "");
      setVisited(selectedPin.visited || false);
      setRating(selectedPin.rating || 0);
      setOpeningHours(selectedPin.openingHours || "");
      setWebsite(selectedPin.website || "");
      handleRating(rating);
      setplaceId(selectedPin.placeId || "");
    }
  }, [selectedPin, rating]);

  useEffect(() => {
    if (placesLib && addressInputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(
        addressInputRef.current
      );
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setAddress(place.formatted_address);
        }
      });
    }
  }, [placesLib]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.NEXT_PUBLIC_GOOGLEAPI_API_KEY}`
    );
    const data = response.data;
    const coords = data.results[0].geometry.location;

    const updatedPin = {
      id: selectedPin?.id || "",
      title: title,
      address: address,
      description: description,
      lat: coords.lat,
      lng: coords.lng,
      category: category,
      visited: visited,
      imageUrls: selectedPin?.imageUrls || [],
      openingHours: openingHours,
      rating: rating,
      website: website,
      placeId: placeId,
    };

    try {
      await updateToFirestore(`users/${user.uid}/pins`, updatedPin);
      dispatch(toggleEditModal(false));

      toast.success("Pin was updated sucessfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      toast.error("Could not update the pin, please contact the owner!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1>Update Pin</h1>
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
          <option key={index} value={category.categoryName}>
            {category.categoryName}
          </option>
        ))}
      </select>

      <hr></hr>

      <i>Optional Fields</i>

      <div className={styles.visitedRating}>
        <label>
          <input
            type="checkbox"
            checked={visited}
            onChange={(e) => setVisited(e.target.checked)}
          />
          Visited
        </label>
        <Rating
          onClick={handleRating}
          initialValue={rating}
          allowFraction={true}
        />
      </div>

      <input
        type="text"
        value={openingHours}
        onChange={(e) => setOpeningHours(e.target.value)}
        placeholder="Opening Hours e.g 11am - 8pm"
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
      <button type="submit">Update Pin</button>
    </form>
  );

  const formContentFullScreen = (
    <div className={styles.modalWrapper}>
      <Draggable
        bounds="parent"
        handle=".modal-handle"
        defaultPosition={{
          x: window.innerWidth / 1.5,
          y: window.innerHeight / 6,
        }}
      >
        <div className={styles.modal}>
          <div className="modal-handle" style={{ cursor: "move" }}>
            <h1>Update Pin</h1>
            <p>Drag me here!</p>
          </div>

          <button
            className={styles.close}
            onClick={() => {
              dispatch(toggleEditModal(false));
            }}
          >
            X
          </button>

          <form onSubmit={handleSubmit} className={styles.form}>
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
                <option key={index} value={category.categoryName}>
                  {category.categoryName}
                </option>
              ))}
            </select>

            <hr></hr>

            <i>Optional Fields</i>

            <div className={styles.visitedRating}>
              <label>
                <input
                  type="checkbox"
                  checked={visited}
                  onChange={(e) => setVisited(e.target.checked)}
                />
                Visited
              </label>
              <Rating
                onClick={handleRating}
                initialValue={rating}
                allowFraction={true}
              />
            </div>
            <div></div>
            <input
              type="text"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              placeholder="Opening Hours e.g 11am - 8pm"
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
            <button type="submit">Update Pin</button>
          </form>
        </div>
      </Draggable>
    </div>
  );

  return FullScreen ? formContent : formContentFullScreen;
}

export default EditPinForm;
