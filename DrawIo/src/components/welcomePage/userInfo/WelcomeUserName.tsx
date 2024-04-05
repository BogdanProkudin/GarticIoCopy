import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { setUserNameInputValue } from "../../../store/slices/userAuth";
import styles from "../styles.module.scss";
import { FaRegUser } from "react-icons/fa";
import UserNameErrorModal from "./modal/UserNameErrorModal";
import { useState } from "react";
function WelcomeUserName() {
  const dispatch = useAppDispatch();
  const userNameInputValue = useAppSelector(
    (state) => state.userAuth.userNameInputValue
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
      <input value={userNameInputValue} onChange={handleInputChange} />
      <UserNameErrorModal />
    </div>
  );
}
export default WelcomeUserName;
