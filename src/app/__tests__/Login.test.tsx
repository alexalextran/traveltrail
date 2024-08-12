import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../components/AccountManagement/LogIn';

// Mock the useAuth hook
const mockLogin = jest.fn();
jest.mock('../context/authContext', () => ({
  useAuth: () => ({
    login: mockLogin, // Mock login function
  }),
}));

describe('Login Component', () => {
  test('renders the component and displays the login form', () => {
    render(<Login />);

    // Check if the "Log In" heading is rendered
    expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();

    // Check if the email and password input fields are rendered
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

    // Check if the "Log In" button is rendered
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });




  test('handles input changes correctly', () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    // Simulate user typing in the email and password fields
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Check if the input values are updated correctly
    expect((emailInput as HTMLInputElement).value).toBe('test@example.com');
    expect((passwordInput as HTMLInputElement).value).toBe('password123');
  });


  

  test('calls the login function when the form is submitted', () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: /log in/i });

    // Simulate user typing in the email and password fields
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Simulate form submission
    fireEvent.click(loginButton);

    // Check if the login function was called with the correct arguments
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });
});