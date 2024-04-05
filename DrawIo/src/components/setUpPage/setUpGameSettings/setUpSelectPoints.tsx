import Select from "react-select";
import styles from "../styles.module.scss";
import { useAppDispatch } from "../../../store/hook";
import { setSelectedPoints } from "../../../store/slices/drawThema";
const SetUpSelectPoints = () => {
  const dispatch = useAppDispatch();
  const customStyles = {
    singleValue: (provided: any) => ({
      ...provided,
      color: "#797979",
      fontFamily: "Nunito",
    }),
  };
  const options = [
    { value: 120, label: "120" },
    { value: 150, label: "150" },
    { value: 180, label: "180" },
    { value: 240, label: "240" },
  ];
  const handleChange = (selectedOption: any) => {
    dispatch(setSelectedPoints(selectedOption.value));
  };
  return (
    <Select
      className={styles.set_up_select_points}
      onChange={handleChange}
      options={options}
      placeholder={"70"}
      styles={customStyles}
    />
  );
};
export default SetUpSelectPoints;
