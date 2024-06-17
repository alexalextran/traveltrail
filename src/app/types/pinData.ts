// src/types/Pin.ts
export interface Pin {
    id: string;
    address: string;
    lat: number;
    lng: number;
    title: string;
    description?: string;
    category: string;
    visited: boolean;
  }
  