import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import styles from "../styles.module.scss";
import GameRoomUserItem from "./gameRoomUserItem";
import { setIsPointAnimation } from "../../../store/slices/roomInfo";
import { motion } from "framer-motion";

type GameRoomUserListProps = {
  setShowUserActionModal: Dispatch<SetStateAction<boolean>>;
};

const GameRoomUserList: React.FC<GameRoomUserListProps> = ({
  setShowUserActionModal,
}) => {
  const roomUsers = useAppSelector((state) => state.drawThema.roomUsers);
  const selectedPlayers = useAppSelector(
    (state) => state.drawThema.selectedPlayers
  );
  const isToolsPanel = useAppSelector((state) => state.drawInfo.toolsPanel);
  const activeUser = useAppSelector((state) => state.drawThema.activeUser);
  const isGameStarted = useAppSelector(
    (state) => state.drawThema.isGameStarted
  );
  const isPointsAnimation = useAppSelector(
    (state) => state.drawThema.isPointsAnimation
  );

  const userNameStorage = localStorage.getItem("userName");
  const dispatch = useAppDispatch();

  const [showPointsForUsers, setShowPointsForUsers] = useState<string[]>([]);

  // 🔥 Fix: Ensure sorted list updates correctly
  const sortedRoomUsers = useMemo(
    () => [...roomUsers].sort((a, b) => b.userPoints - a.userPoints),
    [roomUsers]
  );

  useEffect(() => {
    if (isPointsAnimation.userName) {
      setShowPointsForUsers([isPointsAnimation.userName, activeUser.userName]);

      const timer = setTimeout(() => {
        setShowPointsForUsers([]);
        dispatch(setIsPointAnimation(false));
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isPointsAnimation.userName]);

  return (
    <div
      style={{
        width:
          activeUser.userName === userNameStorage && isToolsPanel ? "70%" : "",
      }}
      className={styles.game_room_user_list_container}
    >
      {sortedRoomUsers.slice(0, selectedPlayers).map((user, index) => (
        <motion.div
          key={user.userName} // ✅ Fix: Ensure stable keys
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={styles.game_room_user}
          onClick={() => setShowUserActionModal(true)}
        >
          <GameRoomUserItem
            userAvatar={user.userAvatar || ""}
            userName={user.userName || ""}
            userPoints={user.userPoints || ""}
            showPointsAnimation={showPointsForUsers.includes(user.userName)}
            addedPoints={user.addedPoints}
          />

          {isGameStarted && index <= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ position: "relative" }}
            >
              <div
                style={{
                  right:
                    activeUser.userName === userNameStorage && isToolsPanel
                      ? "12.2rem"
                      : "",
                }}
                className={
                  index === 0
                    ? styles.gold_icon
                    : index === 1
                    ? styles.silver_icon
                    : styles.bronze_icon
                }
              />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default GameRoomUserList;
