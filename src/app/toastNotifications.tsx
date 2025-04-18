import { Bounce, toast } from "react-toastify";
import { setLocation } from "./store/location/locationSlice"; // adjust the path to your map slice
import { AppDispatch } from "./store/store";
import { ToastContentProps } from "react-toastify";
import { toggleCategoryModal } from "./store/toggleModals/toggleModalSlice";

const passwordsDoNotMatch = "password_DNM";
const accountSuccessfullyCreated = "account_created";
const emailInUse = "email_in_use";
const standardError = "standard_error";
const invalidDetails = "invalid_details";
const noCategories = "no_categories";
const invalidAdress = "invalid_address";
const categoryAdded = "category_added";
const noEmojiSelected = "no_emoji_selected";

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

export const invalidAdressToast = () => {
  toast.error(`Could not add a pin, please enter a valid address!`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
    toastId: invalidAdress,
    transition: Bounce,
  });
};

export const categoryAddedToast = () => {
  toast.success(`Category added successfully!`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
  });
};

export const noEmojiSelectedToast = () => {
  toast.error(`Please select an emoji`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
    toastId: noEmojiSelected,
    transition: Bounce,
  });
};
export const noCategoriesToast = (dispatch: AppDispatch) => {
  toast.error(
    ({ closeToast }: ToastContentProps) => (
      <div>
        Seems you don&apos;t have any categories, try adding some in the sidebar
        or using the button below
        <br />
        <button
          onClick={() => {
            dispatch(toggleCategoryModal(true));
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
          Add Categories!
        </button>
      </div>
    ),
    {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      toastId: noCategories,
      transition: Bounce,
    }
  );
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
