import { useRef } from "react";
import styles from "../../styles.module.scss";
import { useAppDispatch } from "../../../../store/hook";
import { setDrawColor } from "../../../../store/slices/drawInfo";

const AdditionalColorPicker = () => {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const handleColorWheelClick = () => {
    if (colorInputRef.current) {
      colorInputRef.current.click();
    }
  };
  const dispatch = useAppDispatch();
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedColor = event.target.value;
    dispatch(setDrawColor(selectedColor));
  };
  return (
    <div
      className={styles.color_additional_picker}
      onClick={handleColorWheelClick}
    >
      <svg width="100%" viewBox="0 0 100 100">
        <path
          d="M 50.0000 20.0000 A 30 30 0 0 1 65.0000 24.0192"
          stroke="rgb(252, 254, 7)"
          stroke-width="30"
        />
        <path
          d="M 65.0000 24.0192 A 30 30 0 0 1 75.9808 35.0000"
          stroke="rgb(252, 143, 9)"
          stroke-width="30"
        />
        <path
          d="M 75.9808 35.0000 A 30 30 0 0 1 80.0000 50.0000"
          stroke="rgb(252, 91, 9)"
          stroke-width="30"
        />
        <path
          d="M 80.0000 50.0000 A 30 30 0 0 1 75.9808 65.0000"
          stroke="rgb(252, 44, 8)"
          stroke-width="30"
        />
        <path
          d="M 75.9808 65.0000 A 30 30 0 0 1 65.0000 75.9808"
          stroke="rgb(198, 6, 9)"
          stroke-width="30"
        />
        <path
          d="M 65.0000 75.9808 A 30 30 0 0 1 50.0000 80.0000"
          stroke="rgb(145, 6, 89)"
          stroke-width="30"
        />
        <path
          d="M 50.0000 80.0000 A 30 30 0 0 1 35.0000 75.9808"
          stroke="rgb(89, 6, 90)"
          stroke-width="30"
        />
        <path
          d="M 35.0000 75.9808 A 30 30 0 0 1 24.0192 65.0000"
          stroke="rgb(80, 6, 88)"
          stroke-width="30"
        />
        <path
          d="M 24.0192 65.0000 A 30 30 0 0 1 20.0000 50.0000"
          stroke="rgb(13, 50, 144)"
          stroke-width="30"
        />
        <path
          d="M 20.0000 50.0000 A 30 30 0 0 1 24.0192 35.0000"
          stroke="rgb(8, 91, 90)"
          stroke-width="30"
        />
        <path
          d="M 24.0192 35.0000 A 30 30 0 0 1 35.0000 24.0192"
          stroke="rgb(47, 141, 11)"
          stroke-width="30"
        />
        <path
          d="M 35.0000 24.0192 A 30 30 0 0 1 50.0000 20.0000"
          stroke="rgb(88, 200, 0)"
          stroke-width="30"
        />
      </svg>

      <input
        type="color"
        ref={colorInputRef}
        onChange={handleColorChange}
        style={{ width: "0px", height: "0px", opacity: 0 }}
      />
    </div>
  );
};

export default AdditionalColorPicker;
