// import { Dispatch, SetStateAction, useState } from "react";
// import * as Modal from "react-modal";
// import styles from "../../styles.module.scss";
// import { MdClose } from "react-icons/md";
// import WelcomeSelectAvatar from "../WelcomeSelectAvatar";
// import { useMediaQuery } from "react-responsive";
// import { useAppDispatch } from "../../../../store/hook";
// import { setActiveAvatar } from "../../../../store/slices/userAuth";
// import ReactDOM from "react-dom";
// type ChangeAvatarModalProps = {
//   isOpen: boolean;
//   setIsOpen: Dispatch<SetStateAction<boolean>>;
// };

// export default function WelcomeChangeAvatarModal({
//   isOpen,
//   setIsOpen,
// }: ChangeAvatarModalProps): JSX.Element {
//   const isBigScreen = useMediaQuery({ maxWidth: 641 });
//   const [activeAvatarIndex, setActiveAvatarIndex] = useState<number>(0);
//   const dispatch = useAppDispatch();

//   const closeModal = () => {
//     setIsOpen(false);
//   };

//   const confirmModal = () => {
//     const selectedAvatar = avatars[activeAvatarIndex];
//     dispatch(setActiveAvatar(selectedAvatar));
//     setIsOpen(false);
//   };

//   const avatars: string[] = !isBigScreen
//     ? [
//         "https://gartic.io/static/images/avatar/svg/0.svg",
//         "https://gartic.io/static/images/avatar/svg/2.svg",
//         "https://gartic.io/static/images/avatar/svg/9.svg",
//         "https://gartic.io/static/images/avatar/svg/17.svg",
//         "https://gartic.io/static/images/avatar/svg/20.svg",
//         "https://gartic.io/static/images/avatar/svg/16.svg",
//         "https://gartic.io/static/images/avatar/svg/22.svg",
//         "https://gartic.io/static/images/avatar/svg/1.svg",
//         "https://cdn.discordapp.com/attachments/1041468251093344317/1219256472228200518/image.png?ex=661d1913&is=660aa413&hm=bdfd9c7ee57f4a285e3d8198ca2100dbe89799ccf601e9a2d9e7727f2e666749&",
//         "https://cdn.discordapp.com/attachments/1041468251093344317/1219261045588361346/image.png?ex=660aa856&is=65f83356&hm=5f028e4521c7d4b18dea327547066b2d26bc640fa27fb24ebcf4e0492e7ad5b0&",
//       ]
//     : [
//         "https://gartic.io/static/images/avatar/svg/0.svg",
//         "https://gartic.io/static/images/avatar/svg/2.svg",
//         "https://gartic.io/static/images/avatar/svg/9.svg",
//         "https://gartic.io/static/images/avatar/svg/17.svg",
//         "https://gartic.io/static/images/avatar/svg/20.svg",
//         "https://gartic.io/static/images/avatar/svg/16.svg",
//         "https://gartic.io/static/images/avatar/svg/22.svg",
//         "https://gartic.io/static/images/avatar/svg/1.svg",
//         "https://gartic.io/static/images/avatar/svg/23.svg",
//       ];

//   return (
//     <div className={styles.change_avatar_modal_container}>
//       <Modal
//         isOpen={isOpen}
//         onRequestClose={closeModal}
//         className={styles.modal_content}
//         overlayClassName={styles.modal_overlay}
//         ariaHideApp={false}
//         contentLabel="Example Modal"
//         style={{
//           overlay: {
//             backgroundColor: "rgba(0, 0, 0, 0.5)",
//           },
//         }}
//       >
//         <div className={styles.change_avatar_title_container}>
//           <div className={styles.change_avatar_title}>
//             <h3>AVATAR</h3>
//           </div>
//         </div>
//         <div className={styles.welcome_user_avatar_list}>
//           {avatars.map((avatarLink: string, index) => (
//             <WelcomeSelectAvatar
//               key={index}
//               activeAvatarIndex={activeAvatarIndex}
//               setActiveAvatarIndex={setActiveAvatarIndex}
//               avatarLink={avatarLink}
//               index={index}
//             />
//           ))}
//         </div>
//         <button
//           onClick={closeModal}
//           className={styles.welcome_avatar_close_button}
//         >
//           <MdClose fontSize={40} color="grey" data-testid="close-button" />
//         </button>
//         <button
//           className={styles.weclcome_avatar_confirm_button}
//           onClick={confirmModal}
//         >
//           <div />
//           <strong>CONFIRM</strong>
//         </button>
//       </Modal>
//     </div>
//   );
// }
// ReactDOM.render(
//   <WelcomeChangeAvatarModal
//     isOpen={false}
//     setIsOpen={function (value: SetStateAction<boolean>): void {
//       throw new Error("Function not implemented.");
//     }}
//   />,
//   document.getElementById("main")
// );

