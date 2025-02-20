import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Page from '@/app/page';
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import '@testing-library/jest-dom';

// Mock Firebase
jest.mock('@/app/firebase', () => ({
  app: {},
  auth: {},
  getAuth: jest.fn()
}));

// Mock AuthContext
jest.mock('@/app/context/authContext', () => ({
  AuthContextProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({
    user: null,
    loading: false,
    logout: jest.fn(),
    login: jest.fn(),
    signup: jest.fn()
  })
}));

// Mock the hooks and external dependencies
jest.mock('react-redux', () => ({
  useSelector: jest.fn()
}));

jest.mock('@/app/hooks/useRequiredAuth', () => ({
  useRequireAuth: jest.fn()
}));

jest.mock('react-toastify', () => ({
  ToastContainer: () => null,
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}));

// Mock the components that use Firebase
jest.mock('@/app/components/AccountManagement/LogIn', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-login">Login Form</div>
}));

jest.mock('@/app/components/AccountManagement/SignUp', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-signup">Signup Form</div>
}));

jest.mock('@/app/assets/authImage.png', () => ({
  src: 'mocked-image-path'
}));

describe('Page Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSelector as unknown as jest.Mock).mockReturnValue(false);
  });

  describe('Loading and Authentication States', () => {
    // test('shows loading animation when user is loading', () => {
    //   const useRequireAuth = require('@/app/hooks/useRequiredAuth').useRequireAuth;
    //   useRequireAuth.mockReturnValue({ loading: true, user: null });

    //   render(<Page />);
    //   expect(screen.getByTitle('loading-animation')).toBeInTheDocument();
    // });

    // test('shows loading animation when user is authenticated', () => {
    //   const useRequireAuth = require('@/app/hooks/useRequiredAuth').useRequireAuth;
    //   useRequireAuth.mockReturnValue({ loading: false, user: { id: '1' } });

    //   render(<Page />);
    //   expect(screen.getByTitle('loading-animation')).toBeInTheDocument();
    // });

    test('shows auth page when user is not authenticated and not loading', () => {
      const useRequireAuth = require('@/app/hooks/useRequiredAuth').useRequireAuth;
      useRequireAuth.mockReturnValue({ loading: false, user: null });

      render(<Page />);
      expect(screen.getByText('Travel Trail')).toBeInTheDocument();
      expect(screen.getByText(/Welcome to Travel Trail Version 0.9/i)).toBeInTheDocument();
    });
  });

  describe('Authentication UI Interaction', () => {
    beforeEach(() => {
      const useRequireAuth = require('@/app/hooks/useRequiredAuth').useRequireAuth;
      useRequireAuth.mockReturnValue({ loading: false, user: null });
    });

    test('toggles between login and signup forms', () => {
      render(<Page />);
      
      // Should show login form by default
      expect(screen.getByTestId('mock-login')).toBeInTheDocument();
      
      // Click signup button
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
      
      // Should now show signup form
      expect(screen.getByTestId('mock-signup')).toBeInTheDocument();
    });

    test('displays all feature sections', () => {
      render(<Page />);

      // Current features
      expect(screen.getByText('Current Implemented Features')).toBeInTheDocument();
      expect(screen.getByText('Interactive Google Maps')).toBeInTheDocument();
      expect(screen.getByText('Realtime Database')).toBeInTheDocument();

      // Planned features
      expect(screen.getByText('Planned Features')).toBeInTheDocument();
      expect(screen.getByText('Animations & Improved UI')).toBeInTheDocument();
      expect(screen.getByText('AI recommendations')).toBeInTheDocument();
    });

    test('renders auth image with correct source', () => {
      render(<Page />);
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', 'mocked-image-path');
    });
  });

  // describe('Component Styling', () => {
  //   beforeEach(() => {
  //     const useRequireAuth = require('@/app/hooks/useRequiredAuth').useRequireAuth;
  //     useRequireAuth.mockReturnValue({ loading: false, user: null });
  //   });

  //   test('applies correct CSS classes', () => {
  //     render(<Page />);
      
  //     expect(screen.getByTestId('auth-container')).toHaveClass('auth-container');
  //     expect(screen.getByTestId('toggle-buttons')).toHaveClass('toggle-buttons');
  //   });
  // });
});