import styles from "../styles.module.scss";
import ToolsPicker from "./ToolsPicker/ToolsPicker";
import ColorsPicker from "./ColorsPicker/ColorsPicker";
import { useAppSelector } from "../../../store/hook";
import BrushSettings from "./BrushSettings/BrushSetting";
import Sidebar from "react-sidebar";
import AdditionalColorPicker from "./AdditionalColorTools/AdditionalColorPicker";
import { RootState } from "../../../store/store";
function DrawSettings() {
  const activeUser = useAppSelector(
    (state: RootState) => state.drawThema.activeUser
  );
  const userNameStorage = localStorage.getItem("userName");
  const drawColor = useAppSelector((state) => state.drawInfo.drawColor);

  const isToolsPanel = useAppSelector((state) => state.drawInfo.toolsPanel);

  return (
    <>
      {isToolsPanel && activeUser.userName === userNameStorage && (
        // <div className={styles.draw_settings_container}>
        // <ToolsPicker />
        // <ColorsPicker />
        // <div className={styles.colors_picker_additional_container}>
        //   {/*currentColor*/}
        //   <div
        //     style={{ background: drawColor }}
        //     className={styles.current_color_item}
        //   ></div>

        //   <AdditionalColorPicker />
        // </div>

        // <BrushSettings />
        // </div>
        <Sidebar
          overlayClassName={styles.sidebar_overlay}
          sidebar={
            <div className={styles.draw_settings_container}>
              <ToolsPicker />
              <ColorsPicker />
              <div className={styles.colors_picker_additional_container}>
                {/*currentColor*/}
                <div
                  style={{ background: drawColor }}
                  className={styles.current_color_item}
                ></div>

                <AdditionalColorPicker />
              </div>

              <BrushSettings />
            </div>
          }
          open={isToolsPanel}
          styles={{
            root: {
              position: "relative",
              width: "145px",
            },

            sidebar: {
              position: "relative",
            },
          }}
        ></Sidebar>
      )}
    </>
  );
}

export default DrawSettings;
