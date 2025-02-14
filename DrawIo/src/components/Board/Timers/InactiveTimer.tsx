import React, { useEffect, useRef } from "react";

import styles from "../styles.module.scss";

type InactiveTimerProps = {
  time: number;
};
const InactiveTimer: React.FC<InactiveTimerProps> = () => {
  const boxRef = useRef<any>(null);
  useEffect(() => {
    const box = boxRef.current;
    let startTime: any = null;

    const animate = (timestamp: any) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const duration = 6400; // 7 секунд

      if (progress < duration) {
        const scale = 1 - progress / duration; // Уменьшаем масштаб по X
        box.style.transform = `scaleX(${scale})`;
        requestAnimationFrame(animate);
      } else {
        console.log("закончилось анимация");

        box.style.transform = "scaleX(0)"; // Завершаем анимацию
      }
    };

    requestAnimationFrame(animate);
  }, []);
  return (
    <div style={{ top: "14rem" }} className={styles.progressBarContainer}>
      <div
        ref={boxRef}
        style={{
          width: "100%",
          borderBottomLeftRadius: "10px",
          borderTopLeftRadius: "10px",
          height: "10px",
          backgroundColor: "rgb(5, 187, 242)",
          transformOrigin: "left", // Точка отсчета для трансформации
        }}
      ></div>
    </div>
  );
};

export default InactiveTimer;
