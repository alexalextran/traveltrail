'use client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPin } from '../app/store/pins/pinsSlice.ts';
import Map from './components/map.tsx';
import { Pin } from '../app/types/pinData.ts';
import { get } from 'http';
import Sidebar from './components/sidebar.tsx';
import styles from './Sass/page.module.scss'
import Modal from './components/modal.tsx';
import { APIProvider } from '@vis.gl/react-google-maps';

const Page = () => 
  



    <>
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLEAPI_API_KEY ?? ''}>

     <Modal />
      <Sidebar />
      <Map />
      </APIProvider>

     
    </>
  


export default Page;
