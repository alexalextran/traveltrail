import React, { useState } from 'react';
import styles from '../../Sass/FullScreen.module.scss';
import { Pin } from '../../types/pinData.ts';
import { Category } from '../../types/categoryData.ts';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import IconBar from '../ImageComponents/IconBar.tsx';
import Modal from './modal.tsx';
import AddCategoryModal from './addCategoryModal.tsx';
import { toggleEditModal, toggleFullScreen } from '../../store/toggleModals/toggleModalSlice.ts';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store.ts'; 
import CategoryComponent from './CategoryComponent.tsx';
import { useAuth } from '../../context/authContext.js';

interface FullScreenProps {
    pins: Pin[];
    categories: Category[];
}

function FullScreen({ pins, categories }: FullScreenProps) {
    const dispatch: AppDispatch = useDispatch(); // Use the typed version of useDispatch
    const responsiveConfig = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 1
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    const { user } = useAuth();
    const [child, setchild] = useState(<Modal />);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCategory, setselectedCategory] = useState(null as null | Category);

    var filteredPins = selectedCategory ? pins.filter(pin => pin.category === selectedCategory.categoryName) : pins;
    filteredPins = filteredPins.filter(pin =>
        pin.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredCategories = [...categories].sort((a, b) => a.categoryName.localeCompare(b.categoryName));

    return (
        <>
            <main className={styles.main}>
                <div className={styles.header}>
                    <h1>Travel Trail</h1>
                    <button className={styles.exitButton} onClick={() => {
                        dispatch(toggleFullScreen(false));
                        dispatch(toggleEditModal(false));
                    }}>X</button>
                </div>
                <div className={styles.content}>
                    <div className={styles.categories}>
                        <div className={styles.category} onClick={() => setselectedCategory(null)}>
                            <p>All</p>
                        </div>
                        {filteredCategories.map((category: Category, index: number) => (
                            <CategoryComponent key={index} category={category} setselectedCategory={setselectedCategory}/>
                        ))}
                    </div>
                    <div className={styles.pins}>
                        <div className={styles.searchQuery}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by title"
                            />
                            <button onClick={() => setSearchQuery('')}>Clear</button>
                        </div>
                        {filteredPins.map((pin: Pin, index: number) => {
                            const pinCategory = categories.find(category => category.categoryName === pin.category);
                            const categoryColor = pinCategory ? pinCategory.categoryColor : 'black';
                            return (
                                <div key={index} className={styles.pinContainer}>
                                    <div className={styles.pinInfo}>
                                        <h2>{pin.title}</h2>
                                        <p>{pin.address}</p>
                                        <p style={{ color: categoryColor, border: `2px solid ${categoryColor}` }}>{pin.category}</p>
                                        <p>{pin.visited ? "Visited" : "Unvisited"}</p>
                                        <p>{pin.description}</p>
                                    </div>
                                    {pin.imageUrls && pin.imageUrls.length > 0 && (
                                        <Carousel responsive={responsiveConfig} className={styles.carousel}>
                                            {pin.imageUrls.map((src, index) => (
                                                <img key={index} src={src} alt="" />
                                            ))}
                                        </Carousel>
                                    )}
                                    <IconBar setchild={setchild} pin={pin} color={'rgb(0,123,255)'}  enableImage={true}  />
                                </div>
                            );
                        })}
                    </div>
                    <div className={styles.form}>
                        <div className={styles.formBar}>
                            <button onClick={() => setchild(<Modal />)}>Add Pin</button>
                            <button onClick={() => setchild(<AddCategoryModal />)}>Add Category</button>
                        </div>
                        {child}
                    </div>
                </div>
            </main>
        </>
    );
}

export default FullScreen;
