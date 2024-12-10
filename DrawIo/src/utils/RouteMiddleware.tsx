import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetRoomIdFromUrl } from "../hooks/useGetRoomIdFromUrl";
import { socket } from "../socket";
import LottieSettings from "../tools/Animation - 1725791635271.json";

import styles from "../components/setUpPage/styles.module.scss";
import { useAppDispatch, useAppSelector } from "../store/hook";
import {
  getRoomData,
  setRoomData,
  setSelectedThema,
  setRoomUsers,
  setSelectedPlayers,
  setHost,
  setMaxRoomPoints,
  IRoomData,
  setIsGameRoomLoading,
} from "../store/slices/roomInfo";

const RouteMiddleware = ({ children }: any) => {
  const navigate = useNavigate();

  const location = useLocation();
  const userId = localStorage.getItem("userId");

  const [isError, setIsError] = useState(false);

  const dispatch = useAppDispatch();

  const roomId = useGetRoomIdFromUrl();

  const getUserLeave = async () => {
    try {
      const isGamePage = location.pathname === `/game/${roomId}`;
      if (isGamePage) {
        dispatch(setIsGameRoomLoading(true)); // Ставим флаг загрузки

        const response = await dispatch(getRoomData({ roomId, userId }));

        if (response?.payload.message === "Room does not exist") {
          return "lobbyNotFound";
        }

        const roomDataFromResponse = response?.payload?.[0];
        if (!roomDataFromResponse) {
          return "lobbyNotFound";
        }

        const currentUser = roomDataFromResponse.usersInfo.find(
          (user: any) => user.userId === userId
        );

        // Если пользователь — гость, перенаправляем его на prepareRoom
        if (
          !roomDataFromResponse.usersInfo.some(
            (user: any) => user.userId === userId
          ) &&
          userId !== roomDataFromResponse.host.hostId
        ) {
          dispatch(setRoomData(roomDataFromResponse));

          return "prepare";
        }

        // Обновляем данные комнаты
        dispatch(setRoomData(roomDataFromResponse));
        dispatch(setSelectedThema(roomDataFromResponse.thema));
        dispatch(setRoomUsers(roomDataFromResponse.usersInfo));
        dispatch(setSelectedPlayers(roomDataFromResponse.players));
        dispatch(setHost(roomDataFromResponse.host));
        dispatch(setMaxRoomPoints(roomDataFromResponse.points));

        if (currentUser?.isUserInLobby) {
          return "prepare";
        }

        if (currentUser?.isUserLeave) {
          return "main";
        }

        localStorage.setItem("pageAccessedByReload", "true");
      } else {
        if (location.pathname === `/prepareRoom/${roomId}`) {
        }
        return "game";
      }
    } catch (err) {
      console.log("ERROR NAVIGATION", err);
      setIsError(true);
      return "lobbyNotFound";
    } finally {
      // Завершаем проверку

      dispatch(setIsGameRoomLoading(false));
    }
  };

  useEffect(() => {
    const handleUserJoined = (data: IRoomData) => {
      dispatch(setRoomUsers(data.usersInfo));
      console.log("User joined", data);
    };

    socket.on("userJoined", handleUserJoined);

    const func = async () => {
      const routeOutcome = await getUserLeave();
      if (routeOutcome === "main") {
        navigate("/");
      }
      if (routeOutcome === "prepare") {
        navigate(`/prepareRoom/${roomId}`, { replace: true });
      }
      if (routeOutcome === "lobbyNotFound") {
        navigate(`/lobbyNotFound`, { replace: true });
      }
    };
    func();

    return () => {
      socket.off("userJoined", handleUserJoined);
    };
  }, [location, navigate]);

  // Если проверка еще выполняется, ничего не рендерим

  // Обработка ошибок
  if (isError) {
    return <div className={styles.error_message}>Room not found</div>;
  }

  return children;
};

export default RouteMiddleware;
