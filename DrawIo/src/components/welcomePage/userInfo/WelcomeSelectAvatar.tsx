import { Dispatch, SetStateAction } from "react";
import styles from "../styles.module.scss";
type WelcomeSelectAvatarProps = {
  avatarLink: string;
  index: number;
  activeAvatarIndex: number;

  setActiveAvatarIndex: Dispatch<SetStateAction<number>>;
};
const WelcomeSelectAvatar: React.FC<WelcomeSelectAvatarProps> = ({
  avatarLink,
  index,
  setActiveAvatarIndex,
  activeAvatarIndex,
}) => {
  const handleSelectAvatar = (selectedAvatarIndex: number) => {
    setActiveAvatarIndex(selectedAvatarIndex);
  };

  return (
    <div
      onClick={() => handleSelectAvatar(index)}
      data-testid={`avatar-${index}`} // Добавленный атрибут для теста
      key={index}
      style={{ borderColor: index === activeAvatarIndex ? "#1791ff" : "" }}
      className={styles.avatar_item_container}
    >
      <div
        className={styles.welcome_user_avatar}
        style={{
          backgroundImage: `url(${avatarLink})`,
        }}
      />
    </div>
  );
};
export default WelcomeSelectAvatar;
