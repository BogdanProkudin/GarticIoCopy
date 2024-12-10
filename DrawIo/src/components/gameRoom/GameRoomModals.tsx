import React from 'react';
import ShareGameModal from './modal/gameRoomShareGameModal';
import RulesGameModal from './modal/gameRoomRulesModal';
import { GameRoomModalProps } from '../../types/gameRoom';

export const GameRoomModals: React.FC<GameRoomModalProps> = ({
  showShareModal,
  showRulesModal,
  setShowShareModal,
  setShowRulesModal,
}) => {
  return (
    <>
      {showShareModal && <ShareGameModal setShowShareModal={setShowShareModal} />}
      {showRulesModal && <RulesGameModal setShowRulesModal={setShowRulesModal} />}
    </>
  );
};
