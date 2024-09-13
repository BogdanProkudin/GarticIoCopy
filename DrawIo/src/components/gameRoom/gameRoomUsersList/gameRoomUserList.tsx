import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import styles from "../styles.module.scss";
import GameRoomUserItem from "./gameRoomUserItem";
import { setIsPointAnimation } from "../../../store/slices/roomInfo";

const GameRoomUserList: React.FC = () => {
  const roomUsers = useAppSelector((state) => state.drawThema.roomUsers);
  const selectedPlayers = useAppSelector(
    (state) => state.drawThema.selectedPlayers
  );
  const isToolsPanel = useAppSelector((state) => state.drawInfo.toolsPanel);
  const activeUser = useAppSelector((state) => state.drawThema.activeUser);
  const choosedWord = useAppSelector((state) => state.drawThema.choosedWord);
  const userNameStorage = localStorage.getItem("userName");
  const isGameStarted = useAppSelector(
    (state) => state.drawThema.isGameStarted
  );
  const [showPointsForUsers, setShowPointsForUsers] = useState<string[]>([]);
  const sortedRoomUsers = useMemo(
    () => roomUsers?.slice().sort((a, b) => b.userPoints - a.userPoints) || [],
    [roomUsers]
  );
  const isPointsAnimation = useAppSelector(
    (state) => state.drawThema.isPointsAnimation
  );

  if (!roomUsers) {
    return <div>LOADING ROOM USERS</div>;
  }
  const dispatch = useAppDispatch();

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
      {Array.from({ length: selectedPlayers }).map((_, index) => {
        const currentUser = sortedRoomUsers[index];

        return (
          <div key={index} className={styles.game_room_user}>
            <GameRoomUserItem
              userAvatar={currentUser?.userAvatar || ""}
              userName={currentUser?.userName || ""}
              userPoints={currentUser?.userPoints || ""}
              showPointsAnimation={showPointsForUsers.includes(
                currentUser?.userName
              )}
              addedPoints={currentUser && currentUser.addedPoints}
            />
            {isGameStarted &&
              index <= 2 && ( //PLACE ICONS
                <div style={{ position: "relative" }}>
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
                        : styles.brown_icon
                    }
                  />
                </div>
              )}
          </div>
        );
      })}
    </div>
  );
};

export default GameRoomUserList;
