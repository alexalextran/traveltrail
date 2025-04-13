import { Bounce, toast } from "react-toastify";
import { setLocation } from "./store/location/locationSlice"; // adjust the path to your map slice
import { AppDispatch } from "./store/store";
import { ToastContentProps } from "react-toastify";
import { useDispatch } from "react-redux";

const passwordsDoNotMatch = "password_DNM";
const accountSuccessfullyCreated = "account_created";
const emailInUse = "email_in_use";
const standardError = "standard_error";
const invalidDetails = "invalid_details";

export const passwordsDontMatchToast = () => {
  toast.error(`Passwords do not match!`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
    toastId: passwordsDoNotMatch,
    transition: Bounce,
  });
};

export const accountCreatonToast = () => {
  toast.success(`Account creation successful`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    toastId: accountSuccessfullyCreated,
  });
};

export const emailInUseToast = () => {
  toast.error("The email address is already in use by another account.", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
    toastId: emailInUse,
  });
};

export const standardErrorToast = (errorMessage: string) => {
  toast.error(errorMessage, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
    toastId: standardError,
    transition: Bounce,
  });
};

export const invalidDetailsToast = () => {
  toast.error(`Invalid details, please try again`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
    toastId: invalidDetails,
    transition: Bounce,
  });
};

export const showCenterMapToast = (
  lat: number,
  lng: number,
  dispatch: AppDispatch,
  toastId: string = `center-map-${lat}-${lng}` // Unique toast ID for each location
) => {
  toast.success(
    ({ closeToast }: ToastContentProps) => (
      <div>
        Pin added successfully!
        <br />
        <button
          onClick={() => {
            dispatch(setLocation({ lat, lng }));
            closeToast?.(); // Close toast after action
          }}
          style={{
            marginTop: "0.5rem",
            padding: "0.25rem 0.75rem",
            background: "rgb(0,123,255)",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Take me to the pin!
        </button>
      </div>
    ),
    {
      position: "top-right",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "light",
      toastId,
      transition: Bounce,
    }
  );
};
