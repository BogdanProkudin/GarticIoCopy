// import { useEffect, useRef, useState } from "react";
// import { socket } from "../../socket";
// import { useAppDispatch, useAppSelector } from "../../store/hook";

// import { useNavigate } from "react-router-dom";
// import useGetRoomData from "../../hooks/useRoomInfo";
// import styles from "./styles.module.scss";
// import GameRoomHeader from "./gameRoomHeader";
// import GameRoomUserList from "./gameRoomUsersList/gameRoomUserList";
// import {
//   setHost,
//   setRoomUsers,
//   setSelectedPlayers,
//   setSelectedThema,
// } from "../../store/slices/drawThema";
// import Board from "../Board/Board";
// import GameRoomAnswers from "./gameRoomInteractions/answers/gameRoomAnswers";
// import GameRoomInteractions from "./gameRoomInteractions/gameRoomInteraction";
// import DrawSettings from "../Board/DrawSettings/DrawSettings";
// import Canvas from "../Board/Canvas";

// const GameRoom = () => {
//   const userNameStorage = localStorage.getItem("userName");
//   const activeUser = useAppSelector((state) => state.drawThema.activeUser);
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const currentUrl = window.location.href;
//   let contextRef = useRef<any>(null);
//   let drawRef = useRef<any>(null);
//   const path = currentUrl;
//   const parts = path.split("/");
//   const roomId = parts[parts.length - 1];
//   const { roomData, isError, isLoading } = useGetRoomData(
//     roomId,
//     userNameStorage
//   );
//   useEffect(() => {
//     if (isError) {
//       console.log("ERROR ROOM DATA");
//     }
//   }, []);

//   useEffect(() => {
//     async function getRoomData() {
//       socket.on("userJoined", (data: any) => {
//         dispatch(setRoomUsers(data.usersInfo));
//         console.log("user joined");
//       });
//       socket.on("userLeaved", (data: any) => {
//         console.log("leavedData");
//         dispatch(setRoomUsers(data?.usersInfo));
//       });

//       if (roomData) {
//         dispatch(setSelectedThema(roomData.thema));
//         dispatch(setRoomUsers(roomData?.usersInfo));
//         dispatch(setSelectedPlayers(roomData.players));
//         dispatch(setHost(roomData.host));
//       }
//     }
//     getRoomData();
//     return () => {
//       socket.off("userJoined");
//       socket.off("userLeaved");
//     };
//   }, [roomData]);

//   useEffect(() => {
//     socket.connect();
//     socket.emit("joinRoom", roomId);
//   }, []);

//   return (
//     <div className={styles.game_page_container}>
//       <link
//         rel="stylesheet"
//         href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,900;1,900&display=swap"
//       />
//       <div className={styles.game_room_container}>
//         <GameRoomHeader />
//         <div className={styles.game_room_content_container}>
//           <GameRoomUserList />
//           <DrawSettings />
//           <div className={styles.game_room_board_container}>
//             <Board contextRef={contextRef} roomId={roomId} drawRef={drawRef} />
//             {
//               <Canvas
//                 contextRef={contextRef}
//                 roomId={roomId}
//                 drawRef={drawRef}
//               />
//             }
//             <GameRoomInteractions />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default GameRoom;

import { useEffect, useRef, useState } from "react";
import { socket } from "../../socket";
import { useAppDispatch, useAppSelector } from "../../store/hook";

import useGetRoomData from "../../hooks/useRoomInfo";
import styles from "./styles.module.scss";
import GameRoomHeader from "./gameRoomHeader";
import GameRoomUserList from "./gameRoomUsersList/gameRoomUserList";
import {
  getRoomData,
  IRoomData,
  setHost,
  setMaxRoomPoints,
  setRoomUsers,
  setSelectedPlayers,
  setSelectedThema,
  setWinners,
} from "../../store/slices/roomInfo";
import Board from "../Board/Board";
import GameRoomInteractions from "./gameRoomInteractions/gameRoomInteraction";
import DrawSettings from "../Board/DrawSettings/DrawSettings";
import Canvas from "../Board/Canvas";
import GameWon from "./gameRoomWIn/GameWon";
import { useNavigate } from "react-router-dom";
import ShareGameModal from "./modal/gameRoomShareGameModal";
import RulesGameModal from "./modal/gameRoomRulesModal";
import axios from "axios";
import { useGetRoomIdFromUrl } from "../../hooks/useGetRoomIdFromUrl";
import { setIsUserWonGame } from "../../store/slices/userInfo";

