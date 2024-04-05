import { useAppDispatch, useAppSelector } from "../../../store/hook";
import styles from "../styles.module.scss";
import { socket } from "../../../socket";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../../../store/slices/drawThema";

interface themaProps {
  name: string;
  icon: string;
  words: string[];
}
export interface roomDataProps {
  host: string | null;
  points: number;
  players: number;
  thema: themaProps;
  roomId: string;
  isInGame?: boolean;
  usersInfo: [
    {
      userAvatar: string | null;
      userName: string | null;
      userPoints: number;
      isActive: boolean;
    }
  ];
}
const SetUpGameThemaStartButton = () => {
  const hostUserName = localStorage.getItem("userName");
  const userAvatar = localStorage.getItem("userAvatar");
  const dispatch = useAppDispatch();

  const selectedThema = useAppSelector(
    (state) => state.drawThema.selectedThema
  );
  const selectedPlayers = useAppSelector(
    (state) => state.drawThema.selectedPlayers
  );
  const selectedPoints = useAppSelector(
    (state) => state.drawThema.selectedPoints
  );
  const navigate = useNavigate();
  function generateRoomId() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  const handleCreateNewRoom = async () => {
    if (selectedThema.name.length !== 0) {
      const roomId = generateRoomId();
      const roomData: roomDataProps = {
        usersInfo: [
          {
            userAvatar,
            userName: hostUserName,
            userPoints: 0,
            isActive: false,
          },
        ],
        host: hostUserName,
        points: selectedPoints,
        players: selectedPlayers,
        thema: selectedThema,
        roomId: roomId,
      };
      console.log(hostUserName, "hoar");

      socket.connect();
      await dispatch(createRoom(roomData));

      socket.emit("createRoom", roomData);
      localStorage.setItem("123", "тру");
      navigate(`/game/${roomId}`);
    }
  };
  return (
    <>
      <button
        onClick={() => handleCreateNewRoom()}
        className={
          selectedThema.name.length > 1
            ? styles.set_up_button
            : styles.set_up_not_active_button
        }
      >
        <div className={styles.set_up_logo} />
        <strong>NEW ROOM</strong>
        <span className={styles.set_up_button_error_message}>
          You must select a theme
        </span>
      </button>
    </>
  );
};
export default SetUpGameThemaStartButton;
