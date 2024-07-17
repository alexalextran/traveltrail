import React, { useEffect, useState } from 'react';
import styles from '../Sass/ProfileComponent.module.scss';
import SocialMediaComponent from './SocialMediaComponent.tsx';
import AccountManagementComponent from './AccountManagementComponent.tsx';

export default function ProfileComponent() {
   const [toggleSocialMedia, settoggleSocialMedia] = useState(false)


    

    return (
        <div className={styles.profileContainer}>
            <div className={styles.accountButtons}>
            <button onClick={() => settoggleSocialMedia(true)}>Friends</button>
            <button onClick={() => settoggleSocialMedia(false)}>Account</button>
            </div>
           {
            toggleSocialMedia ? <SocialMediaComponent/> : <AccountManagementComponent/>
           }

        </div>
    );
}
