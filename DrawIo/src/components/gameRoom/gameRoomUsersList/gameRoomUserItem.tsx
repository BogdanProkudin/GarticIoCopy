import React, { useState } from "react";
import { FaCrown } from "react-icons/fa";
import { useAppSelector } from "../../../store/hook";
import styles from "../styles.module.scss";

export type GameRoomUserItemProps = {
  userName: string;
  userAvatar: string;
  userPoints: string;
};

const GameRoomUserItem: React.FC<GameRoomUserItemProps> = ({
  userName,
  userAvatar,
  userPoints,
}) => {
  const host = useAppSelector((state) => state.drawThema.host);

  if (userAvatar) {
    return (
      <div className={styles.game_room_user_container}>
        <div className={styles.game_room_user_avatar}>
          <div
            className={styles.avatar_image}
            style={{
              backgroundImage: `url(${userAvatar})`,
              height: userAvatar?.length > 60 ? "52px" : "",
              borderRadius: userAvatar?.length > 60 ? "100%" : "",
            }}
          />
        </div>
        <div className={styles.game_room_user_infos}>
          <span className={styles.game_room_user_name}>{userName}</span>
          <span className={styles.game_room_user_points}>
            {userPoints + " pts"}
          </span>
          {host === userName && (
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
      </div>
    );
  } else {
    return (
      <div className={styles.game_room_user_container}>
        <div className={styles.game_room_user_avatar}>
          <div
            className={styles.avatar_image}
            style={{ backgroundImage: `url(${123})` }}
          />
        </div>
        <div className={styles.game_room_user_infos}>
          <span className={styles.game_room_user_name}>{"EMPTY"}</span>
        </div>
      </div>
    );
  }
};

export default GameRoomUserItem;