import { Dispatch, SetStateAction, useState } from "react";
import ReactModal from "react-modal";
import styles from "../../styles.module.scss";
import { MdClose } from "react-icons/md";
import WelcomeSelectAvatar from "../WelcomeSelectAvatar";
import { useMediaQuery } from "react-responsive";
import { useAppDispatch } from "../../../../store/hook";
import { setActiveAvatar } from "../../../../store/slices/userAuth";

type ChangeAvatarModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const WelcomeChangeAvatarModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const isBigScreen = useMediaQuery({ maxWidth: 641 });
  const [activeAvatarIndex, setActiveAvatarIndex] = useState<number>(0);
  const dispatch = useAppDispatch();

  const closeModal = () => {
    setIsOpen(false);
  };

  const confirmModal = () => {
    const selectedAvatar = avatars[activeAvatarIndex];
    dispatch(setActiveAvatar(selectedAvatar));
    setIsOpen(false);
  };

  const avatars: string[] = !isBigScreen
    ? [
        "https://gartic.io/static/images/avatar/svg/0.svg",
        "https://gartic.io/static/images/avatar/svg/2.svg",
        "https://gartic.io/static/images/avatar/svg/9.svg",
        "https://gartic.io/static/images/avatar/svg/17.svg",
        "https://gartic.io/static/images/avatar/svg/20.svg",
        "https://gartic.io/static/images/avatar/svg/16.svg",
        "https://gartic.io/static/images/avatar/svg/22.svg",
        "https://gartic.io/static/images/avatar/svg/1.svg",
        "https://cdn.discordapp.com/attachments/1041468251093344317/1219256472228200518/image.png?ex=661d1913&is=660aa413&hm=bdfd9c7ee57f4a285e3d8198ca2100dbe89799ccf601e9a2d9e7727f2e666749&",
        "https://cdn.discordapp.com/attachments/1041468251093344317/1219261045588361346/image.png?ex=660aa856&is=65f83356&hm=5f028e4521c7d4b18dea327547066b2d26bc640fa27fb24ebcf4e0492e7ad5b0&",
      ]
    : [
        "https://gartic.io/static/images/avatar/svg/0.svg",
        "https://gartic.io/static/images/avatar/svg/2.svg",
        "https://gartic.io/static/images/avatar/svg/9.svg",
        "https://gartic.io/static/images/avatar/svg/17.svg",
        "https://gartic.io/static/images/avatar/svg/20.svg",
        "https://gartic.io/static/images/avatar/svg/16.svg",
        "https://gartic.io/static/images/avatar/svg/22.svg",
        "https://gartic.io/static/images/avatar/svg/1.svg",
        "https://gartic.io/static/images/avatar/svg/23.svg",
      ];

  return (
    <div className={styles.change_avatar_modal_container}>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        className={styles.modal_content}
        overlayClassName={styles.modal_overlay}
        ariaHideApp={false}
        contentLabel="Example Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <div className={styles.change_avatar_title_container}>
          <div className={styles.change_avatar_title}>
            <h3>AVATAR</h3>
          </div>
        </div>
        <div className={styles.welcome_user_avatar_list}>
          {avatars.map((avatarLink: string, index) => (
            <WelcomeSelectAvatar
              key={index}
              activeAvatarIndex={activeAvatarIndex}
              setActiveAvatarIndex={setActiveAvatarIndex}
              avatarLink={avatarLink}
              index={index}
            />
          ))}
        </div>
        <button
          onClick={closeModal}
          className={styles.welcome_avatar_close_button}
        >
          <MdClose fontSize={40} color="grey" />
        </button>
        <button
          className={styles.weclcome_avatar_confirm_button}
          onClick={confirmModal}
        >
          <div />
          <strong>CONFIRM</strong>
        </button>
      </ReactModal>
    </div>
  );
};

export default WelcomeChangeAvatarModal;
