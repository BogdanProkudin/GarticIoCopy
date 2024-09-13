import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { setBrushWidth } from "../../../../store/slices/drawInfo";

import styles from "../../styles.module.scss";
const BrushSettings = ({}) => {
  const brushWidth = useAppSelector((state) => state.drawInfo.brushWidth);

  const dispatch = useAppDispatch();
  const handleSetBrushWidth = (width: string) => {
    dispatch(setBrushWidth(width));
  };

  return (
    <div className={styles.draw_brush_width_input_container}>
      <div className={styles.draw_brush_big_circle} />
      <input
        className={styles.draw_brush_width_input}
        type="range"
        min="1"
        max="50"
        value={brushWidth}
        onChange={(e) => handleSetBrushWidth(e.target.value)}
      />
      <div className={styles.draw_brush_small_circle} />
    </div>
  );
};

export default BrushSettings;
