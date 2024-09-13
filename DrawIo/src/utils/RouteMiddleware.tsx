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
import Lottie from "react-lottie";

const RouteMiddleware = ({ children }: any) => {
  const navigate = useNavigate();
  const isGameRoomLoading = useAppSelector(
    (state) => state.drawThema.isGameRoomLoading
  );
  const location = useLocation();
  const userId = localStorage.getItem("userId");

  const [isChecking, setIsChecking] = useState(true); // Флаг проверки
  const [isError, setIsError] = useState(false);

  const dispatch = useAppDispatch();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LottieSettings,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const roomId = useGetRoomIdFromUrl();
  const userNameStorage = localStorage.getItem("userName");

  const getUserLeave = async () => {
    try {
      const isGamePage = location.pathname === `/game/${roomId}`;
      if (isGamePage) {
        console.log("IS LOAD", isGameRoomLoading);

        dispatch(setIsGameRoomLoading(true)); // Ставим флаг загрузки

        const response = await dispatch(getRoomData({ roomId, userId }));

        if (response?.payload.message === "Room does not exist") {
          setIsChecking(false); // Завершаем проверку
          return "lobbyNotFound";
        }

        const roomDataFromResponse = response?.payload?.[0];
        if (!roomDataFromResponse) {
          setIsChecking(false); // Завершаем проверку
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
          setIsChecking(false); // Завершаем проверку
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
          setIsChecking(false); // Завершаем проверку
          return "prepare";
        }

        if (currentUser?.isUserLeave) {
          setIsChecking(false); // Завершаем проверку
          return "main";
        }

        localStorage.setItem("pageAccessedByReload", "true");
      } else {
        if (location.pathname === `/prepareRoom/${roomId}`) {
          setIsChecking(false); // Завершаем проверку
        }
        return "game";
      }
    } catch (err) {
      console.log("ERROR NAVIGATION", err);
      setIsError(true);
      return "lobbyNotFound";
    } finally {
      // Завершаем проверку
      setIsChecking(false);
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
  if (isChecking || isGameRoomLoading) {
    return (
      <div className={styles.set_up_loading}>
        <Lottie
          isClickToPauseDisabled
          style={{ height: "300px", width: "300px" }}
          options={defaultOptions}
        />
      </div>
    );
  }

  // Обработка ошибок
  if (isError) {
    return <div className={styles.error_message}>Room not found</div>;
  }

  return children;
};

export default RouteMiddleware;
