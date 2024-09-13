import React, { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import styles from "../styles.module.scss";

type InactiveTimerProps = {
  time: number;
};
const InactiveTimer: React.FC<InactiveTimerProps> = ({ time }) => {
  const [completed, setCompleted] = useState<any>(100);

  const { width } = useSpring({
    from: { width: "100%" },
    to: { width: `${completed}%` },
    config: { duration: 500 }, // Уменьшаем длительность анимации
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCompleted((prev: any) => (prev > 0 ? prev - 1 : prev));
    }, time); // Уменьшаем интервал для более плавной анимации

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
