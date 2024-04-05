import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import axios from "axios";
import { socket } from "../../socket";
import { useAppSelector } from "../../store/hook";
import DisconnectedModal from "../gameRoom/modal/gameRoomDisconnectedModal";
import { useState } from "react";
import UserNameTookModal from "./RoomInfo/modal/userNameTookModal";
const PrepareGameButton = () => {
  const navigate = useNavigate();
  const userName = useAppSelector((state) => state.userAuth.userNameInputValue);
  const userAvatar = localStorage.getItem("userAvatar");
  const userNameStorage = localStorage.getItem("userName");
  const activeAvatar = useAppSelector((state) => state.userAuth.activeAvatar);
  const [isUserNameTook, setIsUserNameTook] = useState(false);
  const roomData = useAppSelector((state) => state.drawThema.roomData);
  const handleJoinRoom = async () => {
    const currentUrl = window.location.href;
    const path = currentUrl;
    const parts = path.split("/");
    const roomId = parts[parts.length - 1];
    const userExists = roomData.usersInfo.some(
      (user: any) => user.userName === userName
    );
    setIsUserNameTook(false);
    if (userExists) {
      setIsUserNameTook(true);
      console.log("error not userName as your already in the game");
      return;
    }
    await axios.post("http://localhost:3000/joinRoom", {
      roomId,
      userInfo: {
        userAvatar: activeAvatar ? activeAvatar : userAvatar && userAvatar,
        userName: userName.length > 1 ? userName : userNameStorage,
        userPoints: 0,
        isActive: false,
      },
    });
    localStorage.setItem("123", "тру");
    userName.length >= 3 && localStorage.setItem("userName", userName);
    navigate(`/game/${roomId}`);
  };

  return (
    <>
      <button
        onClick={() => !isUserNameTook && handleJoinRoom()}
        className={styles.prepare_game_button}
      >
        <div className={styles.set_up_logo} />
        <strong>PLAY</strong>

        <UserNameTookModal
          setIsUserNameTook={setIsUserNameTook}
          isUserNameTook={isUserNameTook}
        />
      </button>
    </>
  );
};
export default PrepareGameButton;
