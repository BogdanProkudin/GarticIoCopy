import { useEffect, useState } from "react";
import useGetRoomData from "../../hooks/useRoomInfo";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { getRoomData, setRoomData } from "../../store/slices/drawThema";
import PrepareGameButton from "./prepareGameButton";
import PrepareGameRoomInfo from "./prepareGameRoomInfo";
import PrepareGameUserInfo from "./prepareGameUserInfo";
import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
const PrepareGameRoom = () => {
  const currentUrl = window.location.href;
  const path = currentUrl;
  const parts = path.split("/");
  const roomId = parts[parts.length - 1];
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true); // Состояние загрузки данных
  const navigate = useNavigate();
  const [isError, setIsError] = useState<boolean>(false);
  const userNameStorage = localStorage.getItem("userName");

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setIsLoading(true); // Установка состояния загрузки перед запросом данных

        const response = await dispatch(getRoomData(roomId));

        if (!response.payload) {
          console.error("Error fetching room data:");
          setIsError(true);
          return;
        }

        const roomDataFromResponse = response.payload[0];

        if (!roomDataFromResponse) {
          console.log("No room data found");
          setIsError(true);
          return;
        }
        const userExists = roomDataFromResponse.usersInfo.some(
          (user: any) => user.userName === userNameStorage
        );
        if (!userExists) {
          navigate(`/prepareRoom/${roomId}`);
        }
        if (roomDataFromResponse.host === userNameStorage) {
          navigate(`/game/${roomId}`);
        }
        await dispatch(setRoomData(roomDataFromResponse));
      } catch (error) {
        console.error("Error fetching room data:", error);
        setIsError(true);
      } finally {
        setIsLoading(false); // Установка состояния загрузки после завершения запроса данных
      }
    };

    fetchRoomData();
  }, [roomId, dispatch]);

  if (isError) {
    return <div>ROOM NOT FOUNd</div>;
  }
  return (
    <div className={styles.prepare_room_container}>
      <>
        <PrepareGameUserInfo />
        <PrepareGameRoomInfo />
      </>
    </div>
  );
};
export default PrepareGameRoom;
