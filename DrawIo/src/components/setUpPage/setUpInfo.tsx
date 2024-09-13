import { useMediaQuery } from "react-responsive";
import SetUpGameSettings from "./setUpGameSettings/setUpGameSettings";
import SetUpGameThema from "./setUpGameThema/setUpGameThema";
import SetUpGameThemaStartButton from "./setUpGameThema/setUpGameThemaStartButton";
import styles from "./styles.module.scss";
import { useState } from "react";
const SetUpInfo = ({ setIsLoading }: any) => {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 580px)" });

  return !isSmallScreen ? (
    <div className={styles.set_up_info_container}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,900;1,900&display=swap"
      />
      <div className={styles.welcome_info_container_play_image}>
        <div className={styles.welcome_info_play_image}>
          <h2>Set UP</h2>
        </div>
      </div>

      <div className={styles.set_up_content_container}>
        <SetUpGameSettings />
        <SetUpGameThema />
      </div>

      <SetUpGameThemaStartButton isLoading setIsLoading={setIsLoading} />
    </div>
  ) : (
    <div className={styles.set_up_info_small_screen_container}>
      <div className={styles.welcome_info_container_play_image}>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,900;1,900&display=swap"
        />
        <div className={styles.welcome_info_play_image}>
          <h2>Set UP</h2>
        </div>
      </div>
      <SetUpGameSettings />
      <SetUpGameThema />
      <SetUpGameThemaStartButton />
    </div>
  );
};

export default SetUpInfo;
