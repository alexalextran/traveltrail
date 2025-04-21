import React, { useEffect, useState } from "react";
import styles from "../../Sass/sidebar.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { useSpring, useTransition, animated } from "@react-spring/web";
import { RiArrowRightDoubleFill } from "react-icons/ri";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import { app } from "../../firebase";
import { useAuth } from "../../context/authContext";

import PinItem from "./pinItem";
import AddCategoryModal from "./addCategoryModal";
import FullScreenComponent from "./FullScreen";

import { AppDispatch } from "../../store/store";
import {
  selectCategoryModal,
  selectFullScreen,
  toggleAddModal,
  toggleCategoryModal,
  toggleEditModal,
  toggleFullScreen,
} from "../../store/toggleModals/toggleModalSlice";

import { Pin } from "../../types/pinData";
import { Category } from "../../types/categoryData";
import { getContrastTextColor } from "../../utility";

function Sidebar({ pins }: { pins: Pin[] }) {
  // Local state
  const [extend, setExtend] = useState(false); // Sidebar expansion
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Active category
  const [toggleUnvisited, setToggleUnvisited] = useState<boolean | null>(null); // Visited toggle
  const [searchTerm, setSearchTerm] = useState(""); // Search filter
  const [categories, setCategories] = useState<Category[]>([]); // Firebase categories

  // Redux state
  const dispatch: AppDispatch = useDispatch();
  const fullScreen = useSelector(selectFullScreen);
  const isCategoryModalOpen = useSelector(selectCategoryModal);

  // Auth context
  const { user } = useAuth();

  // Filter pins by category, visit status, and search term
  let filteredPins = selectedCategory
    ? pins.filter((pin) => pin.category === selectedCategory)
    : pins;

  filteredPins =
    toggleUnvisited !== null
      ? filteredPins.filter((pin) => pin.visited === toggleUnvisited)
      : filteredPins;

  filteredPins = filteredPins.filter((pin) =>
    pin.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch categories from Firestore
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
      setCategories(fetchedCategories);
    });

    return () => unsubscribe();
  }, [user.uid]);

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Animate pin list transitions
  const transitions = useTransition(extend ? filteredPins : [], {
    from: { opacity: 0, x: -50 },
    enter: { opacity: 1, x: 0 },
    update: { opacity: 1, x: 0 },
    leave: { opacity: !extend ? 0 : 1, x: !extend ? -50 : 0 },
    config: { tension: 100, friction: 20 },
    keys: (pin: Pin) => pin.id,
  });

  // Animate expand arrow rotation
  const rotateStyle = useSpring({
    transform: extend ? "rotate(180deg)" : "rotate(0deg)",
    config: { tension: 170, friction: 30 },
  });

  return (
    <>
      {/* Sidebar container */}
      <main className={styles.main} style={{ left: extend ? "0vw" : "-32vw" }}>
        {/* Category Selector */}
        <div className={styles.categories}>
          <div
            className={styles.addCategoryBtn}
            onClick={() => dispatch(toggleCategoryModal(!isCategoryModalOpen))}
          >
            Add Category
          </div>

          {/* Show All category button */}
          <div
            onClick={() => setSelectedCategory(null)}
            style={{
              backgroundColor:
                selectedCategory === null ? "rgb(0,123,255)" : undefined,
              color: selectedCategory === null ? "white" : undefined,
            }}
          >
            Show All
          </div>

          {/* List of categories */}
          {categories.map((category: Category) => (
            <div
              key={category.CategoryID}
              onClick={() => setSelectedCategory(category.categoryName)}
              style={{
                backgroundColor:
                  selectedCategory === category.categoryName
                    ? category.categoryColor
                    : undefined,
                color:
                  selectedCategory === category.categoryName
                    ? getContrastTextColor(category.categoryColor)
                    : undefined,
              }}
            >
              {category.categoryName}
            </div>
          ))}
        </div>

        {/* Pin Items Section */}
        <div className={styles.pinItems}>
          {/* Visited / Unvisited Toggle Buttons */}
          <div className={styles.unNvisitedButtons}>
            <button
              style={{
                backgroundColor:
                  toggleUnvisited === true ? "lightGrey" : "white",
              }}
              onClick={() =>
                setToggleUnvisited(toggleUnvisited === true ? null : true)
              }
            >
              Visited
            </button>
            <button
              style={{
                backgroundColor:
                  toggleUnvisited === false ? "lightGrey" : "white",
              }}
              onClick={() =>
                setToggleUnvisited(toggleUnvisited === false ? null : false)
              }
            >
              Unvisited
            </button>
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search By Title"
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchBar}
          />

          {/* Animated list of pins */}
          {transitions((style, pin, _, index) => (
            <animated.div style={style} key={index}>
              <PinItem index={index} pin={pin} />
            </animated.div>
          ))}
        </div>

        {/* Sidebar Expand/FullScreen Controls */}
        <div className={styles.rightExtender}>
          {/* Expand Button */}
          <animated.div style={rotateStyle} onClick={() => setExtend(!extend)}>
            <RiArrowRightDoubleFill />
          </animated.div>

          {/* Fullscreen Button */}
          <div
            onClick={() => {
              dispatch(toggleFullScreen(true));
              dispatch(toggleEditModal(false));
              dispatch(toggleAddModal(false));
              dispatch(toggleCategoryModal(false));
            }}
          >
            <HiOutlineArrowsExpand />
          </div>
        </div>
      </main>

      {/* Modals */}
      {isCategoryModalOpen && <AddCategoryModal />}
      {fullScreen && (
        <FullScreenComponent pins={pins} categories={categories} />
      )}
    </>
  );
}

export default Sidebar;
