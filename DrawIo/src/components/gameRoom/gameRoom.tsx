import { useEffect, useRef, useState, useMemo, useCallback } from "react";
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
import { LeaveRoomConfirmation } from "./modal/LeaveRoomConfirmation";
import { InactivityWarning } from "./modal/InactivityWarning";
import useLeaveRoomOnUnload from "../../hooks/LeaveRoom";
import { MESSAGES as MESSAGES_CONSTANT } from "../../constants/messages";
import { useBeforeUnload } from "../../hooks/useBeforeUnload";
import { LeaveRoomService } from "../../services/leaveRoomService";
import DeleteModal from "./modal/gameRoomDeletingModal";

const GameRoom = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Refs
  const contextRef = useRef<any>(null);
  const drawRef = useRef<any>(null);

  // Local state
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);

  // Redux state
  const userNameStorage = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId") || "";
  const roomId = useGetRoomIdFromUrl();
  const roomUsers = useAppSelector((state) => state.drawThema.roomUsers);
  const activeUser = useAppSelector((state) => state.drawThema.activeUser);
  const isToolsPanel = useAppSelector((state) => state.drawInfo.toolsPanel);
  const host = useAppSelector((state) => state.drawThema.host);
  const isUserWonGame = useAppSelector((state) => state.userInfo.isUserWonGame);
  const userName = useAppSelector((state) => state.userAuth.userNameInputValue);
  const userAvatar = localStorage.getItem("userAvatar");
  const activeAvatar = useAppSelector((state) => state.userAuth.activeAvatar);
  const isDeletingRoom = useAppSelector(
    (state) => state.drawThema.isDeletingRoom
  );
  // Custom hooks
  const {
    isActive,
    isLeaving,
    showWarning,
    timeToDisconnect,
    handleLeaveRoom,
  } = useLeaveRoomOnUnload(roomId, userNameStorage);

  // Обработчики для модальных окон
  const handleConfirmLeave = async () => {
    await handleLeaveRoom();
  };

  const handleCancelLeave = () => {
    setShowLeaveConfirmation(false);
  };

  const handleStayActive = () => {
    // Действие будет выполнено автоматически при любом взаимодействии пользователя
    document.dispatchEvent(new Event("mousemove"));
  };

  // Добавляем обработчик для кнопки выхода
  const handleBeforeUnload = useCallback(async () => {
    try {
      await LeaveRoomService.leaveRoom(roomId, userNameStorage!);
    } catch (error) {
      console.error("Error during page unload:", error);
    }
  }, [roomId, userNameStorage]);

  const { confirmLeave } = useBeforeUnload(handleBeforeUnload);

  const handleLeaveClick = () => {
    confirmLeave(); // Устанавливаем флаг, что пользователь подтвердил выход
    setShowLeaveConfirmation(true);
  };

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

  useEffect(() => {
    axios.post(API_ENDPOINTS.PING, {
      roomId,
      userId,
    });
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
  }, []);

  useEffect(() => {
    if (host.hostName === userNameStorage && !isDeletingRoom) {
      setShowShareModal(true);
    } else if (
      host.hostName.length > 1 &&
      userNameStorage &&
      host.hostName !== userNameStorage
    ) {
      setShowRulesModal(true);
    }
  }, [host, userNameStorage]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = MESSAGES.LEAVE_PAGE_CONFIRMATION;
      return MESSAGES.LEAVE_PAGE_CONFIRMATION;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return (
    <div className={styles.game_page_container}>
      <link rel="stylesheet" href={STYLES.FONT_URL} />
      <div className={styles.game_room_container}>
        <GameRoomHeader
          setShowShareModal={setShowShareModal}
          setShowRulesModal={setShowRulesModal}
          setShowLeaveConfirmation={setShowLeaveConfirmation}
          handleLeaveClick={handleLeaveClick}
        />

        <GameRoomModals
          showShareModal={showShareModal}
          showRulesModal={showRulesModal}
          setShowShareModal={setShowShareModal}
          setShowRulesModal={setShowRulesModal}
        />
        {isDeletingRoom && <DeleteModal />}
        <LeaveRoomConfirmation
          isOpen={showLeaveConfirmation}
          isLoading={isLeaving}
          onConfirm={handleConfirmLeave}
          onCancel={handleCancelLeave}
        />

        <InactivityWarning
          isOpen={showWarning}
          timeToDisconnect={timeToDisconnect}
          onStayActive={handleStayActive}
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
