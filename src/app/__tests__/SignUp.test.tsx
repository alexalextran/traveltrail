import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUp from "../components/AccountManagement/SignUp";
import { toast } from "react-toastify";
import "@testing-library/jest-dom";
import { act } from "react";

// Mock Firebase auth
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    // Mock auth methods here if needed
  })),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
}));

// Mock Firebase app
jest.mock("../firebase", () => ({
  app: {},
  auth: {},
}));

// Mock the useAuth hook
const mockSignUp = jest.fn();
jest.mock("../context/authContext", () => ({
  useAuth: () => ({
    signup: mockSignUp, // Mock signup function
  }),
}));

// Mock the toast
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock Firestore
const mockSetDoc = jest.fn();
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getFirestore: jest.fn(),
  setDoc: jest.fn(() => Promise.resolve()),
}));

describe("SignUp Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the component and displays the sign-up form", () => {
    render(<SignUp />);

    // Check if the "Sign Up" heading is rendered
    expect(
      screen.getByRole("heading", { name: /sign up/i })
    ).toBeInTheDocument();

    // Check if the display name, email, password, and confirm password input fields are rendered
    expect(screen.getByPlaceholderText("Display Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Password (Min 6 characters)")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirm Password (Min 6 characters)")
    ).toBeInTheDocument();

    // Check if the "Sign Up" button is rendered
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });

  test("handles input changes correctly", () => {
    render(<SignUp />);

    const displayNameInput = screen.getByPlaceholderText("Display Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText(
      "Password (Min 6 characters)"
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm Password (Min 6 characters)"
    );

    // Simulate user typing in the input fields
    fireEvent.change(displayNameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });

    // Check if the input values are updated correctly
    expect((displayNameInput as HTMLInputElement).value).toBe("Test User");
    expect((emailInput as HTMLInputElement).value).toBe("test@example.com");
    expect((passwordInput as HTMLInputElement).value).toBe("password123");
    expect((confirmPasswordInput as HTMLInputElement).value).toBe(
      "password123"
    );
  });

  test("calls the signup function when the form is submitted with valid data", async () => {
    mockSignUp.mockResolvedValueOnce("user123");

    render(<SignUp />);

    const displayNameInput = screen.getByPlaceholderText("Display Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText(
      "Password (Min 6 characters)"
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm Password (Min 6 characters)"
    );
    const signUpButton = screen.getByRole("button", { name: /sign up/i });

    // Simulate user typing in the input fields
    await act(async () => {
      fireEvent.change(displayNameInput, { target: { value: "Test User" } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "password123" },
      });
      fireEvent.click(signUpButton);
    });

    // Check if the signup function was called with the correct arguments
    expect(mockSignUp).toHaveBeenCalledWith("test@example.com", "password123");

    // Check if toast success was called
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Account creation successful",
        expect.any(Object)
      );
    });
  });

  test("displays an error when passwords do not match", async () => {
    render(<SignUp />);

    const displayNameInput = screen.getByPlaceholderText("Display Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText(
      "Password (Min 6 characters)"
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm Password (Min 6 characters)"
    );
    const signUpButton = screen.getByRole("button", { name: /sign up/i });

    // Simulate user typing in the input fields with mismatched passwords
    await act(async () => {
      fireEvent.change(displayNameInput, { target: { value: "Test User" } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "password456" },
      });
      fireEvent.click(signUpButton);
    });

    // Signup should not be called
    expect(mockSignUp).not.toHaveBeenCalled();

    // Check if toast error was called for password mismatch
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Passwords do not match!",
        expect.any(Object)
      );
    });
  });

  test("handles signup error correctly", async () => {
    // Mock signup to throw an error
    mockSignUp.mockRejectedValueOnce(
      new Error("Password should be at least 6 characters")
    );

    render(<SignUp />);

    const displayNameInput = screen.getByPlaceholderText("Display Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText(
      "Password (Min 6 characters)"
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm Password (Min 6 characters)"
    );
    const signUpButton = screen.getByRole("button", { name: /sign up/i });

    // Simulate user typing in the input fields
    await act(async () => {
      fireEvent.change(displayNameInput, { target: { value: "Test User" } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "short" } });
      fireEvent.change(confirmPasswordInput, { target: { value: "short" } });
      fireEvent.click(signUpButton);
    });

    // Check if toast error was called with the correct message
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Password should be at least 6 characters",
        expect.any(Object)
      );
    });
  });

  test("sets user document in Firestore after successful signup", async () => {
    // Make sure the mocked signup function returns the expected value
    mockSignUp.mockResolvedValueOnce("user123");

    // Mock the doc function to return a specific value
    const docMock = jest.requireMock("firebase/firestore").doc;
    docMock.mockReturnValueOnce("userDocRef");

    // Mock the setDoc function to resolve successfully
    const setDocMock = jest.requireMock("firebase/firestore").setDoc;
    setDocMock.mockResolvedValueOnce(undefined);

    render(<SignUp />);

    const displayNameInput = screen.getByPlaceholderText("Display Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText(
      "Password (Min 6 characters)"
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm Password (Min 6 characters)"
    );
    const signUpButton = screen.getByRole("button", { name: /sign up/i });

    // Simulate user typing in the input fields
    await act(async () => {
      fireEvent.change(displayNameInput, { target: { value: "Test User" } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.change(confirmPasswordInput, {
        target: { value: "password123" },
      });
      fireEvent.click(signUpButton);
    });

    // Verify that signup was called
    expect(mockSignUp).toHaveBeenCalledWith("test@example.com", "password123");

    // Allow promises to resolve
    await new Promise(process.nextTick);

    // Check if doc was called with the expected parameters
    expect(docMock).toHaveBeenCalled();

    // Check if setDoc was called
    await waitFor(() => {
      expect(setDocMock).toHaveBeenCalled();
    });
  });

  test("requires all fields to be filled", () => {
    render(<SignUp />);

    const signUpButton = screen.getByRole("button", { name: /sign up/i });
    const displayNameInput = screen.getByPlaceholderText("Display Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText(
      "Password (Min 6 characters)"
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm Password (Min 6 characters)"
    );

    // Check required attribute is present on all inputs
    expect(displayNameInput).toHaveAttribute("required");
    expect(emailInput).toHaveAttribute("required");
    expect(passwordInput).toHaveAttribute("required");
    expect(confirmPasswordInput).toHaveAttribute("required");

    // Attempt to submit with empty fields - browser validation should prevent submission
    fireEvent.click(signUpButton);

    // The signup function should not have been called
    expect(mockSignUp).not.toHaveBeenCalled();
  });
});

