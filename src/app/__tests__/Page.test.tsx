import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Page from "@/app/page";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import "@testing-library/jest-dom";

// Mock Firebase
jest.mock("@/app/firebase", () => ({
  app: {},
  auth: {},
  getAuth: jest.fn(),
}));

// Mock AuthContext
jest.mock("@/app/context/authContext", () => ({
  AuthContextProvider: ({ children }: { children: React.ReactNode }) =>
    children,
  useAuth: () => ({
    user: null,
    loading: false,
    logout: jest.fn(),
    login: jest.fn(),
    signup: jest.fn(),
  }),
}));

// Mock Redux
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

// Mock Auth Hook
jest.mock("@/app/hooks/useRequiredAuth", () => ({
  useRequireAuth: jest.fn(),
}));

// Mock toast
jest.mock("react-toastify", () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock child components
jest.mock("@/app/components/AccountManagement/LogIn", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-login">Login Form</div>,
}));

jest.mock("@/app/components/AccountManagement/SignUp", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-signup">Signup Form</div>,
}));

describe("Page Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSelector as unknown as jest.Mock).mockReturnValue(false);
  });

  const useRequireAuth = require("@/app/hooks/useRequiredAuth").useRequireAuth;

  test("redirects or hides auth UI when user is authenticated", () => {
    useRequireAuth.mockReturnValue({ loading: false, user: { uid: "123" } });

    render(<Page />);
    expect(screen.queryByTestId("mock-login")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mock-signup")).not.toBeInTheDocument();
  });

  test("renders login UI when unauthenticated", () => {
    useRequireAuth.mockReturnValue({ loading: false, user: null });

    render(<Page />);
    expect(screen.getByTestId("mock-login")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-signup")).not.toBeInTheDocument();
    expect(screen.getByText("Travel Trail")).toBeInTheDocument();
  });

  test("toggles to signup UI when Sign Up button is clicked", () => {
    useRequireAuth.mockReturnValue({ loading: false, user: null });

    render(<Page />);
    const signUpButton = screen.getByRole("button", { name: /sign up/i });
    fireEvent.click(signUpButton);

    expect(screen.getByTestId("mock-signup")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-login")).not.toBeInTheDocument();
  });

  test("toggles back to login UI when Log In button is clicked", () => {
    useRequireAuth.mockReturnValue({ loading: false, user: null });

    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(screen.getByTestId("mock-login")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-signup")).not.toBeInTheDocument();
  });
});
