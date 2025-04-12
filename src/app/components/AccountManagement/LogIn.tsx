import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styles from '../../Sass/Auth.module.scss';
import { useAuth } from '../../context/authContext';
const LogIn: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const [loading, setloading] = useState(false)
  
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
      setloading(true)
      e.preventDefault();
      try {
     
        await login(email, password);
      } catch (error) {
        toast.error(`Invalid details, please try again`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }finally{
        setloading(false)
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
          placeholder=""
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button disabled={loading} type="submit">{loading ?  'Loading...' : 'Log In'}</button>
      </form>
    </div>
  );
};

export default LogIn;
