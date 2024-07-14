'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectEditModal } from './store/toggleModals/toggleModalSlice.ts';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import styles from '../app/Sass/Auth.module.scss';

const Page = () => {
  const toggleEdit = useSelector(selectEditModal);
  const [isLoggingIn, setIsLoggingIn] = useState(true); // Toggle between log in and sign up

  return (
    <main className={styles['main']} >
    <div className={styles['auth-container']}>
      <div className={styles['toggle-buttons']}>
        <button
          onClick={() => setIsLoggingIn(true)}
          className={isLoggingIn ? 'active' : ''}
        >
          Log In
        </button>
        <button
          onClick={() => setIsLoggingIn(false)}
          className={!isLoggingIn ? 'active' : ''}
        >
          Sign Up
        </button>
      </div>
      {isLoggingIn ? <LogIn /> : <SignUp />}
    </div>
    </main>
  );
};

export default Page;
