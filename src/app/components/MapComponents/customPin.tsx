import React, { FunctionComponent, useState } from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import styles from '../../Sass/customPin.module.scss';

interface Props {
    position: {
      lat: number;
      lng: number;
    };
}

const CustomPin: FunctionComponent<Props> = ({ position }) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  return (
    <AdvancedMarker
      position={position}
      title={'Custom Pin with Pizza Emoji'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={styles.customPin}
      onClick={() => setClicked(!clicked)}
    >
      <div className={styles.customPinIcon}>
        <span className={styles.emoji}>🍕</span>
      </div>
    </AdvancedMarker>
  );
};

export default CustomPin;