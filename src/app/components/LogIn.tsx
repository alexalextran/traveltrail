import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../firebase'; // Ensure this path is correct
import styles from '../Sass/Auth.module.scss';
import { useAuth } from '../context/authContext';
const LogIn: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
  
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        console.log(email, password)
        await login(email, password);
      } catch (error) {
        console.error('Error logging in:', error);
      }
    };

  return (
    <div className={styles['auth-form']}>
      <h2>Log In</h2>
      <form onSubmit={handleLogin}>
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
          placeholder="Password"
          required
        />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default LogIn;
