import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, app } from '../firebase';  // Adjust the path as needed based on your folder structure

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Successfully signed up
      console.log('Signed up:', userCredential.user);
      return userCredential.user.uid; // Return the user ID
    } catch (error) {
      console.error('Error signing up:', error);
      throw error; // Rethrow the error to propagate it to the caller
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Successfully signed in
      console.log('Signed in:', userCredential.user);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error; // Rethrow the error to propagate it to the caller
    }
  };
  
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{login, user, signup, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
