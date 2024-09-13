import styles from "../../styles.module.scss";
import { BiSolidEraser } from "react-icons/bi";
import { FaPen } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { FaRegSmileWink } from "react-icons/fa";
import { BsPaintBucket } from "react-icons/bs";
import { setActiveTool } from "../../../../store/slices/drawInfo";

const ToolsPicker = () => {
  const dispatch = useAppDispatch();
  const activeTool = useAppSelector((state) => state.drawInfo.activeTool);
  const tools = [
    {
      name: "pen",
      icon: (
        <FaPen
          className={styles.tools_icon}
          color={activeTool === "pen" ? "gold" : ""}
          size={20}
        />
      ),
    },
    {
      name: "eraser",

      icon: (
        <BiSolidEraser
          className={styles.tools_icon}
          color={activeTool === "eraser" ? "gold" : ""}
          size={26}
        />
      ),
    },
    {
      name: "bucket",
      icon: (
        <BsPaintBucket
          color={activeTool === "bucket" ? "gold" : ""}
          className={styles.tools_icon}
          size={26}
        />
      ),
    },
    {
      name: "getColor",

      icon: (
        <FaRegSmileWink
          className={styles.tools_icon}
          color={activeTool === "getColor" ? "gold" : ""}
          size={24}
        />
      ),
    },
  ];
  return (
    <div className={styles.tools_picker_container}>
      {tools.map((tool, index) => {
        return (
          <div
            key={index}
            className={styles.tools_picker}
            onClick={() => dispatch(setActiveTool(tool.name))}
            style={{
              borderRight: index % 2 === 0 ? "1px solid #9b9b9b" : "",
            }}
          >
            {tool.icon}
          </div>
        );
      })}
    </div>
  );
};
export default ToolsPicker;
