import React, { useEffect, useState } from 'react';
import styles from '../../Sass/ProfileComponent.module.scss';

interface Friend {
    friendID: string;
    displayName: string;
}

interface ManageFriendsProps {
    friends: Friend[];
    searchFriends: string;
    setSearchFriends: (value: string) => void;
}

const ManageFriendsComponent: React.FC<ManageFriendsProps> = ({ friends, searchFriends, setSearchFriends }) => {
    const [filteredFriends, setFilteredFriends] = useState<Friend[]>(friends);

    useEffect(() => {
        const filtered = friends.filter(friend =>
            friend.displayName.toLowerCase().includes(searchFriends.toLowerCase())
        );
        setFilteredFriends(filtered);
    }, [searchFriends, friends]);

    return (
        <div className={styles.friendsSection}>
            <h2>Friends</h2>
            <input
                type="text"
                placeholder="Search Friends"
                value={searchFriends}
                onChange={(e) => setSearchFriends(e.target.value)}
            />
            <ul>
                <h3>Manage Friends</h3>
                {filteredFriends.map((friend) => (
                    <li key={friend.friendID}>
                        <span>{friend.displayName}</span>
                        <button>View Profile</button>
                        <button>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageFriendsComponent;