const GameRoom = () => {
  const userNameStorage = localStorage.getItem("userName");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const contextRef = useRef(null);
  const drawRef = useRef(null);
  const userId = localStorage.getItem("userId");
  const roomData = useAppSelector((state) => state.drawThema.roomData);
  const isUserWonGame = useAppSelector((state) => state.userInfo.isUserWonGame);
  const host = useAppSelector((state) => state.drawThema.host);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const roomId = useGetRoomIdFromUrl();
  const roomUsers = useAppSelector((state) => state.drawThema.roomUsers);
  const activeUser = useAppSelector((state) => state.drawThema.activeUser);
  const isToolsPanel = useAppSelector((state) => state.drawInfo.toolsPanel);
  const handleInactivity = () => {
    console.log("User is inactive for 1 minute");
    // Например, выполняем разлогинивание или отправляем запрос
  };
  // useEffect(() => {
  //   const abc = async () => {
  //     dispatch(getRoomData({ roomId, userId }));
  //   };
  //   abc();
  // }, []);
  useEffect(() => {
    const handleBeforeUnload = async (event: any) => {
      const confirmationMessage =
        "Вы уверены, что хотите покинуть эту страницу?";
      event.returnValue = confirmationMessage; // стандартный подход для старых браузеров

      if (window.location.href) {
        console.log("update page ");
      }
      return confirmationMessage;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    console.log("рендер гей рума");

    socket.on("getInactiveUsers1", (userId: string) => {
      console.log("INACTIVE USER", userId);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    let pongId: any;

    const handleIntervalStart = () => {
      pongId = setInterval(async () => {
        try {
          const response = await axios.post("http://localhost:3000/ping", {
            roomId,
            userId,
          });

          if (response.data.message === "Room no longer exists") {
            console.log("Room no longer exists, stopping ping.");
            navigate("/lobbyNotFound", { replace: true });
            clearInterval(pongId); // Останавливаем дальнейшие пинги
          }
        } catch (error) {
          console.error("Error sending ping:", error);
          navigate("/lobbyNotFound", { replace: true });
          clearInterval(pongId); // Останавливаем пинг в случае ошибки
        }
      }, 17000); // Интервал пинга каждые 17 секунд
    };

    handleIntervalStart();

    // Очищаем интервал при размонтировании компонента
    return () => {
      clearInterval(pongId);
    };
  }, []); // Перезапускаем эффект, если изменятся roomId или userId

  useEffect(() => {
    const currentUser = roomUsers.find((user: any) => user.userId === userId);
    console.log("CURRENT", currentUser);
    socket.on("gameWon", (data: any) => {
      const winner = data.winners.sort(
        (a: { userPoints: number }, b: { userPoints: number }) =>
          b.userPoints - a.userPoints
      )[0];
      const secondPlacer = data.winners.sort(
        (a: { userPoints: number }, b: { userPoints: number }) =>
          b.userPoints - a.userPoints
      )[1];
      const thirdPlacer = data.winners.sort(
        (a: { userPoints: number }, b: { userPoints: number }) =>
          b.userPoints - a.userPoints
      )[2];

      dispatch(setIsUserWonGame(true));
      dispatch(setWinners([winner, secondPlacer, thirdPlacer]));
    });
    if (roomUsers.length > 0 && !currentUser?.isUserInLobby) {
      const handleUpdateUserState = async () => {
        const response = await axios.post(
          "http://localhost:3000/updateUserState",
          {
            headers: { "Content-Type": "application/json" },
            roomId,
            userId: userId,
          }
        );
        dispatch(setRoomUsers(response.data.roomUsers));
      };
      handleUpdateUserState();
    }
  }, []);

  // useEffect(() => {
  //   return () => {
  //     console.log("isError", roomData);
  //     console.log("roomdat11", roomData);
  //     if (!isLoading) {
  //       axios.post("http://localhost:3000/userLeaveRoom", {
  //         headers: { "Content-Type": "application/json" },
  //         whoLeave: userNameStorage,
  //         roomId,
  //       });
  //     }
  //   };
  // }, [isLoading]);

  useEffect(() => {
    socket.connect();
    socket.emit("joinRoom", roomId);

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    if (host.hostName === userNameStorage) {
      setShowShareModal(true);
    } else if (
      host.hostName.length > 1 &&
      userNameStorage &&
      host.hostName !== userNameStorage
    ) {
      setShowRulesModal(true);
    }
  }, [host, userNameStorage]);

  return (
    <div className={styles.game_page_container}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,900;1,900&display=swap"
      />
      <div className={styles.game_room_container}>
        <GameRoomHeader
          setShowShareModal={setShowShareModal}
          setShowRulesModal={setShowRulesModal}
        />

        {/* {showShareModal && (
          <ShareGameModal setShowShareModal={setShowShareModal} />
        )}

        {showRulesModal && (
          <RulesGameModal setShowRulesModal={setShowRulesModal} />
        )} */}
        {!isUserWonGame ? (
          <div className={styles.game_room_content_container}>
            <div
              style={{
                width:
                  activeUser.userName === userNameStorage && isToolsPanel
                    ? "400px"
                    : "",
              }}
              className={styles.game_room_side_content_container}
            >
              <GameRoomUserList />
              <DrawSettings />
            </div>
            <div className={styles.game_room_board_container}>
              <Board
                contextRef={contextRef}
                roomId={roomId}
                drawRef={drawRef}
              />
              <Canvas
                contextRef={contextRef}
                roomId={roomId}
                drawRef={drawRef}
              />
              <GameRoomInteractions />
            </div>
          </div>
        ) : (
          <GameWon />
        )}
      </div>
    </div>
  );
};

export default GameRoom;
