import React, { useState } from 'react';
import { useAuth } from '../../context/authContext'; // Ensure this path is correct
import styles from '../../Sass/Auth.module.scss';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { app } from "../../firebase"; // Ensure this path is correct
import { toast } from 'react-toastify';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setdisplayName] = useState('');
  const { signup} = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(`Passwords do not match!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    try {
      const userCredential = await signup(email, password);
      const userDocRef = doc(getFirestore(app), `users/${userCredential}`);
      await setDoc(userDocRef, { displayName: displayName });
      toast.success(`Account creation successful`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error('Error signing up:', error);
      const errorMessage = (error as Error).message;
      toast.error(`Password should be at least 6 characters`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className={styles['auth-form']}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
      <input
          type="displayName"
          value={displayName}
          onChange={(e) => setdisplayName(e.target.value)}
          placeholder="Display Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (Min 6 characters)"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password (Min 6 characters)"
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
