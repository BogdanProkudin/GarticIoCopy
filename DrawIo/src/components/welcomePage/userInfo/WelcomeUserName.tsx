import { useAppDispatch, useAppSelector } from "../../../store/hook";
import {
  setIsUserNameError,
  setUserNameInputValue,
} from "../../../store/slices/userAuth";
import styles from "../styles.module.scss";
import { FaRegUser } from "react-icons/fa";
import UserNameErrorModal from "./modal/UserNameErrorModal";

function WelcomeUserName() {
  const dispatch = useAppDispatch();
  const userNameInputValue = useAppSelector(
    (state) => state.userAuth.userNameInputValue
  );
  const isUserNameError = useAppSelector(
    (state) => state.userAuth.isUserNameError
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const inputValue = event.target.value;
    dispatch(setUserNameInputValue(inputValue));
  };

  return (
    <div className={styles.welcome_user_form_container}>
      <FaRegUser className={styles.welcome_user_form_icon} color="blue" />

      <span>NICKNAME:</span>
      <input
        id="usernameinput"
        value={userNameInputValue}
        onChange={handleInputChange}
      />
      <UserNameErrorModal
        modalName="Alert"
        errorText=" Invalid nickname: It must contain at least 2 characters, without special
        characters."
        isOpen={isUserNameError}
        closeModal={() => dispatch(setIsUserNameError(false))}
      />
    </div>
  );
}
export default WelcomeUserName;
