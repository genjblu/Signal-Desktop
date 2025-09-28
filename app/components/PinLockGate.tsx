import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PinPromptModal from './PinPromptModal';
import { unlockApp, wipeSessionAndRelink } from '../store/pinLockSlice';

const PinLockGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isLocked = useSelector((state: any) => state.pinLock.locked);
  const dispatch = useDispatch();

  if (isLocked) {
    return <PinPromptModal
      onUnlock={() => dispatch(unlockApp())}
      onForgotPin={() => dispatch(wipeSessionAndRelink())}
    />;
  }
  return <>{children}</>;
};

export default PinLockGate;