test("does not call signup if a user with the email already exists", async () => {
  // Mock signup to throw an error indicating the email is already in use
  mockSignUp.mockRejectedValueOnce({
    code: "auth/email-already-in-use",
    message: "The email address is already in use by another account.",
  });

  render(<SignUp />);

  const displayNameInput = screen.getByPlaceholderText("Display Name");
  const emailInput = screen.getByPlaceholderText("Email");
  const passwordInput = screen.getByPlaceholderText(
    "Password (Min 6 characters)"
  );
  const confirmPasswordInput = screen.getByPlaceholderText(
    "Confirm Password (Min 6 characters)"
  );
  const signUpButton = screen.getByRole("button", { name: /sign up/i });

  // Simulate user typing in the input fields
  await act(async () => {
    fireEvent.change(displayNameInput, { target: { value: "TestUser" } });
    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });
    fireEvent.click(signUpButton);
  });

  // Signup should be called once with the email and password
  expect(mockSignUp).toHaveBeenCalledWith("test@gmail.com", "password123");

  // Check if toast error was called with the appropriate message
  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith(
      "The email address is already in use by another account.",
      expect.any(Object)
    );
  });

  // Ensure setDoc is not called (since signup failed)
  const setDocMock = jest.requireMock("firebase/firestore").setDoc;
  expect(setDocMock).not.toHaveBeenCalled();
});
