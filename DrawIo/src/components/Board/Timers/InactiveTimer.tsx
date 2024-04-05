import React, { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import styles from "../styles.module.scss";
import { socket } from "../../../socket";
import {
  setIsUserDraw,
  setChoosedWord,
  setIsRoundEnd,
} from "../../../store/slices/drawThema";
import { useAppDispatch, useAppSelector } from "../../../store/hook";

const InactiveTimer = () => {
  const dispatch = useAppDispatch();
  const activeIndex = useAppSelector((state) => state.drawThema.activeIndex);
  const currentUrl = window.location.href;
  const path = currentUrl;
  const parts = path.split("/");

  const handleSkipRound = () => {};
  const [completed, setCompleted] = useState<any>(100);

  const { width } = useSpring({
    from: { width: "100%" },
    to: { width: `${completed}%` },
    config: { duration: 60 }, // Уменьшаем длительность анимации
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCompleted((prev: any) => (prev > 0 ? prev - 1 : prev));
    }, 60); // Уменьшаем интервал для более плавной анимации

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ top: "14rem" }} className={styles.progressBarContainer}>
      <animated.div
        className={styles.progress_bar_lines}
        style={{ width, height: "10px", backgroundColor: "rgb(5, 187, 242)" }}
      />
    </div>
  );
};

export default InactiveTimer;
