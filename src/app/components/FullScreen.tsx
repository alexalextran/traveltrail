import React from 'react';
import styles from '../Sass/FullScreen.module.scss';
import { Pin } from '../types/pinData';
import { Category } from '../types/categoryData';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import IconBar from '../components/iconBar';
import AddPinModal from './addPinModal';
import Modal from '../components/modal.tsx';

interface FullScreenProps {
    setfullScreen: any;
    pins: Pin[];
    categories: Category[];
}

export default function FullScreen({ setfullScreen, pins, categories }: FullScreenProps) {

    const responsiveConfig = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
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
      }


    return (
        <main className={styles.main}>
            <div className={styles.header}>
                <h1>Travel Trail</h1>
                <button className={styles.exitButton} onClick={() => setfullScreen(false)}>X</button>
            </div>
            <div className={styles.content}>
                <div className={styles.categories}>
                    {categories.map((category: Category, index: number) => (
                        <div key={index}>{category.categoryName}</div>
                    ))}
                </div>
                <div className={styles.pins}>
                    {pins.map((pin: Pin, index: number) => {
                        const pinCategory = categories.find(category => category.categoryName === pin.category);
                        const categoryColor = pinCategory ? pinCategory.categoryColor : 'black';

                        return (
                            <div key={index} className={styles.pinContainer}> {/* Flex container for pin info and carousel */}
                                <div className={styles.pinInfo}>
                                    
                                    <h2>{pin.title}</h2>
                                    <p>{pin.address}</p>
                                    <p style={{ color: categoryColor, border: `2px solid ${categoryColor}`}}>{pin.category}</p>
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
                                 <IconBar pin={pin} color={'rgb(0,123,255)'}/> 
                                
                            </div>
                        );
                    })}
                </div>
                    <h1>Map</h1>
                    <Modal fullScreen={true}/>
                </div>
        </main>
    );
}
