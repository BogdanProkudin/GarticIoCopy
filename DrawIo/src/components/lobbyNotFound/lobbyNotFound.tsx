import styles from "./styles.module.scss";

import LobbyNotFoundHeader from "./lobbyNotFoundHeader";
import LobbyNotFoundContent from "./lobbyNotFoundContent";
const LobbyNotFound = () => {
  return (
    <div className={styles.lobby_not_found_page_container}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,900;1,900&display=swap"
      />
      <LobbyNotFoundHeader />
      <LobbyNotFoundContent />
    </div>
  );
};

export default LobbyNotFound;
