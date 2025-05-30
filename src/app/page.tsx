"use client";
import React, { useState } from "react";
import LogIn from "./components/AccountManagement/LogIn.tsx";
import SignUp from "./components/AccountManagement/SignUp.tsx";
import styles from "../app/Sass/Auth.module.scss";
import { useRequireAuth } from "./hooks/useRequiredAuth.ts";
import authImage from "../app/assets/authImage.png";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

const Page = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(true); // Toggle between log in and sign up

  const user = useRequireAuth();

  if (user.loading || user.user != null) {
    return (
      <div>
        <iframe
          className={styles.loadingAnimation}
          src="https://lottie.host/embed/6599d90e-2886-4785-86fc-f7fb10f4a8ad/gvM3MrH0Q5.json"
        ></iframe>
      </div>
    );
  } else if (user.user == null && user.loading === false) {
    return (
      <main className={styles["main"]}>
        <ToastContainer // Toast container for notifications
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="colored"
          transition={Bounce}
        />
        <div className={styles.infoPanel}>
          <div>
            <h2>Travel Trail</h2>
            <p>Welcome to Travel Trail Version 1.0 !</p>
            <p>
              A <span>free</span> advanced travel planner developed by me, Alex
              Tran as a way to plan my own japan trip. However feel free to use
              it as much as you like. Disclaimer: Travel Trail is still in early
              beta, so you may come across some unexpected bugs, please let me
              know if you find any!
            </p>

            <div className={styles.helpInfo}>
              <div className={styles.helpInfoImageWrapper}>
                <Image
                  src={authImage.src}
                  alt="Travel Trail tutorial illustration"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>

              <p>
                If your new to travel trail, you can press the question-mark
                button for a short tutorial; once you are logged in!
              </p>
            </div>
          </div>

          <div>
            <h4>Current Implemented Features</h4>
            <p>Interactive Google Maps</p>
            <p>Realtime Database</p>
            <p>Multiple Ways To Sort Places And Activities</p>
            <p>Integrated Social Media System To Share Information</p>
            <p>Download To CSV Avaliable</p>
            <p>Collaborative Lists</p>
            <p>Integrated Location Data AutoFill</p>
          </div>

          <div>
            <h4>Planned Features</h4>
            <p>Animations & Improved UI</p>
            <p>AI recommendations</p>
            <p>Recommendations based on proximity</p>
            <p>Import using excel</p>
          </div>
        </div>

        <main>
          <div className={styles["auth-container"]}>
            <div className={styles["toggle-buttons"]}>
              <button
                onClick={() => setIsLoggingIn(true)}
                className={isLoggingIn ? "active" : ""}
              >
                Log In
              </button>
              <button
                onClick={() => setIsLoggingIn(false)}
                className={!isLoggingIn ? "active" : ""}
              >
                Sign Up
              </button>
            </div>
            {isLoggingIn ? <LogIn /> : <SignUp />}
          </div>
        </main>
      </main>
    );
  }
};

export default Page;
