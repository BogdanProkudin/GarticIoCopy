import { FaPen } from "react-icons/fa";
import styles from "../styles.module.scss";
import { useState } from "react";
import WelcomeChangeAvatarModal from "./modal/WelcomeChangeAvatarModal";
import { useAppSelector } from "../../../store/hook";

function WelcomeUserAvatar() {
  const [isOpen, setIsOpen] = useState(false);
  const activeAvatar = useAppSelector((state) => state.userAuth.activeAvatar);
  const openModal = () => setIsOpen(true);
  return (
    <div className={styles.welcome_user_avatar_container}>
      <div
        style={{
          backgroundImage: `url(${activeAvatar})`,
          height: activeAvatar.length > 60 ? "110px" : "",
          borderRadius: activeAvatar.length > 60 ? "100%" : "",
        }}
        className={styles.welcome_user_avatar}
      />
      <button onClick={openModal} className={styles.welcome_user_select_avatar}>
        <FaPen color="white" fontSize={24} />
      </button>
      <WelcomeChangeAvatarModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}

export default WelcomeUserAvatar;
