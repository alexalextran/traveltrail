import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectedPin } from '../store/pins/pinsSlice';
import styles from "../Sass/modal.module.scss";

export default function ImageModal() {
    const selectedPin = useSelector(selectSelectedPin);
    const images = selectedPin?.imageUrls;

    return (
        <div className={styles.imageModal}>
           {images.map((url, index) => (
    <div key={index} className={styles.imageDiv}>
        <img src={url} alt={`Image ${index}`} style={{ width: '100px', height: 'auto' }} />
        <div>
            <button>Delete</button>
        <button>Download</button>
        </div>
        
    </div>
))}
        </div>
    );
}
