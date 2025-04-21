// modal.test.tsx
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import Modal from "../components/PINManagementComponents/modal";
import { Provider } from "react-redux";
import { createTestStore } from "../../../test-utils";
import "@testing-library/jest-dom";
import axios from "axios";

// Mock Firebase initialization
jest.mock("../firebase.js", () => ({
  app: {}, // mock app object
  auth: { currentUser: { uid: "mock-user-id" } }, // mock auth
}));

// Mocks
jest.mock("../context/authContext", () => ({
  useAuth: () => ({
    user: { uid: "test-user-id" },
  }),
}));

// Create mock for place data with place_id
const mockPlace = {
  place_id: "test-place-id-123",
  formatted_address: "123 Test St",
  website: "http://test.com",
  opening_hours: {
    weekday_text: ["Mon: 9-5", "Tue: 9-5"],
  },
  geometry: {
    location: {
      lat: () => 10,
      lng: () => 20,
    },
  },
};

// Improved Google Maps mock
let autocompleteCallback: () => void;
global.google = {
  maps: {
    places: {
      Autocomplete: jest.fn().mockImplementation(() => ({
        addListener: jest.fn((event, callback) => {
          if (event === "place_changed") {
            autocompleteCallback = callback;
          }
          return jest.fn();
        }),
        getPlace: jest.fn(() => mockPlace),
      })),
    },
  },
} as any;

jest.mock("@vis.gl/react-google-maps", () => ({
  useMapsLibrary: jest.fn(() => ({
    places: {
      Autocomplete: global.google.maps.places.Autocomplete,
    },
  })),
}));

jest.mock("../firebaseFunctions/writeDocument", () => ({
  writeToFirestore: jest.fn(() => Promise.resolve()),
}));

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getFirestore: jest.fn(() => ({
    // Mock Firestore methods
  })),
  onSnapshot: jest.fn((_, callback) => {
    callback({
      docs: [
        {
          id: "cat1",
          data: () => ({
            categoryName: "Food",
            categoryColor: "#FF0000",
            categoryEmoji: "🍔",
          }),
        },
        {
          id: "cat2",
          data: () => ({
            categoryName: "Shopping",
            categoryColor: "#00FF00",
            categoryEmoji: "🛍️",
          }),
        },
      ],
    });
    return jest.fn(); // unsubscribe
  }),
}));

jest.mock("../toastNotifications", () => ({
  showCenterMapToast: jest.fn(),
  noCategoriesToast: jest.fn(),
  invalidAdressToast: jest.fn(),
  standardErrorToast: jest.fn(),
}));

const renderWithStore = (modalsState = {}) => {
  const store = createTestStore({
    modals: {
      // Use `modals` instead of `toggleModals`
      addModal: true,
      fullScreen: false,
      ...modalsState,
    },
  });
  return render(
    <Provider store={store}>
      <Modal FullScreen={false} />
    </Provider>
  );
};

describe("Modal Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockResolvedValue({
      data: {
        status: "OK",
        results: [{ geometry: { location: { lat: 10, lng: 20 } } }],
      },
    });
  });

  test("renders modal with required fields", () => {
    renderWithStore();

    expect(
      screen.getByRole("heading", { name: "Add Pin" })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter Title (Mandatory)")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter address (Mandatory)")
    ).toBeInTheDocument();
    expect(screen.getByText("Visited")).toBeInTheDocument();
  });

  test("displays fetched category options", async () => {
    renderWithStore();

    await waitFor(() => {
      expect(screen.getByText("Food")).toBeInTheDocument();
      expect(screen.getByText("Shopping")).toBeInTheDocument();
    });
  });

  test("handles input changes", () => {
    renderWithStore();

    fireEvent.change(screen.getByPlaceholderText(/enter title/i), {
      target: { value: "Test Place" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter address/i), {
      target: { value: "123 Main St" },
    });

    expect(screen.getByPlaceholderText(/enter title/i)).toHaveValue(
      "Test Place"
    );
    expect(screen.getByPlaceholderText(/enter address/i)).toHaveValue(
      "123 Main St"
    );
  });

  test("submits form successfully", async () => {
    const { writeToFirestore } = require("../firebaseFunctions/writeDocument");

    renderWithStore();

    // Fill in required fields
    fireEvent.change(screen.getByPlaceholderText(/enter title/i), {
      target: { value: "My Pin" },
    });

    // Simulate address input and place selection
    const addressInput = screen.getByPlaceholderText(/enter address/i);
    fireEvent.change(addressInput, {
      target: { value: "123 Test St" },
    });

    // Trigger the place_changed event
    await act(async () => {
      if (autocompleteCallback) {
        autocompleteCallback();
      }
    });

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "cat1" },
    });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /add pin/i }));
    });

    await waitFor(() => {
      expect(writeToFirestore).toHaveBeenCalled();
      expect(writeToFirestore).toHaveBeenCalledWith(
        "test-user-id",
        expect.objectContaining({
          title: "My Pin",
          address: "123 Test St",
          categoryId: "cat1",
          placeId: "test-place-id-123",
          website: "http://test.com",
          openingHours: "Mon: 9-5 \nTue: 9-5",
          lat: 10,
          lng: 20,
        })
      );
    });
  });

  test("shows invalid address toast if geocode fails", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        status: "ZERO_RESULTS",
        results: [],
      },
    });

    const { invalidAdressToast } = require("../toastNotifications");

    renderWithStore();

    fireEvent.change(screen.getByPlaceholderText(/enter title/i), {
      target: { value: "Invalid Pin" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter address/i), {
      target: { value: "Unknown Place" },
    });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "cat1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add pin/i }));

    await waitFor(() => {
      expect(invalidAdressToast).toHaveBeenCalled();
      expect(
        require("../firebaseFunctions/writeDocument").writeToFirestore
      ).not.toHaveBeenCalled();
    });
  });

  test("resets all fields when clear button is clicked", () => {
    renderWithStore();

    // Fill some fields
    fireEvent.change(screen.getByPlaceholderText(/enter title/i), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter address/i), {
      target: { value: "123 St" },
    });
    fireEvent.click(screen.getByLabelText("Visited"));
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "cat1" },
    });

    // Click clear button
    fireEvent.click(screen.getByRole("button", { name: /clear all/i }));

    expect(screen.getByPlaceholderText(/enter title/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/enter address/i)).toHaveValue("");
    expect(screen.getByLabelText("Visited")).not.toBeChecked();
    expect(screen.getByRole("combobox")).toHaveValue("");
  });

  test("shows no categories toast when no categories exist", async () => {
    // Override the onSnapshot mock to return no categories
    jest.mock("firebase/firestore", () => ({
      collection: jest.fn(),
      getFirestore: jest.fn(),
      onSnapshot: jest.fn((_, callback) => {
        callback({ docs: [] });
        return jest.fn();
      }),
    }));

    const { noCategoriesToast } = require("../toastNotifications");

    renderWithStore();

    await waitFor(() => {
      expect(noCategoriesToast).toHaveBeenCalled();
    });
  });
});
