// utils.js
import { setActiveTool, setDrawColor } from "../store/slices/drawInfo";
import {
  IRoomUsers,
  setActiveUser,
  setRoomUsers,
  setRoundCount,
  setUsersGuessed,
  setWinners,
} from "../store/slices/roomInfo";
import { setIsUserWonGame } from "../store/slices/userInfo";
interface IhandleNextUserCall {
  data: any;
  setIsGuessedAnimationFinished: any;
  dispatch: any;

  roundCount: number;
  roomUsers: IRoomUsers[];
  maxGamePoints: number;
}
export const getNextActiveUser = (
  users: any[],
  setIsGuessedAnimationFinished: any
) => {
  const activeUser = users.find((user: { isActive: any }) => user.isActive);
  if (!activeUser) {
    setIsGuessedAnimationFinished(false); // Здесь может понадобиться пересмотр логики, так как setIsGuessedAnimationFinished является частью React компонента.
    return users[0];
  }
  const activeIndex = users.findIndex(
    (user: { isActive: any }) => user.isActive
  );
  const nextIndex = activeIndex === users.length - 1 ? 0 : activeIndex + 1;
  return users[nextIndex];
};

export const updateUserActivity = (
  users: any[],
  nextActiveUser: { userName: any }
) => {
  return users.map((user: { userName: any }) => ({
    ...user,
    isActive: user.userName === nextActiveUser.userName,
  }));
};

export const isGameWon = (roomUsers: any[], maxGamePoints: number) => {
  return roomUsers.some(
    (user: { userPoints: number }) => user.userPoints >= maxGamePoints
  );
};

export const handleGameWin = (
  roomUsers: any[],
  maxGamePoints: number,
  dispatch: (arg0: any) => void
) => {
  const listWinners = roomUsers.filter((user: { userPoints: number }) =>
    roomUsers.length > 3 ? user.userPoints >= maxGamePoints : user.userPoints
  );

  const winner = listWinners.sort(
    (a: { userPoints: number }, b: { userPoints: number }) =>
      b.userPoints - a.userPoints
  )[0];
  const secondPlacer = listWinners.sort(
    (a: { userPoints: number }, b: { userPoints: number }) =>
      b.userPoints - a.userPoints
  )[1];
  const thirdPlacer = listWinners.sort(
    (a: { userPoints: number }, b: { userPoints: number }) =>
      b.userPoints - a.userPoints
  )[2];

  dispatch(setIsUserWonGame(true));
  dispatch(setWinners([winner, secondPlacer, thirdPlacer]));
};

export const handleNextUserCall = ({
  data,
  dispatch,
  roundCount,
  setIsGuessedAnimationFinished,
  roomUsers,

  maxGamePoints,
}: IhandleNextUserCall) => {
  if (!data || !data.users) throw new Error("Invalid user data");
  console.log(data, "DDDADATA");
  dispatch(setUsersGuessed([]));
  dispatch(setActiveTool("pen"));
  dispatch(setDrawColor("black"));
  dispatch(setActiveUser(data.activeUser));
  dispatch(setRoomUsers(data.users));
  setIsGuessedAnimationFinished(false);
};
