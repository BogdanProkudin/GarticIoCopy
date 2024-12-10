import { useAppDispatch, useAppSelector } from "../../store/hook";
import WelcomeInfo from "./WelcomeInfo";
import WelcomeText from "./WelcomeText";
import { setIsUserJustLeftGame } from "../../store/slices/userInfo";
import styles from "./styles.module.scss";
import UserNameErrorModal from "./userInfo/modal/UserNameErrorModal";
import UserOfflineModal from "./userInfo/modal/UserOfflineModal";
function WelcomePage() {
  const isUserOnline = useAppSelector((state) => state.userInfo.isUserOnline);
  const isUserFullyLeft = useAppSelector(
    (state) => state.userInfo.isUserJustLeftGame
  );
  const dispatch = useAppDispatch();
  return (
    <div className={styles.welcome_page_container}>
      <WelcomeText />
      <WelcomeInfo />
      {!isUserOnline && <UserOfflineModal />}
      <UserNameErrorModal
        isModalOpen={isUserFullyLeft}
        setIsModalOpen={() => dispatch(setIsUserJustLeftGame(false))}
        modalName="Alert"
        errorText="You have just left the game room. Please wait a moment before joining a new game or creating a room."
      />
    </div>
  );
}

export default WelcomePage;
