import { Rating } from 'react-simple-star-rating';
// src/types/Pin.ts
export interface Pin {
    id: string;
    placeId: string;
    address: string;
    lat: number;
    lng: number;
    title: string;
    categoryId: string; 
    description?: string;
    category: string;
    visited: boolean;
    imageUrls?: string[];
    openingHours?: string;
    rating?: number;
    website?: string;
    displayName?: string;
  }
  
 