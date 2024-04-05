import { TfiCup } from "react-icons/tfi";
import useGetRoomData from "../../../hooks/useRoomInfo";
import styles from "../styles.module.scss";
import { FaRegUser } from "react-icons/fa6";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { setRoomData } from "../../../store/slices/drawThema";

const PrepareGameRoomData = () => {
  const currentUrl = window.location.href;
  const path = currentUrl;
  const parts = path.split("/");
  const roomId = parts[parts.length - 1];
  const userNameStorage = localStorage.getItem("userName");
  const dispatch = useAppDispatch();
  const roomData = useAppSelector((state) => state.drawThema.roomData);

  if (roomData.length === 0) {
    return;
  }
  return (
    <div className={styles.prepare_game_room_data_container}>
      <h3>
        {roomData.thema.name}#{roomId}
      </h3>
      <ul>
        <li>
          <div style={{ backgroundImage: `url(${roomData.thema.icon})` }}></div>
          <span>
            <p>THEMA</p>
            <strong>{roomData.thema.name}</strong>
          </span>
        </li>
        <li>
          <div>
            <TfiCup fontSize={30} fontWeight={800} color="blue" />
          </div>
          <span>
            <p>POINTS</p>
            <strong>0/{roomData.points}</strong>
          </span>
        </li>
        <li>
          <div>
            <FaRegUser fontSize={28} fontWeight={800} color="blue" />
          </div>
          <span>
            <p>PLAYERS</p>
            <strong>1/{roomData.players}</strong>
          </span>
        </li>
      </ul>
    </div>
  );
};
export default PrepareGameRoomData;
