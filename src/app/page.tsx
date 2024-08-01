'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectEditModal } from './store/toggleModals/toggleModalSlice.ts';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import styles from '../app/Sass/Auth.module.scss';
import { useRequireAuth } from './hooks/useRequiredAuth.ts';

const Page = () => {
  const toggleEdit = useSelector(selectEditModal);
  const [isLoggingIn, setIsLoggingIn] = useState(true); // Toggle between log in and sign up

  const user = useRequireAuth();

  if(user.loading || user.user != null){
    return <div>
<iframe className={styles.loadingAnimation} src="https://lottie.host/embed/6599d90e-2886-4785-86fc-f7fb10f4a8ad/gvM3MrH0Q5.json"></iframe>
      
    </div>
  }

  else if( user.user == null && user.loading === false){ 
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
}

export default Page;
