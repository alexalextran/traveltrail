import React, { useEffect, useState } from "react";
import styles from "../../Sass/addCategoryModal.module.scss";
import { ColorPicker, useColor } from "react-color-palette";
import { writeCategory } from "../../firebaseFunctions/Categories.ts";
import { useAuth } from "../../context/authContext.js";
import EmojiPicker from "emoji-picker-react";
import { Emoji } from "emoji-picker-react";
import { toggleCategoryModal } from "../../store/toggleModals/toggleModalSlice";
import { useSelector, useDispatch } from "react-redux";
import { selectCategoryModal } from "../../store/toggleModals/toggleModalSlice";
import { AppDispatch } from "@/app/store/store.ts";
import {
  standardErrorToast,
  categoryAddedToast,
  noEmojiSelectedToast,
} from "../../toastNotifications.tsx";
import { useSpring, animated, config } from "@react-spring/web";
import { useTransition } from "@react-spring/web";

export default function AddCategoryModal() {
  const [categoryToAdd, setcategoryToAdd] = useState("");
  const [color, setColor] = useColor("rgb(0,0,0)");
  const { user } = useAuth();
  const [emojiPicker, setEmojiPicker] = useState(true);
  const [selectedEmoji, setselectedEmoji] = useState<string>("");
  const dispatch: AppDispatch = useDispatch();
  const isCategoryModalOpen = useSelector(selectCategoryModal);
  const [isFlashing, setIsFlashing] = useState(false);

  // Modal animation

  // Form elements animation (staggered)
  const formItemsAnimation = useSpring({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    delay: 200,
    config: config.gentle,
  });

  // Picker transition animation
  const pickerTransition = useTransition(emojiPicker, {
    from: { opacity: 0, transform: "translateY(20px)" },
    enter: { opacity: 1, transform: "translateY(0)" },
    leave: { opacity: 0, transform: "translateY(-20px)" },
    config: config.gentle,
  });

  // Button hover animations
  const [buttonHoverProps, setButtonHover] = useSpring(() => ({
    scale: 1,
    config: config.wobbly,
  }));

  // Set up the flashing effect
  useEffect(() => {
    if (emojiPicker !== null) {
      const flashInterval = setInterval(() => {
        setIsFlashing((prev) => !prev);
      }, 500);
      return () => clearInterval(flashInterval);
    }
  }, [emojiPicker]);

  const addCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedEmoji === "") {
      noEmojiSelectedToast();
      return;
    }

    try {
      await writeCategory(`users/${user.uid}/categories`, {
        categoryName: categoryToAdd,
        categoryColor: color.hex,
        categoryEmoji: selectedEmoji,
      });

      categoryAddedToast();
      isCategoryModalOpen && dispatch(toggleCategoryModal(false));
    } catch (error) {
      standardErrorToast(String(error));
    }
  };

  // Style for the active button
  const activeButtonStyle = {
    backgroundColor: isFlashing ? "#0056b3" : "#003d80",
    transition: "background-color 0.4s ease",
  };

  return (
    <animated.main
      className={isCategoryModalOpen ? styles.main : styles.fullScreen}
    >
      <animated.h1 style={formItemsAnimation}>Add Category</animated.h1>
      <animated.form
        className={styles.form}
        onSubmit={(e) => addCategory(e)}
        style={formItemsAnimation}
      >
        <animated.div
          className={styles.inputContainer}
          style={
            {
              "--category-color": color.hex,
              opacity: formItemsAnimation.opacity.to((o) => `${o}`),
              transform: formItemsAnimation.y.to((y) => `translateY(${y}px)`),
            } as unknown as React.CSSProperties
          }
        >
          <input
            required
            type="text"
            placeholder="Enter category name"
            value={categoryToAdd}
            onChange={(e) => setcategoryToAdd(e.target.value)}
          />
          <Emoji unified={selectedEmoji} />
        </animated.div>

        <animated.div
          className={styles.buttonContainer}
          style={formItemsAnimation}
        >
          <animated.button
            type="button"
            onClick={() => setEmojiPicker(false)}
            style={!emojiPicker ? activeButtonStyle : {}}
            onMouseEnter={() => setButtonHover({ scale: 1.05 })}
            onMouseLeave={() => setButtonHover({ scale: 1 })}
            {...buttonHoverProps}
          >
            Color Picker
          </animated.button>
          <animated.button
            type="button"
            onClick={() => setEmojiPicker(true)}
            style={emojiPicker ? activeButtonStyle : {}}
            onMouseEnter={() => setButtonHover({ scale: 1.05 })}
            onMouseLeave={() => setButtonHover({ scale: 1 })}
            {...buttonHoverProps}
          >
            Emoji Picker
          </animated.button>
        </animated.div>

        <div style={{ width: "100%", height: "20em", position: "relative" }}>
          {pickerTransition((style, showEmojiPicker) =>
            showEmojiPicker ? (
              <animated.div
                style={{ ...style, position: "absolute", width: "100%" }}
              >
                <div className={isCategoryModalOpen ? styles.emojiPicker : ""}>
                  <EmojiPicker
                    onEmojiClick={(emojiData) => {
                      setselectedEmoji(emojiData.unified);
                    }}
                    categories={[]}
                    skinTonesDisabled={true}
                    previewConfig={{ showPreview: false }}
                    className={styles.emojiPicker}
                    height="20em"
                  />
                </div>
              </animated.div>
            ) : (
              <animated.div
                style={{ ...style, position: "absolute", width: "100%" }}
              >
                <div className={isCategoryModalOpen ? styles.modalContent : ""}>
                  <ColorPicker
                    color={color}
                    onChange={setColor}
                    hideInput={["hsv"]}
                    hideAlpha={true}
                  />
                </div>
              </animated.div>
            )
          )}
        </div>

        <animated.button type="submit" style={formItemsAnimation}>
          Add Category
        </animated.button>
      </animated.form>

      {isCategoryModalOpen && (
        <animated.button
          onClick={() => dispatch(toggleCategoryModal(false))}
          className={isCategoryModalOpen ? styles.exit : ""}
        >
          X
        </animated.button>
      )}
    </animated.main>
  );
}
