import React, { useEffect, useMemo, useState } from "react";
import { FaCrown } from "react-icons/fa";
import { useAppSelector } from "../../../store/hook";
import { FaPencil } from "react-icons/fa6";
import styles from "../styles.module.scss";
import { motion, AnimatePresence } from "framer-motion";
export type GameRoomUserItemProps = {
  userName: string;
  userAvatar: string;
  userPoints: string | number;
  showPointsAnimation: any;
  addedPoints: any;
};

const GameRoomUserItem: React.FC<GameRoomUserItemProps> = ({
  userName,
  userAvatar,
  userPoints,
  showPointsAnimation,
  addedPoints,
}) => {
  const host = useAppSelector((state) => state.drawThema.host);
  const activeUser = useAppSelector((state) => state.drawThema.activeUser);
  const userNameStorage = localStorage.getItem("userName") || "";
  const choosedWord = useAppSelector((state) => state.drawThema.choosedWord);
  const isToolsPanel = useAppSelector((state) => state.drawInfo.toolsPanel);
  const isPointsAnimation = useAppSelector(
    (state) => state.drawThema.isPointsAnimation
  );

  const isActiveUser = useMemo(
    () => userName === activeUser.userName && userName.length > 1,
    [userName, activeUser.userName]
  );
  const isCurrentUser = useMemo(
    () => userName === userNameStorage,
    [userName, userNameStorage]
  );
  const showToolsPanel = useMemo(
    () => isCurrentUser && isToolsPanel,
    [isCurrentUser, isToolsPanel]
  );
  // const showChoosedWord = useMemo(
  //   () => isCurrentUser && choosedWord.length > 1,
  //   [isCurrentUser, choosedWord.length]
  // );
  // console.log("isNIgga", isActiveUser, userName);

  return (
    <div
      className={styles.game_room_user_container}
      style={{
        marginLeft:
          activeUser.userName === userNameStorage && choosedWord.length > 1
            ? "1.7rem"
            : "",
      }}
    >
      {isActiveUser && isToolsPanel && (
        <div style={{ position: "relative" }}>
          <FaPencil
            className={styles.active_user_pencil}
            style={{
              width: showToolsPanel ? "1.2rem" : undefined,
              height: showToolsPanel ? "1.2rem" : undefined,
              top: showToolsPanel ? "-10px" : undefined,
              left: showToolsPanel ? "-16px" : undefined,
            }}
            color="blue"
          />
        </div>
      )}
      <div
        className={styles.game_room_user_avatar}
        style={{
          boxShadow: isActiveUser ? "0 0 0 4px blue" : undefined,
        }}
      >
        <div
          className={styles.avatar_image}
          style={{
            backgroundImage: `url(${userAvatar || "default_avatar_url"})`,
            height: userAvatar?.length > 60 ? "52px" : undefined,
            borderRadius: userAvatar?.length > 60 ? "100%" : undefined,
          }}
        />
      </div>
      <div className={styles.game_room_user_infos}>
        <span
          className={styles.game_room_user_name}
          style={{
            color: isActiveUser && userName.length > 1 ? "blue" : undefined,
            width: isToolsPanel ? "100%" : undefined,
            maxWidth: isToolsPanel ? "160px" : "",
          }}
        >
          {userName || "EMPTY"}
        </span>

        <span
          className={styles.game_room_user_points}
          style={{
            color: isActiveUser ? "blue" : undefined,
          }}
        >
          {userPoints ? userPoints + " pts" : 0 + " pts"}
        </span>

        {host.hostName === userName && (
          <span className={styles.game_room_host}>
            <FaCrown
              style={{ marginBottom: "5px", paddingRight: "3px" }}
              fontSize={15}
              color="white"
            />
            {"HOST"}
          </span>
        )}
      </div>

      {showPointsAnimation && (
        <AnimatePresence>
          <div style={{ position: "relative" }}>
            <motion.div
              className={styles.points_animation}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -50 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.5 }}
            >
              {addedPoints}
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default GameRoomUserItem;
