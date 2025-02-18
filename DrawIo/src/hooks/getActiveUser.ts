// utils.js
import { setActiveTool, setDrawColor } from "../store/slices/drawInfo";
import {
  IRoomUsers,
  setActiveUser,
  setChosenWords,
  setRoomUsers,
  setUsersGuessed,
} from "../store/slices/roomInfo";

interface IhandleNextUserCall {
  activeUser: any;
  setIsGuessedAnimationFinished: any;
  dispatch: any;
  chosenWords: string[];
  users: any;
  roundCount: number;
  roomUsers: IRoomUsers[];
  maxGamePoints: number;
}

export const handleNextUserCall = ({
  activeUser,
  dispatch,
  users,
  chosenWords,

  setIsGuessedAnimationFinished,
}: IhandleNextUserCall) => {
  if (!activeUser) throw new Error(`Invalid user data `);
  console.log("в смене активного юзера", users);

  dispatch(setUsersGuessed([]));
  dispatch(setActiveTool("pen"));
  dispatch(setDrawColor("black"));
  dispatch(setChosenWords(chosenWords));
  dispatch(setActiveUser(activeUser));
  dispatch(setRoomUsers(users));
  setIsGuessedAnimationFinished(false);
};
