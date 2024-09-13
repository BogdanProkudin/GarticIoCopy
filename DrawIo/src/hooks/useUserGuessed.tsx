import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { socket } from "../socket";
import { setIsUserDraw, setIsAllUsersGuessed } from "../store/slices/userInfo";
import {
  IActiveUser,
  IRoomUsers,
  setRoomUsers,
  setUsersGuessed,
} from "../store/slices/roomInfo";
import { setToolsPanel } from "../store/slices/drawInfo";

import { setIsPointAnimation } from "../store/slices/roomInfo";
import { Dispatch } from "@reduxjs/toolkit";
interface IuseNotifyOneUserGuessed {
  usersGuessed: string[];
  roomUsers: IRoomUsers[];
  roomId: string;
  userNameStorage: string;
  activeUser: IActiveUser;
  activeIndex: number;
}
interface IuseUpdateUserGuessedStatus {
  usersGuessed: string[];
  roomUsers: IRoomUsers[];
  activeUser: IActiveUser;
  userNameStorage: string;
  dispatch: Dispatch;
}
const handleUserGuessedAddedPointAnimation = (
  guessedUserName: string,
  dispatch: any
) => {
  dispatch(
    setIsPointAnimation({
      action: true,
      userName: guessedUserName,
    })
  );
};
//  Хук для уведомления об угадывании одного пользователя
export const useNotifyOneUserGuessed = ({
  usersGuessed,
  roomUsers,
  roomId,
  userNameStorage,
  activeUser,

  activeIndex,
}: IuseNotifyOneUserGuessed) => {
  useEffect(() => {
    const handleOneUserGuessed = async () => {
      const guessedUser = roomUsers.find(
        (el) => el.userName === usersGuessed[usersGuessed.length - 1]
      );
      if (guessedUser && guessedUser.userName === userNameStorage) {
        const url = "http://localhost:3000/userGuessed";

        socket.emit("oneUserGuessed", { roomId });

        const response = await axios.post(url, {
          headers: { "Content-Type": "application/json" },
          roomId,
          guessedUser,
          activeUser,
          activeIndex,
        });
        console.log("user gus", response, roomId);

        if (response.data) {
          //  Если все пользователи угадали

          if (response.data.usersGuessedList.length === roomUsers.length - 1) {
            const sendaAllUserGuessed = async (url: string) => {
              try {
                await axios.post(url, {
                  headers: {
                    "Content-Type": "application/json",
                  },
                  roomId,
                });
              } catch (error) {
                console.error("Error:", error);
              }
            };
            const url = "http://localhost:3000/allUsersGuessed";

            sendaAllUserGuessed(url);
            socket.emit("allUsersGuessed2", {
              roomId,
              roomUsers: response.data.usersList,
            });
            console.log("EVERYONE GUESSED");
          }
        }
      }
    };
    handleOneUserGuessed();
  }, [usersGuessed]);
};

// Хук для обновления статуса угадавших пользователей
export const useUpdateUserGuessedStatus = ({
  usersGuessed,
  roomUsers,
  activeUser,

  dispatch,
}: IuseUpdateUserGuessedStatus) => {
  useEffect(() => {
    const handleUserGuessed = () => {
      if (usersGuessed.length === roomUsers.length - 1) {
        dispatch(setToolsPanel(false));
        dispatch(setIsUserDraw(false));
        dispatch(setIsAllUsersGuessed(true));
      } else {
        const guessedUser = roomUsers.find(
          (el) => el.userName === usersGuessed[usersGuessed.length - 1]
        );
        console.log("one user guessed", guessedUser);

        if (guessedUser) {
          handleUserGuessedAddedPointAnimation(guessedUser.userName, dispatch);
          const maxPoints = 30;
          const guessedUsersLength = usersGuessed.length;
          const points = Math.round(
            guessedUsersLength > 1 ? maxPoints / guessedUsersLength : 13
          );
          const activeUserPoints = Math.round(points - 7);

          const updatedRoomUsers = roomUsers.map((item: IRoomUsers) =>
            item.userName === guessedUser.userName || activeUser.userName
              ? {
                  ...item,
                  userPoints:
                    item.userName === guessedUser.userName
                      ? item.userPoints + points
                      : item.userPoints + activeUserPoints,
                  addedPoints:
                    item.userName === guessedUser.userName
                      ? points
                      : activeUserPoints,
                }
              : item
          );
          handleUserGuessedAddedPointAnimation(guessedUser.userName, dispatch);
          dispatch(setRoomUsers(updatedRoomUsers));
        }
      }
    };

    const handleAllUsersGuessed = ({
      roomUsers,
    }: {
      roomUsers: IRoomUsers[];
    }) => {
      const guessedUser = roomUsers.find(
        (el: IRoomUsers) =>
          el.userName === usersGuessed[usersGuessed.length - 1]
      );

      if (guessedUser) {
        dispatch(setRoomUsers(roomUsers));
        handleUserGuessedAddedPointAnimation(guessedUser.userName, dispatch);
      }
    };

    socket.on("getOneUserGuessed", handleUserGuessed);
    socket.on("getAllUsersGuessed2", handleAllUsersGuessed);

    return () => {
      socket.off("getOneUserGuessed", handleUserGuessed);
      socket.off("getAllUsersGuessed2", handleAllUsersGuessed);
    };
  }, [usersGuessed]);
};
