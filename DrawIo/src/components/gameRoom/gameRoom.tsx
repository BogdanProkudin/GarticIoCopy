import { useEffect, useRef, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import GameRoomHeader from "./gameRoomHeader";
import GameRoomUserList from "./gameRoomUsersList/gameRoomUserList";
import { setHost, setRoomUsers } from "../..//store/slices/roomInfo";
import Board from "../Board/Board";
import GameRoomInteractions from "./gameRoomInteractions/gameRoomInteraction";
import DrawSettings from "../Board/DrawSettings/DrawSettings";
import Canvas from "../Board/Canvas";
import GameWon from "./gameRoomWIn/GameWon";
import axios from "axios";
import { useGetRoomIdFromUrl } from "../../hooks/useGetRoomIdFromUrl";
import { useSocketConnection } from "../../hooks/useSocketConnection";
import { useGameEvents } from "../../hooks/useGameEvents";
import { usePingRoom } from "../../hooks/usePingRoom";
import { GameRoomModals } from "./GameRoomModals";
import { API_ENDPOINTS, MESSAGES, STYLES } from "../../constants/gameRoom";
import { SideContentProps } from "../../types/gameRoom";

const GameRoom = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Refs
  const contextRef = useRef<any>(null);
  const drawRef = useRef<any>(null);

  // Local state
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  // Redux state
  const userNameStorage = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId") || "";
  const roomId = useGetRoomIdFromUrl();
  const roomUsers = useAppSelector((state) => state.drawThema.roomUsers);
  const activeUser = useAppSelector((state) => state.drawThema.activeUser);
  const isToolsPanel = useAppSelector((state) => state.drawInfo.toolsPanel);
  const host = useAppSelector((state) => state.drawThema.host);
  const isUserWonGame = useAppSelector((state) => state.userInfo.isUserWonGame);

  // Custom hooks
  useSocketConnection(roomId);
  useGameEvents(dispatch);
  usePingRoom(roomId, userId, navigate);

  // Memoized values
  const sideContentStyles: SideContentProps = useMemo(
    () => ({
      width:
        activeUser.userName === userNameStorage && isToolsPanel ? "400px" : "",
      className: styles.game_room_side_content_container,
    }),
    [activeUser.userName, userNameStorage, isToolsPanel]
  );

  // Effects
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.returnValue = MESSAGES.LEAVE_PAGE_CONFIRMATION;
      return MESSAGES.LEAVE_PAGE_CONFIRMATION;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    const currentUser = roomUsers.find((user) => user.userId === userId);

    if (roomUsers.length > 0 && !currentUser?.isUserInLobby) {
      const handleUpdateUserState = async () => {
        try {
          const response = await axios.post(API_ENDPOINTS.UPDATE_USER_STATE, {
            headers: { "Content-Type": "application/json" },
            roomId,
            userId,
          });
          dispatch(setRoomUsers(response.data.roomUsers));
        } catch (error) {
          console.error("Failed to update user state:", error);
        }
      };
      handleUpdateUserState();
    }
  }, [roomUsers, userId, roomId, dispatch]);

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
      <link rel="stylesheet" href={STYLES.FONT_URL} />
      <div className={styles.game_room_container}>
        <GameRoomHeader
          setShowShareModal={setShowShareModal}
          setShowRulesModal={setShowRulesModal}
        />

        <GameRoomModals
          showShareModal={showShareModal}
          showRulesModal={showRulesModal}
          setShowShareModal={setShowShareModal}
          setShowRulesModal={setShowRulesModal}
        />

        {!isUserWonGame ? (
          <div className={styles.game_room_content_container}>
            <div
              style={sideContentStyles}
              className={styles.game_room_side_content_container}
            >
              <GameRoomUserList setShowUserActionModal={setShowShareModal} />
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
