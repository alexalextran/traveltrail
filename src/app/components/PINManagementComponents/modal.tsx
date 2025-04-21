import React, { useEffect, useState, useRef } from "react";
import Draggable from "react-draggable";
import styles from "../../Sass/modal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { Pin } from "../../types/pinData.ts";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { writeToFirestore } from "../../firebaseFunctions/writeDocument.ts";
import { Category } from "../../types/categoryData.ts";
import axios from "axios";
import { selectAddModal } from "../../store/toggleModals/toggleModalSlice.ts";
import { toggleAddModal } from "../../store/toggleModals/toggleModalSlice.ts";
import { selectFullScreen } from "../../store/toggleModals/toggleModalSlice.ts";
import { useAuth } from "../../context/authContext.js";
import { Rating } from "react-simple-star-rating";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { app } from "../../firebase.js";
import { showCenterMapToast } from "@/app/toastNotifications.tsx";
import {
  noCategoriesToast,
  invalidAdressToast,
  standardErrorToast,
} from "../../toastNotifications.tsx";
import { useSpring, animated, useTransition } from "@react-spring/web";

interface ModalProps {
  FullScreen: boolean;
}

const Modal = ({ FullScreen }: ModalProps) => {
  const placesLib = useMapsLibrary("places");
  const [categories, setcategories] = useState<Category[]>([]);
  const ShowAddModal = useSelector(selectAddModal);

  const [description, setDescription] = useState<string>("");
  const [visited, setVisited] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [openingHours, setOpeningHours] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [website, setWebsite] = useState<string>("");
  const [place, setplace] = useState<any>();
  const [photos, setPhotos] = useState<string[]>([]);

  const dispatch = useDispatch();
  const { user } = useAuth();

  const addressInputRef = useRef<HTMLInputElement | null>(null);

  const modalTransition = useTransition(ShowAddModal, {
    from: { opacity: 0, transform: "scale(0.9) !important" },
    enter: { opacity: 1, transform: "scale(1) !important" },
    leave: { opacity: 0, transform: "scale(0.9) !important" },
    config: {
      tension: 300,
      friction: 20,
      clamp: true,
    },
  });

  // Animation for the "+" button
  const buttonAnimation = useSpring({
    transform: ShowAddModal ? "rotate(45deg)" : "rotate(0deg)",
    config: { tension: 300, friction: 20 },
  });

  useEffect(() => {
    if (placesLib && addressInputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(
        addressInputRef.current
      );
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setplace(place);
          setAddress(place.formatted_address);
          place.website ? setWebsite(place.website) : setWebsite("");
          place.opening_hours && place.opening_hours.weekday_text
            ? setOpeningHours(place.opening_hours.weekday_text.join(" \n"))
            : setOpeningHours("");
        }
      });
    }
  }, [placesLib, ShowAddModal]);

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
  }, [user.uid]);

  useEffect(() => {
    if (categories.length === 0 && ShowAddModal) {
      noCategoriesToast(dispatch);
    }
  }, [ShowAddModal, categories.length, dispatch]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.NEXT_PUBLIC_GOOGLEAPI_API_KEY}`
    );
    const data = response.data;
    if (data.status === "ZERO_RESULTS") {
      invalidAdressToast();
      return;
    }
    const coords = data.results[0].geometry.location;

    const newPin: Omit<Pin, "id"> = {
      title: title,
      placeId: place.place_id || "",
      address: address,
      description: description,
      lat: coords.lat,
      lng: coords.lng,
      categoryId: category,
      category:
        categories.find((cat) => cat.CategoryID === category)?.categoryName ||
        "",
      visited: visited,
      imageUrls: photos,
      openingHours: openingHours,
      rating: rating,
      website: website,
    };

    writeToFirestore(user.uid, newPin)
      .then(() => {
        showCenterMapToast(coords.lat, coords.lng, dispatch);
      })
      .catch((error) => standardErrorToast(error));

    setDescription("");
    setAddress("");
    setTitle("");
    setOpeningHours("");
    setWebsite("");
    setRating(0);
  };

  const handleResetAllFields = () => {
    setRating(0);
    setDescription("");
    setAddress("");
    setTitle("");
    setOpeningHours("");
    setWebsite("");
    setCategory("");
    setVisited(false);
  };

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  if (FullScreen) {
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
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            <option value="">Select a category</option>
            {categories.map((category: Category, index: number) => (
              <option key={index} value={category.CategoryID}>
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
            placeholder="Opening Hours e.g Saturday: 11am - 8pm"
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
          <div className={styles.formButtons}>
            <button
              className={styles.clearbutton}
              type="button"
              onClick={handleResetAllFields}
            >
              Clear All
            </button>
            <button type="submit">Add Pin</button>
          </div>
        </form>
      </>
    );
  }

  return (
    <>
      {/* Button to open the modal with rotation animation */}
      <animated.button
        className={styles.button}
        onClick={() => {
          dispatch(toggleAddModal(!ShowAddModal));
        }}
        style={buttonAnimation}
      >
        <p>+</p>
      </animated.button>

      {modalTransition((style, item) =>
        item ? (
          <div className={styles.modalWrapper}>
            <Draggable
              bounds="parent"
              handle=".modal-handle"
              defaultPosition={{
                x: window.innerWidth / 1.5,
                y: window.innerHeight / 8,
              }}
            >
              <animated.div className={styles.modal} style={style}>
                <div className="modal-handle" style={{ cursor: "move" }}>
                  <h1>Add Pin</h1>
                  <p>Drag me here!</p>
                </div>

                {/* Button to close the modal */}
                <button
                  className={styles.close}
                  onClick={() => dispatch(toggleAddModal(false))}
                >
                  X
                </button>

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
                    onChange={(e) => {
                      setCategory(e.target.value);
                    }}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category: Category, index: number) => (
                      <option key={index} value={category.CategoryID}>
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
                    placeholder="Opening Hours e.g Saturday: 11am - 8pm"
                  />

                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="Related Website"
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                  />
                  <div className={styles.formButtons}>
                    <button
                      className={styles.clearbutton}
                      type="button"
                      onClick={handleResetAllFields}
                    >
                      Clear All
                    </button>
                    <button type="submit">Add Pin</button>
                  </div>
                </form>
              </animated.div>
            </Draggable>
          </div>
        ) : null
      )}
    </>
  );
};

export default Modal;
