import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../components/AccountManagement/LogIn";
import { toast } from "react-toastify";
import "@testing-library/jest-dom";
import { act } from "react";
// Mock the useAuth hook
const mockLogin = jest.fn();
jest.mock("../context/authContext", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

// Mock the toast
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the component and displays the login form", () => {
    render(<Login />);
    expect(
      screen.getByRole("heading", { name: /log in/i })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  test("handles input changes correctly", () => {
    render(<Login />);
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    expect((emailInput as HTMLInputElement).value).toBe("test@example.com");
    expect((passwordInput as HTMLInputElement).value).toBe("password123");
  });

  test("calls the login function when the form is submitted", async () => {
    render(<Login />);
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: /log in/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(loginButton);
    });

    expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
  });

  test("displays an invalid login error toast when login fails", async () => {
    mockLogin.mockRejectedValueOnce(
      new Error("FirebaseError: Firebase: Error (auth/invalid-credential).")
    );

    render(<Login />);
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: /log in/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Invalid details, please try again",
        expect.any(Object)
      );
    });
  });

  test("displays an standard error toast when login fails", async () => {
    mockLogin.mockRejectedValueOnce(new Error("error"));

    render(<Login />);
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: /log in/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "An unexpected error occurred. Please try again later."
      );
    });
  });

  test("displays loading text while submitting form", async () => {
    mockLogin.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<Login />);
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: /log in/i });

    act(() => {
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(loginButton);
    });

    expect(screen.getByText(/loading.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });

  test("disables the button when loading", async () => {
    render(<Login />);
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: /log in/i });
    expect(loginButton).not.toBeDisabled();

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(loginButton).toBeDisabled();
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });
});
