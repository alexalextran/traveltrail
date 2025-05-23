import React, { useState } from "react";
import { useAuth } from "../../context/authContext"; // Ensure this path is correct
import styles from "../../Sass/Auth.module.scss";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "../../firebase"; // Ensure this path is correct
import {
  passwordsDontMatchToast,
  accountCreatonToast,
  emailInUseToast,
  standardErrorToast,
} from "../../toastNotifications";
const SignUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setdisplayName] = useState("");
  const { signup } = useAuth();
  const [loading, setloading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      //check if passwords match
      passwordsDontMatchToast();
      return;
    }
    try {
      setloading(true);
      const userCredential = await signup(email, password);
      const userDocRef = doc(getFirestore(app), `users/${userCredential}`);
      await setDoc(userDocRef, {
        // create a user document in firetore with defualt profile picture and displayName
        displayName: displayName,
        photoURL:
          "https://firebasestorage.googleapis.com/v0/b/traveltrail-425604.appspot.com/o/defaultProfilePicture.png?alt=media&token=818be1d6-aef3-49f2-b237-0465920f2d8c",
      });
      accountCreatonToast();
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes("email-already-in-use")) {
        //check if email is already in use
        emailInUseToast();
      } else {
        standardErrorToast(errorMessage); //handle other errors
      }
    } finally {
      setloading(false); //reset signup button to default state
    }
  };

  return (
    <div className={styles["auth-form"]}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="displayName"
          value={displayName}
          onChange={(e) => setdisplayName(e.target.value)}
          placeholder="Display Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (Min 6 characters)"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password (Min 6 characters)"
          required
        />
        <button disabled={loading} type="submit">
          {loading ? "Loading..." : "Sign Up"}{" "}
          {/* Button text changes based on loading state */}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
