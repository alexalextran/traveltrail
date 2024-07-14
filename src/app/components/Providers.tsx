// src/components/Providers.tsx
'use client';
import { AuthProvider } from '../context/authContext.js';
import { Provider } from 'react-redux';
import store from '../store/store';

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider><Provider store={store}>{children}</Provider></AuthProvider>

)};

export default Providers;
