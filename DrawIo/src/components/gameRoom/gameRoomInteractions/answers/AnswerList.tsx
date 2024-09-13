import { useRef, useCallback } from "react";
import styles from "../../styles.module.scss";
import Answer from "./Answer";
import { AnswerTypes } from "./gameRoomAnswers";
type AnswerListProps = {
  answers: AnswerTypes[];
};
const AnswerList: React.FC<AnswerListProps> = ({ answers }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div
      className={styles.game_room_answers_history}
      role="log"
      aria-label="Answer history"
    >
      <div className={styles.game_room_message_container}>
        {answers.map((answer, index) => (
          <div key={index}>
            <Answer scrollToBottom={scrollToBottom} answer={answer} />
            <div ref={messagesEndRef} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnswerList;
