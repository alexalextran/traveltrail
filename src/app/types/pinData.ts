// src/types/Pin.ts
export interface Pin {
    id: string;
    lat: number;
    lng: number;
    title: string;
    description?: string;
    category: 'restaurant' | 'bar' | 'place';
  }
  