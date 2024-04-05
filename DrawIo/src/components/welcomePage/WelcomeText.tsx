import styles from "./styles.module.scss";
function WelcomeText() {
  return (
    <div className={styles.welcome_text_container}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,900;1,900&display=swap"
      />
      <div className={styles.welcome_logo} />
      <span>DRAW, GUESS, WIN</span>
    </div>
  );
}
export default WelcomeText;
