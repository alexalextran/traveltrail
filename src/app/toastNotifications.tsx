import { Bounce, toast } from "react-toastify";

const passwordsDoNotMatch = "password_DNM";
const accountSuccessfullyCreated = "account_created";
const emailInUse = "email_in_use";
const standardError = "standard_error";

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
