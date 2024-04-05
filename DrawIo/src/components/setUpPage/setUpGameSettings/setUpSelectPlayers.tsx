import Select from "react-select";
import styles from "../styles.module.scss";
import { useAppDispatch } from "../../../store/hook";
import { setSelectedPlayers } from "../../../store/slices/drawThema";
const SetUpSelectPlayers = () => {
  const dispatch = useAppDispatch();
  const customStyles = {
    singleValue: (provided: any) => ({
      ...provided,
      color: "#797979",
      fontFamily: "Nunito",
    }),
  };
  const options = [
    { value: 5, label: "5" },
    { value: 6, label: "6" },
    { value: 7, label: "7" },
    { value: 8, label: "8" },
    { value: 9, label: "9" },
  ];
  const handleChange = (selectedOption: any) => {
    console.log(selectedOption);

    dispatch(setSelectedPlayers(selectedOption.value));
  };
  return (
    <Select
      className={styles.set_up_select_players}
      onChange={handleChange}
      options={options}
      placeholder={"5"}
      styles={customStyles}
    />
  );
};
export default SetUpSelectPlayers;
