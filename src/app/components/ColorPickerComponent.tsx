import React from "react";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import styles from "../Sass/addCategoryModal.module.scss";
export default function ColorPickerComponent() {
  const [color, setColor] = useColor("rgb(86 30 203)");

  return (
      <div className={styles.modalContent}>
    <ColorPicker color={color} onChange={setColor} />
    </div>
    )
}