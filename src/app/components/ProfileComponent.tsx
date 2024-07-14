import React from 'react'
import styles from '../Sass/ProfileComponent.module.scss'
import { useAuth } from '../context/authContext';  // Adjust the path as needed

export default function ProfileComponent() {
    const { logout } = useAuth();
  return (
    <main className={styles.main}>
        <button onClick={() => logout()}>Logout</button>
    </main>
  )
}
