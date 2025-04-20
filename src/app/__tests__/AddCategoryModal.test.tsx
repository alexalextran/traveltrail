// addCategoryModal.test.tsx
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import AddCategoryModal from "../components/PINManagementComponents/addCategoryModal";
import { Provider } from "react-redux";
import { createTestStore } from "../../../test-utils";
import "@testing-library/jest-dom";

// Mock the modules
jest.mock("react-color-palette", () => ({
  __esModule: true,
  ColorPicker: () => <div data-testid="color-picker">Mock Color Picker</div>,
  useColor: () => [{ hex: "#000000" }, jest.fn()],
}));

jest.mock("../context/authContext", () => ({
  useAuth: () => ({
    user: { uid: "test-user-id" },
  }),
}));

// Improved emoji-picker-react mock
jest.mock("emoji-picker-react", () => ({
  __esModule: true,
  default: (props: any) => (
    <div
      data-testid="emoji-picker"
      onClick={() => props.onEmojiClick({ unified: "1f600" })}
    >
      Mock Emoji Picker
    </div>
  ),
  Emoji: () => <div>😀</div>,
}));

jest.mock("../firebaseFunctions/Categories", () => ({
  writeCategory: jest.fn(() => Promise.resolve()),
}));

jest.mock("../toastNotifications.tsx", () => ({
  standardErrorToast: jest.fn(),
  categoryAddedToast: jest.fn(),
  noEmojiSelectedToast: jest.fn(),
}));

const renderWithStore = (modalsState = {}) => {
  const store = createTestStore({
    modals: {
      categoryModal: true,
      editModal: false,
      addModal: false,
      imageModal: false,
      fullScreen: false,
      ListScreen: false,
      ...modalsState,
    },
    // Include other state slices if needed
    pins: {},
    categories: {},
    location: {},
    selectedList: {},
    activePinModal: {},
  });

  return render(
    <Provider store={store}>
      <AddCategoryModal />
    </Provider>
  );
};

describe("AddCategoryModal Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders modal with required fields", () => {
    renderWithStore();

    expect(
      screen.getByRole("heading", { name: "Add Category" })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter category name")
    ).toBeInTheDocument();
    expect(screen.getByText("Color Picker")).toBeInTheDocument();
    expect(screen.getByText("Emoji Picker")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add Category" })
    ).toBeInTheDocument();
  });

  test("handles input changes", () => {
    renderWithStore();

    const input = screen.getByPlaceholderText("Enter category name");
    fireEvent.change(input, { target: { value: "Test Category" } });

    expect(input).toHaveValue("Test Category");
  });

  test("toggles between color picker and emoji picker", () => {
    renderWithStore();

    // Initially should show emoji picker
    expect(screen.getByTestId("emoji-picker")).toBeInTheDocument();

    // Click color picker button
    fireEvent.click(screen.getByText("Color Picker"));
    expect(screen.queryByTestId("emoji-picker")).not.toBeInTheDocument();
    expect(screen.getByTestId("color-picker")).toBeInTheDocument();

    // Click emoji picker button
    fireEvent.click(screen.getByText("Emoji Picker"));
    expect(screen.getByTestId("emoji-picker")).toBeInTheDocument();
    expect(screen.queryByTestId("color-picker")).not.toBeInTheDocument();
  });

  test("selects an emoji", () => {
    renderWithStore();

    const emojiPicker = screen.getByTestId("emoji-picker");
    fireEvent.click(emojiPicker);

    // The emoji should now be displayed in the input container
    expect(screen.getByText("😀")).toBeInTheDocument();
  });

  test("shows error when no emoji is selected", async () => {
    const { noEmojiSelectedToast } = require("../toastNotifications.tsx");

    renderWithStore();

    // Fill in category name but don't select emoji
    fireEvent.change(screen.getByPlaceholderText("Enter category name"), {
      target: { value: "Test Category" },
    });

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /add category/i }));
    });

    await waitFor(() => {
      expect(noEmojiSelectedToast).toHaveBeenCalled();
    });
  });

  test("closes modal when exit button is clicked", () => {
    const store = createTestStore({
      modals: { categoryModal: true },
    });

    const dispatchSpy = jest.spyOn(store, "dispatch");

    render(
      <Provider store={store}>
        <AddCategoryModal />
      </Provider>
    );

    fireEvent.click(screen.getByTestId("close-button"));

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "modals/toggleCategoryModal", // Make sure the action type matches your reducer
        payload: false,
      })
    );
  });

  test("applies flashing effect to active button", () => {
    jest.useFakeTimers();
    renderWithStore();

    const emojiButton = screen.getByText("Emoji Picker");

    // Check initial background color (adjust to match real initial value)
    expect(emojiButton).toHaveStyle("background-color: rgb(0, 61, 128)");

    // Simulate time passing for flashing effect
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Check after flashing effect change (adjust to match toggled color)
    expect(emojiButton).toHaveStyle("background-color: rgb(0, 86, 179)");

    jest.useRealTimers();
  });
});
