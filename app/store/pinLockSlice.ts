import { createSlice } from '@reduxjs/toolkit';
import { wipeLocalSession, showRelinkModal } from '../utils/sessionUtils';

const initialState = {
  locked: true,
  attempts: 0,
  lockoutEnd: null,
};

const pinLockSlice = createSlice({
  name: 'pinLock',
  initialState,
  reducers: {
    unlockApp(state) {
      state.locked = false;
      state.attempts = 0;
    },
    lockApp(state) {
      state.locked = true;
    },
    wipeSessionAndRelink(state) {
      wipeLocalSession();
      showRelinkModal();
      state.locked = true;
      state.attempts = 0;
    }
  }
});

export const { unlockApp, lockApp, wipeSessionAndRelink } = pinLockSlice.actions;
export default pinLockSlice.reducer;