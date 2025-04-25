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
const categoryDeleted = "category_deleted";
const invalid_address = "invalid_address";
const invalidFileType = "invalid_file_type";
const invalidFileSize = "invalid_file_size";
const profileUpdated = "profile_updated";
const nameUpdated = "name_updated";
const accessLevelUpdated = "access_level_updated";
const userRemovedFromCollaborators = "user_removed_from_collaborators";
const acceptedCollaborativeRequest = "accepted_collaborative_request";
const declinedCollaborativeRequest = "declined_collaborative_request";
const invalidFriendCode = "invalid_friend_code";
const alreadyBeenAdded = "already_added";
const friendRequestSent = "friend_request_sent";


export const collaborationRequestSentToast = (friendName: string) => {
  toast.success(`Collaborative request sent to ${friendName}`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
    toastId: friendName,
  });
}

export const friendRequestSentToast = () => {
  toast.success("Friend request sent successfully!", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
}

export const alreadyAddedToast = (friendName: string) => {
  toast.error(`${friendName} has already been added as a friend`, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    toastId: alreadyBeenAdded,
  });
}

export const invalidFriendCodeToast = () => {
  toast.error("Invalid friend code. Please try again.", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
    toastId: invalidFriendCode,
  });
}

export const declinedCollaborativeRequestToast = (listName: string) => {
  toast.success(`Collaborative request declined for ${listName}`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
    toastId: declinedCollaborativeRequest,
  });
}

export const acceptedCollaborativeRequestToast = (listName: string) => {
  toast.success(`Collaborative request accepted for ${listName}`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
    toastId: listName,
  });
}

export const userRemovedFromCollaboratorsToast = (userDisplayName: string) => {
  toast.success(`${userDisplayName} removed from collaborators successfully!`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
    toastId: userRemovedFromCollaborators,
  });
}

export const accessLevelUpdatedToast = () => {
  toast.success(`Access level updated successfully!`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
    toastId: accessLevelUpdated,
  });
}

export const nameUpdatedToast = () => {
  toast.success(`Name updated successfully!`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
    toastId: nameUpdated,
  });
}

export const profileUpdatedToast = () => {
  toast.success(`Profile updated successfully!`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
    toastId: profileUpdated,
  });
}

export const invalidFileSizeToast = () => {
  toast.error(`File size is too large! Please upload a file smaller than 5MB`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
    toastId: invalidFileSize,
  });
}

export const invalidFileTypeToast = () => {
  toast.error(`Invalid file type! Please upload JPEG or PNG`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
    toastId: invalidFileType,
  });
}

export const invalidAdressToastEditPin = () => {
  toast.error(`Invalid Adress!`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
    toastId: invalid_address,
  });
};

export const pinUpdatedSuccessfullyToast = (pinTitle: string) => {
  toast.success(`${pinTitle} updated successfully!`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
    toastId: pinTitle,
  });
};

export const categoryDeletedToast = (categoryName: any) => {
  toast.success(`${categoryName} and all related pins deleted successfully!`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
    toastId: categoryName,
  });
};

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
