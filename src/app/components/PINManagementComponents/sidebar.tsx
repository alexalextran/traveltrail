import React, { useEffect, useState } from "react";
import styles from "../../Sass/sidebar.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { Pin } from "../../types/pinData";
import PinItem from "./pinItem";
import AddCategoryModal from "./addCategoryModal";
import { Category } from "../../types/categoryData";
import { AppDispatch } from "../../store/store";
import { RiArrowRightDoubleFill } from "react-icons/ri";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import FullScreenComponent from "./FullScreen";
import {
  selectCategoryModal,
  selectFullScreen,
} from "../../store/toggleModals/toggleModalSlice";
import {
  toggleFullScreen,
  toggleEditModal,
  toggleAddModal,
  toggleCategoryModal,
} from "../../store/toggleModals/toggleModalSlice";
import { useAuth } from "../../context/authContext";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { app } from "../../firebase";
import { useTransition, animated, useSpring } from "@react-spring/web";

function Sidebar({ pins }: { pins: Pin[] }) {
  const [extend, setExtend] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<null | string>(null);
  const [toggleUnvisited, setToggleUnvisited] = useState<null | boolean>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const dispatch: AppDispatch = useDispatch();
  const fullScreen = useSelector(selectFullScreen);
  const { user } = useAuth();
  const [categories, setcategories] = useState<Category[]>([]);
  const isCategoryModalOpen = useSelector(selectCategoryModal);

  let filteredPins = selectedCategory
    ? pins.filter((pin) => pin.category === selectedCategory)
    : pins;
  filteredPins =
    toggleUnvisited != null
      ? filteredPins.filter((pin) => pin.visited === toggleUnvisited)
      : filteredPins;
  filteredPins = filteredPins.filter((pin) =>
    pin.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const transitions = useTransition(extend ? filteredPins : [], {
    from: { opacity: 0, x: -50 },
    enter: { opacity: 1, x: 0 },
    update: { opacity: 1, x: 0 },
    config: { tension: 100, friction: 20 },
    keys: (pin: Pin) => pin.id,
  });

  const rotateStyle = useSpring({
    transform: extend ? "rotate(180deg)" : "rotate(0deg)",
    config: { tension: 170, friction: 30 },
  });

  return (
    <>
      <main className={styles.main} style={{ left: extend ? "0vw" : "-32vw" }}>
        <div className={styles.categories}>
          <div
            className={styles.addCategoryBtn}
            onClick={() => dispatch(toggleCategoryModal(!isCategoryModalOpen))}
          >
            Add Category
          </div>
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
          {categories.map((category: Category) => (
            <div
              key={category.CategoryID}
              onClick={() => setSelectedCategory(category.categoryName)}
              style={{
                backgroundColor:
                  selectedCategory === category.categoryName
                    ? "rgb(0,123,255)"
                    : undefined,
                color:
                  selectedCategory === category.categoryName
                    ? "white"
                    : undefined,
              }}
            >
              {category.categoryName}
            </div>
          ))}
        </div>
        <div className={styles.pinItems}>
          <div className={styles.unNvisitedButtons}>
            <button
              style={{
                backgroundColor:
                  toggleUnvisited === true ? "lightGrey" : "white",
              }}
              onClick={() =>
                toggleUnvisited === true
                  ? setToggleUnvisited(null)
                  : setToggleUnvisited(true)
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
                toggleUnvisited === false
                  ? setToggleUnvisited(null)
                  : setToggleUnvisited(false)
              }
            >
              Unvisited
            </button>
          </div>
          <input
            type="text"
            placeholder="Search By Title"
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchBar}
          />
          {transitions((style, pin, _, index) => (
            <animated.div style={style}>
              <PinItem key={index} index={index} pin={pin} />
            </animated.div>
          ))}
        </div>
        <div className={styles.rightExtender}>
          <animated.div
            style={rotateStyle}
            onClick={() => {
              setExtend(!extend);
            }}
          >
            <RiArrowRightDoubleFill />
          </animated.div>

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
      {isCategoryModalOpen && <AddCategoryModal />}
      {fullScreen && (
        <FullScreenComponent pins={pins} categories={categories} />
      )}
    </>
  );
}

export default Sidebar;
