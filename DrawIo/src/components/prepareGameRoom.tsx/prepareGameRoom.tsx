import { useEffect, useState } from "react";

import { useAppDispatch } from "../../store/hook";
import { getRoomData, setRoomData } from "../../store/slices/roomInfo";

import PrepareGameRoomInfo from "./prepareGameRoomInfo";
import PrepareGameUserInfo from "./prepareGameUserInfo";
import styles from "./styles.module.scss";

import { useGetRoomIdFromUrl } from "../../hooks/useGetRoomIdFromUrl";
import LobbyNotFound from "../lobbyNotFound/lobbyNotFound";
import Loading from "../LoadingGame/Loading";
const PrepareGameRoom = () => {
  const roomId = useGetRoomIdFromUrl();
  const dispatch = useAppDispatch();

  const userId = localStorage.getItem("userId");
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const isBigScreen = useMediaQuery({ query: "(max-width: 640px)" });
  useEffect(() => {
    localStorage.setItem("pageAccessedByReload", `false`);
    const fetchRoomData = async () => {
      try {
        setIsLoading(true);
        const response = await dispatch(getRoomData({ roomId, userId }));

        if (!response.payload) {
          console.error("Error fetching room data:");
          setIsError(true);
          return;
        }

        const roomDataFromResponse = response.payload;

        if (!roomDataFromResponse || roomDataFromResponse.length === 0) {
          console.log("No room data found");
          setIsError(true);
          return;
        }

        dispatch(setRoomData(roomDataFromResponse));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching room data:", error);
        setIsError(true);
        setIsLoading(false);
      } finally {
      }
    };

    fetchRoomData();
  }, [roomId, dispatch]);
  useEffect(() => {
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
        {!isLoading && <PrepareGameUserInfo />}
        {isLoading && <Loading />}
        <PrepareGameRoomInfo />
      </>
    </div>
  );
};
export default PrepareGameRoom;
