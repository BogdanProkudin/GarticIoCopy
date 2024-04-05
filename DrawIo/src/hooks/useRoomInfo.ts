import { useEffect, useState } from "react";
import { useAppDispatch } from "../store/hook";
import { useNavigate } from "react-router-dom";
import { getRoomData } from "../store/slices/drawThema";
import { roomDataProps } from "../components/setUpPage/setUpGameThema/setUpGameThemaStartButton";

const useGetRoomData = (roomId: string, userNameStorage: string | null) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true); // Состояние загрузки данных

  const [roomData, setRoomData] = useState<roomDataProps | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

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

        const roomDataFromResponse = await response.payload[0];

        if (!roomDataFromResponse) {
          console.log("No room data found");
          setIsError(true);
          return;
        }
        const userExists = await roomDataFromResponse.usersInfo.some(
          (user: any) => user.userName === userNameStorage
        );
        if (!userExists) {
          navigate(`/prepareRoom/${roomId}`);
        }

        setRoomData(roomDataFromResponse);
      } catch (error) {
        console.error("Error fetching room data:", error);
        setIsError(true);
      } finally {
        setIsLoading(false); // Установка состояния загрузки после завершения запроса данных
      }
    };

    fetchRoomData();

    return () => {};
  }, [dispatch, roomId, userNameStorage, navigate]);

  return { roomData, isError, isLoading };
};

export default useGetRoomData;
