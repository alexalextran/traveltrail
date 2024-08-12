import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUp from '../components/AccountManagement/SignUp';
import { toast } from 'react-toastify';

// Mock the useAuth hook
const mockSignUp = jest.fn();
jest.mock('../context/authContext', () => ({
  useAuth: () => ({
    signup: mockSignUp, // Mock signup function
  }),
}));

// Mock the toast
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock Firebase authentication
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    createUserWithEmailAndPassword: jest.fn((email, password) => {
      if (email === 'test@example.com' && password === 'password123') {
        return Promise.resolve({ user: { uid: '12345' } });
      } else {
        return Promise.reject(new Error('Invalid details'));
      }
    }),
  })),
}));

describe('SignUp Component', () => {
  test('renders the component and displays the sign-up form', () => {
    render(<SignUp />);

    // Check if the "Sign Up" heading is rendered
    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();

    // Check if the display name, email, password, and confirm password input fields are rendered
    expect(screen.getByPlaceholderText('Display Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password (Min 6 characters)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password (Min 6 characters)')).toBeInTheDocument();

    // Check if the "Sign Up" button is rendered
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('handles input changes correctly', () => {
    render(<SignUp />);

    const displayNameInput = screen.getByPlaceholderText('Display Name');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password (Min 6 characters)');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password (Min 6 characters)');

    // Simulate user typing in the input fields
    fireEvent.change(displayNameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    // Check if the input values are updated correctly
    expect((displayNameInput as HTMLInputElement).value).toBe('Test User');
    expect((emailInput as HTMLInputElement).value).toBe('test@example.com');
    expect((passwordInput as HTMLInputElement).value).toBe('password123');
    expect((confirmPasswordInput as HTMLInputElement).value).toBe('password123');
  });

  test('calls the signup function when the form is submitted', () => {
    render(<SignUp />);

    const displayNameInput = screen.getByPlaceholderText('Display Name');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password (Min 6 characters)');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password (Min 6 characters)');
    const signUpButton = screen.getByRole('button', { name: /sign up/i });

    // Simulate user typing in the input fields
    fireEvent.change(displayNameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    // Simulate form submission
    fireEvent.click(signUpButton);

    // Check if the signup function was called with the correct arguments
    expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  

  
});