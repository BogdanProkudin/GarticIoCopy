import { ImCheckmark } from "react-icons/im";
import styles from "../../styles.module.scss";
import { AnswerTypes } from "./gameRoomAnswers";
import { FaPencilAlt } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";
import { LuAlarmClock } from "react-icons/lu";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { useEffect, useState } from "react";
import { setRoundCount } from "../../../../store/slices/roomInfo";
enum MessageType {
  Interval,
  Correct,
  Incorrect,
  LostTurn,
  YourTurn,
  NotGuessed,
}
type AnswerProps = {
  answer: AnswerTypes;
  scrollToBottom: () => void;
};
const Answer: React.FC<AnswerProps> = ({ answer, scrollToBottom }) => {
  const userNameStorage = localStorage.getItem("userName");
  const choosedWord = useAppSelector((state) => state.drawThema.choosedWord);

  const roundCount = useAppSelector((state) => state.drawThema.roundCount);
  const choosedWordsList = useAppSelector(
    (state) => state.drawThema.choosedWordsList
  );
  const dispatch = useAppDispatch();
  const [messagesHistory, setMessageHistory] = useState<any[]>([]);
  useEffect(() => {
    scrollToBottom();
  }, [messagesHistory, scrollToBottom]);

  function getMessage(
    answer: AnswerTypes,
    type: MessageType
  ): string | React.ReactNode {
    switch (type) {
      case MessageType.Interval:
        setMessageHistory([
          ...messagesHistory,
          <span style={{ gap: "5px", marginLeft: "-5px" }}>
            <LuAlarmClock color="blue" height={30} width={30} />
            Interval...
          </span>,
        ]);
        return;

      case MessageType.LostTurn:
        setMessageHistory([
          ...messagesHistory,
          <span style={{ gap: "5px" }}>
            <IoWarning color="red" height={30} width={30} />

            {answer.userName === userNameStorage
              ? `You lost your turn`
              : `${answer.userName} lost turn`}
          </span>,
        ]);
        return;
      case MessageType.YourTurn:
        setMessageHistory([
          ...messagesHistory,
          <span style={{ gap: "5px" }}>
            <FaPencilAlt color="blue" height={20} width={20} />
            {answer.userName === userNameStorage
              ? `Your turn`
              : `Turn of ${answer.userName}`}
          </span>,
        ]);
        return;

      case MessageType.NotGuessed:
        setMessageHistory([
          ...messagesHistory,
          <span style={{ color: "blue", gap: "5px" }}>
            <FaPencilAlt color="blue" height={20} width={20} />
            {answer.message === "the answer was" && `The answer was:`}
            <strong className={styles.correct_answer_text}>
              {choosedWordsList[roundCount === 2 ? 0 : roundCount - 2]}
            </strong>
          </span>,
        ]);
        return;
      case MessageType.Correct:
        setMessageHistory([
          ...messagesHistory,
          <>
            <ImCheckmark style={{ color: "green" }} />
            {answer.message !== "Everybody guessed correctly!"
              ? `${
                  answer.userName === userNameStorage
                    ? "You guessed correct"
                    : `${answer.userName} got the correct answer`
                } `
              : "Everybody guessed correctly!"}
          </>,
        ]);
        return;

      case MessageType.Incorrect:
        setMessageHistory([...messagesHistory, answer.message]);
        return;
    }
  }
  function getColor(type: MessageType): string {
    switch (type) {
      case MessageType.Interval:
        return "blue";
      case MessageType.NotGuessed:
        return "blue";
      case MessageType.Correct:
        return "green";
      case MessageType.LostTurn:
        return "red";
      case MessageType.YourTurn:
        return "blue";
      case MessageType.Incorrect:
        return "";
    }
  }
  function getMessageType(answer: AnswerTypes) {
    if (answer.message === "Interval...") {
      return MessageType.Interval;
    }
    if (answer.message === `the answer was`) {
      return MessageType.NotGuessed;
    }
    if (answer.message === "Everybody guessed correctly!") {
      return MessageType.Correct;
    }
    if (answer.message.includes("lost turn :()")) {
      return MessageType.LostTurn;
    }

    if (answer.message.includes("has next turn")) {
      return MessageType.YourTurn;
    }
    if (answer.isGuessed) {
      return MessageType.Correct;
    }

    return MessageType.Incorrect;
  }
  useEffect(() => {
    getMessage(answer, messageType);
  }, [answer]);
  const messageType = getMessageType(answer);

  return (
    <div className={styles.game_room_message}>
      {!answer.isGuessed &&
        answer.message !== "Everybody guessed correctly!" &&
        !answer.message.includes("lost turn :()") &&
        !answer.message.includes("the answer was") &&
        !answer.message.includes("has next turn") && (
          <strong>{answer.userName}</strong>
        )}

      <span style={{ color: getColor(messageType) }}>
        {messagesHistory.map((el, i) => {
          return <div key={i}>{el}</div>;
        })}
      </span>
    </div>
  );
};
export default Answer;
