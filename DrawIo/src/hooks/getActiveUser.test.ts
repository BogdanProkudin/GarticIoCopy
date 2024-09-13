import {
  handleNextUserCall,
  getNextActiveUser,
  updateUserActivity,
  isGameWon,
} from "./getActiveUser"; // Импортируем функции для тестирования

import {
  setActiveUser,
  setRoomUsers,
  setRoundCount,
} from "../store/slices/roomInfo"; // Mocked imports for Redux actions

import { useAppSelector } from "../store/hook";

import { testUseBoardSelector } from "../components/Board/test-all-board-selectors";

jest.mock("react-redux");
describe("Utils functions", () => {
  const mockDispatch = jest.fn(); // Мок функции dispatch
  const mockSetIsGuessedAnimationFinished = jest.fn(); // Мок функции setIsGuessedAnimationFinished
  const mockUseAppSelector = useAppSelector as jest.MockedFunction<
    typeof useAppSelector
  >;

  // const mockUseAppDispatch = useAppDispatch as jest.MockedFunction<
  //   typeof useAppDispatch
  // >;
  const testData = {
    data: {
      users: [
        { userName: "user1", isActive: false, userPoints: 0 },
        { userName: "user2", isActive: false, userPoints: 0 },
        { userName: "user3", isActive: false, userPoints: 0 },
        { userName: "user4", isActive: false, userPoints: 0 },
        { userName: "user5", isActive: false, userPoints: 0 },
      ],
    },
    roundCount: 0,
    roomUsers: [
      { userName: "user1", isActive: false, userPoints: 0 },
      { userName: "user2", isActive: false, userPoints: 0 },
      { userName: "user3", isActive: false, userPoints: 0 },
    ],
    maxGamePoints: 100,
  };

  mockUseAppSelector.mockImplementation(testUseBoardSelector);
  beforeEach(() => {
    jest.clearAllMocks(); // Очистка всех моков перед каждым тестом
  });

  it("should handle getNextActiveUser correctly", () => {
    const result = getNextActiveUser(
      testData.data.users,
      mockSetIsGuessedAnimationFinished
    );
    expect(result).toEqual(testData.data.users[0]); // Assuming the first user is returned if no active user is found
    expect(mockSetIsGuessedAnimationFinished).toHaveBeenCalledWith(false);
  });

  it("should update user activity correctly", () => {
    const nextActiveUser = testData.data.users[0];
    const result = updateUserActivity(testData.data.users, nextActiveUser);
    const expectedUsers = [
      { userName: "user1", isActive: true, userPoints: 0 },
      { userName: "user2", isActive: false, userPoints: 0 },
      { userName: "user3", isActive: false, userPoints: 0 },
      { userName: "user4", isActive: false, userPoints: 0 },
      { userName: "user5", isActive: false, userPoints: 0 },
    ];
    expect(result).toEqual(expectedUsers); // Assuming user1 is made active
  });

  it("should determine if game is won correctly", () => {
    const result = isGameWon(testData.roomUsers, testData.maxGamePoints);
    expect(result).toBe(false); // Assuming none of the users have enough points to win
  });

  it("should handle active user rotation correctly in handleNextUserCall", () => {
    let activeUser = getNextActiveUser(
      testData.data.users,
      mockSetIsGuessedAnimationFinished
    );

    for (let i = 1; i <= testData.data.users.length; i++) {
      handleNextUserCall({
        ...testData,
        dispatch: mockDispatch,
        setIsGuessedAnimationFinished: mockSetIsGuessedAnimationFinished,
      });

      expect(mockDispatch).toHaveBeenCalledWith(setRoundCount());

      activeUser = getNextActiveUser(
        testData.data.users,
        mockSetIsGuessedAnimationFinished
      );
      console.log(
        getNextActiveUser(
          testData.data.users,
          mockSetIsGuessedAnimationFinished
        ),
        "activeUser",
        "WW"
      );
      expect(mockDispatch).toHaveBeenCalledWith(setActiveUser(activeUser));

      const updatedUsers = updateUserActivity(testData.data.users, activeUser);
      expect(mockDispatch).toHaveBeenCalledWith(setRoomUsers(updatedUsers));

      expect(mockSetIsGuessedAnimationFinished).toHaveBeenCalledWith(false);
    }
  });
});
