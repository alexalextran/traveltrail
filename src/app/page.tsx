'use client';
import React, { useState } from 'react';
import Map from './components/map.tsx';

const Page = () => {
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Logic to handle the form submission and add the pin using the entered address
    console.log('Address:', address);
    // Reset the address input
    setAddress('');
  };

  return (
    <>
      <h1>Map</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address"
        />
        <button type="submit">Add Pin</button>
      </form>
      <Map />
    </>
  );
};

export default Page;