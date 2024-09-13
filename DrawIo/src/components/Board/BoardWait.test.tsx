import BoardWait from "./BoardWait";

import { render, screen, fireEvent } from "@testing-library/react";
import { useAppSelector } from "../../store/hook";
// import { testUseBoardWaitSelector } from "./test-boardWait-selector";
import { handleGameStartButton } from "../../utils/handleStartGame";

jest.mock("react-redux");
jest.mock("../../utils/handleStartGame", () => ({
  handleGameStartButton: jest.fn(),
}));
describe("Board Wait test", () => {
  const state = {
    drawThema: {
      roomUsers: [
        { id: "1", userName: "owner", isActive: false },
        { id: "2", userName: "owner2", isActive: false },
      ],
      host: "owner",
      activeIndex: 0,
      selectedThema: {
        name: "Животные",
        icon: "",
        words: ["собака", "крокодил"],
      },
    },
  };
  const stateForAloneInRoom = {
    drawThema: {
      roomUsers: [{ id: "1", userName: "owner", isActive: false }],
      host: "owner",
      activeIndex: 0,
      selectedThema: {
        name: "Животные",
        icon: "",
        words: ["собака", "крокодил"],
      },
    },
  };

  const mockUseAppSelector = useAppSelector as jest.MockedFunction<
    typeof useAppSelector
  >;

  beforeEach(() => {});

  it("if host name === userNameStorageName ", () => {
    mockUseAppSelector.mockImplementation((f: any) => f(state));
    Storage.prototype.getItem = jest.fn((key) => {
      return key === "userName" ? "owner" : null;
    });
    const { getByTestId } = render(<BoardWait />);

    const linkElement = screen.getByText(
      "Players are waiting for you to start"
    );

    expect(linkElement).toBeInTheDocument;
    const button = getByTestId("button-id");
    fireEvent.click(button);

    // Проверяем, что dispatch был вызван
    expect(handleGameStartButton).toHaveBeenCalled();
  });
  it("if host name !== userNameStorageName", () => {
    Storage.prototype.getItem = jest.fn((key) => {
      return key === "userName" ? " not owner" : null;
    });
    render(<BoardWait />);
    const linkElement = screen.getByText("Waiting for the owner to start");

    expect(linkElement).toBeInTheDocument;
  });
  it("if user alone in room", () => {
    mockUseAppSelector.mockImplementation((f: any) => f(stateForAloneInRoom));
    render(<BoardWait />);
    const linkElement = screen.getByText("Waiting for players");

    expect(linkElement).toBeInTheDocument;
  });
});
