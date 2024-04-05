import { useEffect, useRef, useState } from "react";
import styles from "../../styles.module.scss";
import { FaPen } from "react-icons/fa";
import { socket } from "../../../../socket";
import { useNavigate } from "react-router-dom";
import { ImCheckmark } from "react-icons/im";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import LottieSettings from "../../../../tools/Animation - 1712178550440.json";
import {
  setIsUserDraw,
  setChoosedWord,
  setIsRoundEnd,
  setIsAllUsersGuessed,
  setIsOneUserGuessed,
} from "../../../../store/slices/drawThema";
import Lottie from "react-lottie";
type AnswersTypes = {
  userName: string | null;
  message: string;
};
const GameRoomAnswers = () => {
  const [answers, setAnswers] = useState<AnswersTypes[]>([]);
  const [answersInputText, setAnswersInputText] = useState("");
  const userNameStorage = localStorage.getItem("userName");
  const currentUrl = window.location.href;
  const path = currentUrl;
  const parts = path.split("/");
  const roomId = parts[parts.length - 1];
  const [userGuessed, setUserGuessed] = useState<string[] | []>([]);
  const isRoundEnd = useAppSelector((state) => state.drawThema.isRoundEnd);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isShowGuessedAnimation, setIsShowGuessedAnimation] = useState(false);
  const choosedWord = useAppSelector((state) => state.drawThema.choosedWord);
  const messageRef = useRef<HTMLDivElement>(null);
  const activeIndex = useAppSelector((state) => state.drawThema.activeIndex);
  const activeUser = useAppSelector((state) => state.drawThema.activeUser);
  const isOneUserGuessed = useAppSelector(
    (state) => state.drawThema.isOneUserGuessed
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const roomUsers = useAppSelector((state) => state.drawThema.roomUsers);
  const selectedThema = useAppSelector(
    (state) => state.drawThema.selectedThema
  );
  const defaultLottieOptions = {
    loop: true,
    autoplay: true,

    animationData: LottieSettings,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    socket.on("getAnswer", async (data: any) => {
      const isGuessed = data.message === choosedWord;

      if (isGuessed && userNameStorage !== null) {
        setUserGuessed([...userGuessed, data.userName]);
      }
      const newMessage = {
        userName: data.userName,
        message: data.message,
        isGuessed,
      };

      setAnswers([...answers, newMessage]);
    });
  }, [answers, choosedWord, roomUsers]);
  useEffect(() => {
    if (userGuessed.length === roomUsers.length - 1) {
      //if all users guessed
      dispatch(setIsUserDraw(false));
      dispatch(setIsRoundEnd(false));
      dispatch(setIsAllUsersGuessed(true));
      setUserGuessed([]);
      socket.emit("nextUserCall", {
        roomId,
        users: roomUsers,
        index: activeIndex,
      });

      setTimeout(() => {
        dispatch(setIsAllUsersGuessed(false));
        socket.emit("startGame", { words: selectedThema.words, roomId });
        dispatch(setChoosedWord(""));
        dispatch(setIsUserDraw(true));
        dispatch(setIsRoundEnd(true));
      }, 5000);
    }
  }, [userGuessed]);

  useEffect(() => {
    scrollToBottom();
  }, [answers]);
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && answersInputText.length >= 1) {
      if (answersInputText === choosedWord) {
        dispatch(setIsOneUserGuessed(true));
        setIsShowGuessedAnimation(true);
      }
      socket.emit("answersSent", {
        userName: userNameStorage,
        message: answersInputText,
        roomId: roomId,
      });

      setAnswersInputText("");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsShowGuessedAnimation(false);
    }, 4000);
  }, [isShowGuessedAnimation]);
  return (
    <div className={styles.game_room_answers_container}>
      <h5>ANSWERS</h5>
      <div className={styles.game_room_answers_history}>
        <div className={styles.game_room_message_container}>
          {answers.map((el: any, index) => {
            return (
              <div
                style={{
                  flexDirection: el.message.length >= 29 ? "column" : "row",
                }}
                ref={messageRef}
                key={index}
                className={styles.game_room_message}
              >
                {!el.isGuessed ? (
                  <strong>{el.userName}</strong>
                ) : (
                  <ImCheckmark style={{ paddingRight: "10px" }} color="green" />
                )}

                <span style={{ color: el.isGuessed ? "#16a846" : "" }}>
                  {el.isGuessed && el.userName === userNameStorage
                    ? "You`ve found the answer"
                    : el.isGuessed
                    ? `${el.userName} get answer`
                    : el.message}
                </span>

                <div ref={messagesEndRef} />
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.game_room_answers_input_container}>
        <FaPen
          color="grey"
          fontSize={20}
          style={{
            position: "absolute",
            left: "25px",
            top: "63%",
            transform: "translateY(-50%)",
          }}
        />

        <div
          style={{ visibility: isShowGuessedAnimation ? "visible" : "hidden" }}
          className={styles.game_room_correct_answer_animation}
        >
          <Lottie
            options={defaultLottieOptions}
            style={{
              position: "relative",
              color: "red",
              zIndex: 3,
              width: "80px",
              height: "80px",
              top: "-1.2rem",
            }}
            isClickToPauseDisabled
          />
        </div>

        <input
          onChange={(e) => setAnswersInputText(e.target.value)}
          placeholder={
            userNameStorage === activeUser.userName
              ? "You drawing"
              : `Take a guess...`
          }
          disabled={userNameStorage === activeUser.userName}
          value={answersInputText}
          className={styles.game_room_answers_input}
          onKeyDown={handleKeyPress}
        ></input>
      </div>
    </div>
  );
};
export default GameRoomAnswers;
