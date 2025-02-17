import React, { FunctionComponent, useState } from 'react';
import styles from '../../Sass/customPin.module.scss';
import { Category } from '@/app/types/categoryData';
import { Emoji, EmojiStyle } from 'emoji-picker-react';



interface CustomPinProps {
  category: Category;
  backgroundColor: string;
}

const CustomPin: FunctionComponent<CustomPinProps> = ({ category, backgroundColor }) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  return (
  
      <div className={styles.customPinIcon} style={{ backgroundColor: category?.categoryColor, opacity: backgroundColor }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => setClicked(!clicked)}>
              <Emoji unified={category?.categoryEmoji} size={18}/>
            
      </div>
   
  );
};

export default CustomPin;