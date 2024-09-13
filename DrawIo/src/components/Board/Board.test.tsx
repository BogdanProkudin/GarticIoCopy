import { render } from "@testing-library/react";
import Board from "./Board";
import { socket } from "../../socket";
import { handleNextUserCall } from "../../hooks/getActiveUser";

import { useAppSelector, useAppDispatch } from "../../store/hook";

jest.mock("react-redux");
jest.mock("../../socket", () => ({
  socket: {
    on: jest.fn(),
    off: jest.fn(),
  },
}));
jest.mock("../../hooks/getActiveUser", () => ({
  handleNextUserCall: jest.fn(),
}));
const setIsGuessedAnimationFinished = jest.fn();

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn((initial) => [initial, setIsGuessedAnimationFinished]),
}));
jest.mock("../../store/slices/drawThema", () => ({
  setIsUserWonGame: jest.fn(),
  setWinners: jest.fn(),
  setRoundCount: jest.fn(),
}));

const state = {
  drawThema: {
    activeUser: { userName: "testUser" },
    roundCount: 0,
    activeTool: "pen",
    roomUsers: [
      { userName: "owner", isActive: false, userPoints: 0 },
      { userName: "user2", isActive: false, userPoints: 0 },
      { userName: "user3", isActive: false, userPoints: 0 },
    ],
    maxRoomPoints: 100,
  },
};

describe("Компонент Board", () => {
  const dispatch = jest.fn();
  const mockUseAppSelector = useAppSelector as jest.MockedFunction<
    typeof useAppSelector
  >;
  const mockUseAppDispatch = useAppDispatch as jest.MockedFunction<
    typeof useAppDispatch
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAppDispatch.mockImplementation(() => dispatch);
  });

  test("handleNextUserCall вызывается при событии getNextUserCall от сокета", () => {
    const initialData = {
      users: [
        { userName: "owner", isActive: false, userPoints: 0 },
        { userName: "user2", isActive: false, userPoints: 0 },
        { userName: "user3", isActive: false, userPoints: 0 },
      ],
    };
    mockUseAppSelector.mockImplementation((f: any) => f(state));
    const socketOnSpy = jest.spyOn(socket, "on");

    render(
      <Board
        contextRef={{ current: "" }}
        drawRef={{ current: "" }}
        roomId={"test"}
      />
    );

    // Симуляция события getNextUserCall
    const onCall = socketOnSpy.mock.calls.find(
      (call) => call[0] === "getNextUserCall"
    );
    if (onCall) {
      const eventHandler = onCall[1];
      eventHandler(initialData);
    }

    // Проверка вызова handleNextUserCall
    expect(handleNextUserCall).toHaveBeenCalled();
    expect(handleNextUserCall).toHaveBeenCalledWith({
      data: initialData,
      setIsGuessedAnimationFinished,
      dispatch,
      roomUsers: state.drawThema.roomUsers,

      roundCount: state.drawThema.roundCount,
      maxGamePoints: state.drawThema.maxRoomPoints,
    });

    // Проверка вызова dispatch
  });
});
