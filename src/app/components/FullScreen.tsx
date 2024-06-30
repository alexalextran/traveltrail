import React from 'react';
import styles from '../Sass/FullScreen.module.scss';
import { Pin } from '../types/pinData';
import { Category } from '../types/categoryData';

interface FullScreenProps {
    setfullScreen: any;
    pins: Pin[];
    categories: Category[];
}

export default function FullScreen({ setfullScreen, pins, categories }: FullScreenProps) {
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
                            <div key={index}>
                                <h2>{pin.title}</h2>
                                <p>{pin.address}</p>
                                <p style={{ color: categoryColor, border: `2px solid ${categoryColor}`}}>{pin.category}</p>
                                <p>{pin.visited ? "Visited" : "Unvisited"}</p>
                                <p>{pin.description}</p>
                            </div>
                        );
                    })}
                </div>
                <div className={styles.form}>
                    <h1>Map</h1>
                    <form>
                        <input type="text" placeholder="Enter Title" />
                        <input type="text" placeholder="Enter address" />
                        <select>
                            {categories.map((category: Category) => (
                                <option key={category.categoryName} value={category.categoryName}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                        <label>
                            <input type="checkbox" />
                            Visited
                        </label>
                        <textarea placeholder="Enter description" />
                        <button type="submit">Add Pin</button>
                    </form>
                </div>
            </div>
        </main>
    );
}
