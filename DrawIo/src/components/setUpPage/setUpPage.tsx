import SetUpInfo from "./setUpInfo";
import SetUpUserInfo from "./setUpUserInfo";

import styles from "./styles.module.scss";

import UserNameErrorModal from "../welcomePage/userInfo/modal/UserNameErrorModal";
import { setIsUserJustLeftGame } from "../../store/slices/userInfo";
import { useAppSelector, useAppDispatch } from "../../store/hook";
const SetUpPage = () => {
  const isUserJustLeftGame = useAppSelector(
    (state) => state.userInfo.isUserJustLeftGame
  );
  const dispatch = useAppDispatch();

  return (
    <div className={styles.set_up_page_container}>
      <SetUpUserInfo />
      <SetUpInfo />
      <UserNameErrorModal
        isOpen={isUserJustLeftGame}
        closeModal={() => dispatch(setIsUserJustLeftGame(false))}
        modalName="Alert"
        errorText="You have left or are already in a room. Please wait before joining or creating another."
      />
    </div>
  );
};
export default SetUpPage;
