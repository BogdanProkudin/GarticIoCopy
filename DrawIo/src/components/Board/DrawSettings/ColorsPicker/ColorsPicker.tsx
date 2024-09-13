import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { setDrawColor } from "../../../../store/slices/drawInfo";

import styles from "../../styles.module.scss";
const ColorsPicker = () => {
  const colors = [
    "Red",
    "Yellow",
    "Blue",
    "Green",
    "Purple",
    "Orange",
    "Pink",
    "Brown",
    "Black",
    "White",
    "Gray",
    "Cyan",
    "Maroon",
    "Lime",
    "Lavender",
  ];
  const dispatch = useAppDispatch();
  const drawColor = useAppSelector((state) => state.drawInfo.drawColor);

  return (
    <div className={styles.colors_pickers_container}>
      {colors.map((color) => (
        <div className={styles.color_picker_container} key={color}>
          <div
            onClick={() => dispatch(setDrawColor(color))}
            className={styles.color_picker_item}
            style={{
              backgroundColor: color,
              borderColor: color === drawColor ? "goldenrod" : "",
            }}
          />
        </div>
      ))}
    </div>
  );
};
export default ColorsPicker;
