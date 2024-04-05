import styles from "../styles.module.scss";
import SetUpGameThemaItem from "./setUpGameThemaItem";
import themaList from "../../../tools/themas.json";

import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { setSelectedThema } from "../../../store/slices/drawThema";

const SetUpThemaList = () => {
  const dispatch = useAppDispatch();
  const selectedThema = useAppSelector(
    (state) => state.drawThema.selectedThema
  );
  const handleSelectThema = (selectedThemaIndex: number) => {
    console.log("current thema is ", themaList.themes[selectedThemaIndex]);
    dispatch(setSelectedThema(themaList.themes[selectedThemaIndex]));
  };
  return (
    <div className={styles.set_up_thema_list}>
      {themaList.themes.map((thema, index) => {
        return (
          <div
            onClick={() => handleSelectThema(index)}
            key={thema.name}
            style={{
              borderColor: thema.name === selectedThema.name ? "#1791ff" : "",
            }}
            className={styles.set_up_thema_item_container}
          >
            <SetUpGameThemaItem themaName={thema.name} icon={thema.icon} />
          </div>
        );
      })}
    </div>
  );
};

export default SetUpThemaList;
