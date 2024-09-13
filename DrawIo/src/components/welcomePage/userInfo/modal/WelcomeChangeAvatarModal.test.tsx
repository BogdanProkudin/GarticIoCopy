import { render, fireEvent } from "@testing-library/react";
import WelcomeChangeAvatarModal from "./WelcomeChangeAvatarModal";
import { useAppDispatch } from "../../../../store/hook";
import { setActiveAvatar } from "../../../../store/slices/userAuth";
import "@testing-library/jest-dom";

// Mock useAppDispatch hook
jest.mock("../../../../store/hook", () => ({
  useAppDispatch: jest.fn(),
}));

jest.mock("../../../../store/slices/userAuth", () => ({
  setActiveAvatar: jest.fn(),
}));

describe("WelcomeChangeAvatarModal", () => {
  const setIsOpen = jest.fn();
  const dispatch = jest.fn();

  beforeEach(() => {
    (useAppDispatch as jest.Mock).mockReturnValue(dispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly and closes when close button is clicked", () => {
    const { getByText, getByTestId } = render(
      <WelcomeChangeAvatarModal isOpen={true} setIsOpen={setIsOpen} />
    );

    // Проверяем, что модальное окно рендерится и содержит текст 'AVATAR'
    expect(getByText("AVATAR")).toBeInTheDocument();

    // Находим кнопку закрытия и кликаем по ней
    const closeButton = getByTestId("close-button");
    expect(closeButton).toBeInTheDocument();

    // Кликаем по кнопке с иконкой закрытия
    fireEvent.click(closeButton);

    // Проверяем, что функция setIsOpen была вызвана с false
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  test("dispatches setActiveAvatar action and closes when confirm button is clicked", () => {
    const { getByText } = render(
      <WelcomeChangeAvatarModal isOpen={true} setIsOpen={setIsOpen} />
    );

    // Находим кнопку подтверждения и кликаем по ней
    const confirmButton = getByText("CONFIRM");
    fireEvent.click(confirmButton);

    // Проверяем, что функция setActiveAvatar была вызвана с ожидаемым аргументом (ожидаемая строка, может быть любой)
    expect(dispatch).toHaveBeenCalledWith(setActiveAvatar(expect.any(String)));

    // Проверяем, что функция setIsOpen была вызвана с false
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  test("does not render when isOpen is false", () => {
    const { queryByText } = render(
      <WelcomeChangeAvatarModal isOpen={false} setIsOpen={setIsOpen} />
    );

    // Проверяем, что модальное окно не рендерится, поскольку isOpen равен false
    expect(queryByText("AVATAR")).not.toBeInTheDocument();
  });
});
