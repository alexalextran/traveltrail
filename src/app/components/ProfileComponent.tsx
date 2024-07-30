import React, { useState } from 'react';
import styles from '../Sass/ProfileComponent.module.scss';
import SocialMediaComponent from './SocialMediaComponent';
import AccountManagementComponent from './AccountManagementComponent';

export default function ProfileComponent() {
    const [toggleSocialMedia, setToggleSocialMedia] = useState(false);
    const [toggleModal, setToggleModal] = useState(false);

    return (
        <>
            {toggleModal ? (
                <div className={styles.profileContainer}>
                    <div className={styles.accountButtons}>
                        <button onClick={() => setToggleSocialMedia(true)}>Friends</button>
                        <button onClick={() => setToggleSocialMedia(false)}>Account</button>
                        <button onClick={() => setToggleModal(false)}>Close</button>

                    </div>
                    {toggleSocialMedia ? <SocialMediaComponent /> : <AccountManagementComponent />}
                </div>
            ) : (
                <button className={styles.profileButton} onClick={() => setToggleModal(true)}>SM</button>
            )}
        </>
    );
}
