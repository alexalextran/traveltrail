// hooks/useRequiredAuth.js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/authContext';  // Adjust the path as needed

export const useRequireAuth = () => {
  const { user, loading } = useAuth();  // Ensure useAuth is correctly imported
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');  // Redirect to login page if not authenticated
    }else if (!loading && user) {
      router.push('/Dashboard');  // Redirect to dashboard if authenticated
}}, [user, loading, router]);

  return { user, loading };
};
