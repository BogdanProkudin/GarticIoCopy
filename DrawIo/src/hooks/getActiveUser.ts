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
  activeUser: any;
  setIsGuessedAnimationFinished: any;
  dispatch: any;

  users: any;
  roundCount: number;
  roomUsers: IRoomUsers[];
  maxGamePoints: number;
}

export const handleNextUserCall = ({
  activeUser,
  dispatch,
  users,
  roomUsers,
  setIsGuessedAnimationFinished,
}: IhandleNextUserCall) => {
  if (!activeUser) throw new Error(`Invalid user data `);
  console.log("в смене активного юзера");

  dispatch(setUsersGuessed([]));
  dispatch(setActiveTool("pen"));
  dispatch(setDrawColor("black"));
  dispatch(setActiveUser(activeUser));
  dispatch(setRoomUsers(users));
  setIsGuessedAnimationFinished(false);
};
