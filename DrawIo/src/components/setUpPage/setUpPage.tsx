import { useEffect, useState } from "react";
import SetUpInfo from "./setUpInfo";
import SetUpUserInfo from "./setUpUserInfo";
import LottieSettings from "../../tools/Animation - 1725791635271.json";
import styles from "./styles.module.scss";
import Lottie from "react-lottie";
const SetUpPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const defaultOptions = {
    loop: true,
    autoplay: true,

    animationData: LottieSettings,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // useEffect(() => {
  //   let timeoutId: string | number | NodeJS.Timeout | undefined;

  //   if (isLoading) {
  //     // Устанавливаем задержку в 300ms перед показом текста loading
  //     timeoutId = setTimeout(() => {
  //       setIsLoading(true);
  //     }, 300);
  //   } else {
  //     // Если загрузка завершена, сразу убираем текст loading
  //     clearTimeout(timeoutId);
  //     setIsLoading(false);
  //   }

  //   // Чистим таймаут при демонтировании или изменении isLoading
  //   return () => clearTimeout(timeoutId);
  // }, [isLoading]);
  if (isLoading) {
    return (
      <div className={styles.set_up_loading}>
        <Lottie
          isClickToPauseDisabled
          style={{ height: "300px", width: "300px" }}
          options={defaultOptions}
        />
      </div>
    );
  }
  return (
    <div className={styles.set_up_page_container}>
      <SetUpUserInfo />
      <SetUpInfo setIsLoading={setIsLoading} />
    </div>
  );
};
export default SetUpPage;
