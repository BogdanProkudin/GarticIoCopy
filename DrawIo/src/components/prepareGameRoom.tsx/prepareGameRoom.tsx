import { useEffect, useState } from "react";

import { useAppDispatch } from "../../store/hook";
import { getRoomData, setRoomData } from "../../store/slices/roomInfo";

import PrepareGameRoomInfo from "./prepareGameRoomInfo";
import PrepareGameUserInfo from "./prepareGameUserInfo";
import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useGetRoomIdFromUrl } from "../../hooks/useGetRoomIdFromUrl";
import LobbyNotFound from "../lobbyNotFound/lobbyNotFound";
const PrepareGameRoom = () => {
  const roomId = useGetRoomIdFromUrl();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true); // Состояние загрузки данных
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [isError, setIsError] = useState<boolean>(false);
  const userNameStorage = localStorage.getItem("userName");
  const isBigScreen = useMediaQuery({ query: "(max-width: 640px)" });
  useEffect(() => {
    localStorage.setItem("pageAccessedByReload", `false`);
    const fetchRoomData = async () => {
      try {
        setIsLoading(true); // Установка состояния загрузки перед запросом данных

        const response = await dispatch(getRoomData({ roomId, userId }));

        if (!response.payload) {
          console.error("Error fetching room data:");
          setIsError(true);
          return;
        }

        const roomDataFromResponse = response.payload[0];

        if (!roomDataFromResponse || roomDataFromResponse.length === 0) {
          console.log("No room data found");
          setIsError(true);
          return;
        }

        dispatch(setRoomData(roomDataFromResponse));
      } catch (error) {
        console.error("Error fetching room data:", error);
        setIsError(true);
      } finally {
        setIsLoading(false); // Установка состояния загрузки после завершения запроса данных
      }
    };

    fetchRoomData();
  }, [roomId, dispatch]);
  useEffect(() => {
    console.log("render ");

    function generateUserId() {
      if (!userId) {
        const characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        const charactersLength = characters.length;
        for (let i = 0; i < 6; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
          );
        }
        return result;
      } else {
        return userId;
      }
    }
    const generatedUserId = generateUserId();
    console.log("сгенериовали айди", generatedUserId);

    localStorage.setItem("userId", generatedUserId);
  }, []);

  if (isError) {
    return <LobbyNotFound />;
  }
  return (
    <div className={styles.prepare_room_container}>
      <>
        {!isBigScreen && <PrepareGameUserInfo />}
        <PrepareGameRoomInfo />
      </>
    </div>
  );
};
export default PrepareGameRoom;
