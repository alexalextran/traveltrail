import React, { useState } from "react";
import styles from "../../Sass/addCategoryModal.module.scss";
import { ColorPicker, useColor } from "react-color-palette";
import { writeCategory } from "../../firebaseFunctions/Categories.ts";
import { useAuth } from "../../context/authContext.js";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { toggleCategoryModal } from "../../store/toggleModals/toggleModalSlice";
import { useSelector, useDispatch } from "react-redux";
import { selectCategoryModal } from "../../store/toggleModals/toggleModalSlice";
import { AppDispatch } from "@/app/store/store.ts";

export default function AddCategoryModal() {
  const [categoryToAdd, setcategoryToAdd] = useState("");
  const [color, setColor] = useColor("rgb(0,0,0)");
  const { user } = useAuth();
  const [emojiPicker, setEmojiPicker] = useState(true);
  const [selectedEmoji, setselectedEmoji] = useState<string>("");
  const dispatch: AppDispatch = useDispatch();
  const isCategoryModalOpen = useSelector(selectCategoryModal);

  const addCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await writeCategory(`users/${user.uid}/categories`, {
        categoryName: categoryToAdd,
        categoryColor: color.hex,
        categoryEmoji: selectedEmoji,
      });

      toast.success("Category added successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      isCategoryModalOpen && dispatch(toggleCategoryModal(false)); //close the category modal once a pin is added successfully
    } catch (error) {
      toast.error("There has been an issue, please notify the owner!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <main className={isCategoryModalOpen ? styles.main : styles.fullScreen}>
      <h1>Add Category</h1>
      <form className={styles.form} onSubmit={(e) => addCategory(e)}>
        <div
          className={styles.inputContainer}
          style={{ "--category-color": color.hex } as React.CSSProperties}
        >
          <input
            required
            type="text"
            placeholder="Enter category name"
            value={categoryToAdd}
            onChange={(e) => setcategoryToAdd(e.target.value)}
          />
          <Emoji unified={selectedEmoji} />
        </div>

        <div className={styles.buttonContainer}>
          <button type="button" onClick={() => setEmojiPicker(false)}>
            Color Picker
          </button>
          <button type="button" onClick={() => setEmojiPicker(true)}>
            Emoji Picker
          </button>
        </div>
        {emojiPicker ? (
          <div className={isCategoryModalOpen ? styles.emojiPicker : ""}>
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                setselectedEmoji(emojiData.unified);
                console.log(emojiData.unified);
              }}
              categories={[]}
              skinTonesDisabled={true}
              previewConfig={{ showPreview: false }}
              className={styles.emojiPicker}
              height="20em"
            />
          </div>
        ) : (
          <div className={isCategoryModalOpen ? styles.modalContent : ""}>
            <ColorPicker
              color={color}
              onChange={setColor}
              hideInput={["hsv"]}
              hideAlpha={true}
            />
          </div>
        )}

        <button type="submit">Add Category</button>
      </form>
      {isCategoryModalOpen && (
        <button
          onClick={() => dispatch(toggleCategoryModal(false))}
          className={isCategoryModalOpen ? styles.exit : ""}
        >
          X
        </button>
      )}
    </main>
  );
}
