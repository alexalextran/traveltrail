import React from 'react';
import styles from '../Sass/ListComponent.module.scss';
import { RiArrowRightDoubleFill } from "react-icons/ri";
import { HiOutlineArrowsExpand } from "react-icons/hi";
export default function ListComponent() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        Content
        </div>
        <div className={styles.hover}>
          <h3>Lists</h3>
          <div><RiArrowRightDoubleFill/></div>
          <div><HiOutlineArrowsExpand/></div>
        </div>
      
      
    </main>
  );
}
