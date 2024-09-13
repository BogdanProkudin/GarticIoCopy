import React, { useMemo } from "react";
import Lottie from "react-lottie";
import winAnimation from "../../../tools/Animation - 1719930962364.json";
import styles from "../styles.module.scss";
import { RootState } from "../../../store/store";
import { useAppSelector } from "../../../store/hook";

const defaultOptions = {
  loop: false,
  autoplay: true,
  animationData: winAnimation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const Winners: React.FC = () => {
  const winners = useAppSelector((state: RootState) => state.drawThema.winners);
  console.log("WQQQ", winners);

  const getWinnerStyle = useMemo(
    () => (index: number) => ({
      background: `url(${
        winners[index]?.userAvatar ||
        "https://gartic.io/static/images/avatar/svg/0.svg"
      })`,
    }),
    [winners]
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Congratulations!</h1>

      <div className={styles.podium}>
        {[1, 0, 2].map((index) => (
          <div
            key={index}
            className={`${styles.podium_step} ${styles[`step_${index + 1}`]}`}
          >
            <div
              style={getWinnerStyle(index)}
              className={styles.win_profile_picture}
            />

            <div className={styles.win_users_info}>
              {index === 0 && (
                <div className={styles.win_animation}>
                  <Lottie options={defaultOptions} />
                </div>
              )}
              <h2 className={styles.win_user_name}>
                {winners[index]?.userName || "Unknown"}
              </h2>
              <h3 className={styles.win_user_place}>{`${
                index + 1
              } - Place`}</h3>
              <span className={styles.win_user_points}>
                {`${winners[index]?.userPoints || 0} pts`}
              </span>
            </div>
          </div>
        ))}
      </div>
      <button className={styles.win_new_game_button}>NEW GAME</button>
    </div>
  );
};

export default Winners;
