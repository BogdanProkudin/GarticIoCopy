import { useMediaQuery } from "react-responsive";
import styles from "./styles.module.scss";
import stylesFromSetUp from "../setUpPage/styles.module.scss";
import { useNavigate } from "react-router-dom";
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
