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

const Page = () => 
  



    <>
     <Modal />
      <Sidebar />
      <Map />
     
     
    </>
  


export default Page;
