import WelcomeInfo from "./WelcomeInfo";
import WelcomeText from "./WelcomeText";

import styles from "./styles.module.scss";

import { useEffect, useRef, useState } from "react";

import { setIsUserJustLeftGame } from "../../store/slices/userInfo";
import UserNameErrorModal from "./userInfo/modal/UserNameErrorModal";
import UserOfflineModal from "./userInfo/modal/UserOfflineModal";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { useWelcomePageCursorTrail } from "../../hooks/useWelcomePageCursorTrail";

const WelcomePage = () => {
  const [canvasSize, setCanvasSize] = useState({
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  });
  const isUserOnline = useAppSelector((state) => state.userInfo.isUserOnline);
  const isUserJustLeftGame = useAppSelector(
    (state) => state.userInfo.isUserJustLeftGame
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { startAnimation } = useWelcomePageCursorTrail({
    canvasRef,
  });
  const dispatch = useAppDispatch();
  useEffect(() => {
    const resizeCanvas = () => {
      setCanvasSize({
        width: document.body.clientWidth,
        height: document.body.clientHeight,
      });
    };

    window.addEventListener("resize", resizeCanvas);

    if (matchMedia("(pointer:fine)").matches) {
      startAnimation();
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <>
      <canvas
        style={{
          zIndex: 100,
        }}
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
      />
      <div className={styles.welcome_page_container}>
        <WelcomeText />
        <WelcomeInfo />
        {!isUserOnline && <UserOfflineModal />}
        <UserNameErrorModal
          isOpen={isUserJustLeftGame}
          closeModal={() => dispatch(setIsUserJustLeftGame(false))}
          modalName="Alert"
          errorText="You have left or are already in a room. Please wait before joining or creating another."
        />
      </div>
    </>
  );
};

export default WelcomePage;
