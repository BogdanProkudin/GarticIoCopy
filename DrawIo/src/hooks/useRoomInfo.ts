// import { useEffect, useState } from "react";
// import { useAppDispatch } from "../store/hook";
// import { useNavigate } from "react-router-dom";
// import { getRoomData } from "../store/slices/roomInfo";
// import { roomDataProps } from "../components/setUpPage/setUpGameThema/setUpGameThemaStartButton";

// const useGetRoomData = (roomId: string, userNameStorage: string | null) => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();

//   const [isLoading, setIsLoading] = useState<boolean>(true); // Состояние загрузки данных

//   const [roomData, setRoomData] = useState<roomDataProps | null>(null);
//   const [isError, setIsError] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchRoomData = async () => {
//       try {
//         setIsLoading(true); // Установка состояния загрузки перед запросом данных

//         const response = await dispatch(getRoomData(roomId));

//         if (!response.payload) {
//           console.error("Error fetching room data:");
//           setIsError(true);
//           return;
//         }

//         const roomDataFromResponse = await response.payload[0];

//         if (!roomDataFromResponse) {
//           console.log("No room data found");
//           setIsError(true);
//           return;
//         }
//         const userExists = await roomDataFromResponse.usersInfo.some(
//           (user: any) => user.userName === userNameStorage
//         );
//         const currentUser = await roomDataFromResponse.usersInfo.find(
//           (user: any) => user.userName === userNameStorage
//         );

//         if (!userExists) {
//           navigate(`/prepareRoom/${roomId}`);
//         }
//         if (currentUser.isUserLeave) {
//           navigate("/");
//         }
//         //logic if user will reload page, he will redirect to main page
//         setRoomData(roomDataFromResponse);
//       } catch (error) {
//         console.error("Error fetching room data:", error);
//         setIsError(true);
//       } finally {
//         setIsLoading(false); // Установка состояния загрузки после завершения запроса данных
//       }
//     };

//     fetchRoomData();

//     return () => {};
//   }, [dispatch, roomId, userNameStorage, navigate]);

//   return { roomData, isError, isLoading };
// };

// export default useGetRoomData;

import { useEffect, useState } from "react";
import { useAppDispatch } from "../store/hook";
import { useNavigate } from "react-router-dom";
import {
  getRoomData,
  IRoomData,
  setIsUserInLobbdy,
} from "../store/slices/roomInfo";
import { roomDataProps } from "../components/setUpPage/setUpGameThema/setUpGameThemaStartButton";
import axios from "axios";

const useGetRoomData = (
  roomId: string,
  userId: string | null,
  userNameStorage: string | null
) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [roomData, setRoomData] = useState<roomDataProps | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    // const UserLeaveChecking = async (roomDataFromResponse: IRoomData) => {
    //   if (localStorage.getItem("pageAccessedByReload") === "true") {
    //     const currentUser = roomDataFromResponse.usersInfo.find(
    //       (user: any) => user.userName === userNameStorage
    //     );
    //     console.log("localStorage true ");
    //     const pageAccessedByReload =
    //       (window.performance.navigation &&
    //         window.performance.navigation.type === 1) ||
    //       window.performance
    //         .getEntriesByType("navigation")
    //         .map((nav: any) => nav.type)
    //         .includes("reload");
    //     if (
    //       pageAccessedByReload &&
    //       roomDataFromResponse.usersInfo &&
    //       !currentUser?.isUserLeave
    //     ) {
    //       await axios.post("http://localhost:3000/userLeaveRoom", {
    //         headers: { "Content-Type": "application/json" },
    //         whoLeave: userNameStorage,
    //         roomId,
    //       });
    //       // navigate("/", { replace: true });
    //     }
    //   }
    //   localStorage.setItem("pageAccessedByReload", "true");
    //   console.log("localStorage", localStorage.getItem("pageAccessedByReload"));
    // };
    // const fetchRoomData = async () => {
    //   try {
    //     setIsLoading(true);
    //     const response = await dispatch(getRoomData(roomId));
    //     const roomDataFromResponse = response.payload?.[0];
    //     // await UserLeaveChecking(roomDataFromResponse);
    //     console.log("roomdataREs", roomDataFromResponse);
    //     if (!roomDataFromResponse || roomDataFromResponse.length === 0) {
    //       setIsError(true);
    //       return;
    //     }
    //     console.log(userId, "userId в руумифо");
    //     const userExists = roomDataFromResponse.usersInfo.some((user: any) => {
    //       console.log("USERSID", user.userId, userId);
    //       return user.userId === userId;
    //     });
    //     if (!userExists) {
    //       console.log("перекинул в подготовку");
    //       navigate(`/prepareRoom/${roomId}`);
    //       return;
    //     }
    //     const currentUser = roomDataFromResponse.usersInfo.find(
    //       (user: any) => user.userName === userNameStorage
    //     );
    //     if (currentUser?.isUserLeave) {
    //       dispatch(setIsUserInLobbdy(false));
    //       // navigate("/", { replace: true });
    //       return;
    //     }
    //     dispatch(setIsUserInLobbdy(true));
    //     setRoomData(roomDataFromResponse);
    //   } catch (error) {
    //     console.error("Error fetching room data:", error);
    //     setIsError(true);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchRoomData();
  }, [dispatch, roomId, userNameStorage, navigate]);

  return { roomData, isError, isLoading };
};

export default useGetRoomData;
