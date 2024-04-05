import styles from "./styles.module.scss";
type VariantWordProps = {
  word: string;
};
const VariantWord: React.FC<VariantWordProps> = ({ word }) => {
  return (
    <>
      <span className={styles.suggestion_word}>{word}</span>
      <button>
        <div />
        <strong>Draw</strong>
      </button>
    </>
  );
};
export default VariantWord;
