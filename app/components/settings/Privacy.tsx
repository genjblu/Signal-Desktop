import React, { useState } from 'react';
// import PinPromptModal from '../../components/PinPromptModal';

const Privacy: React.FC = () => {
  const [pinLockEnabled, setPinLockEnabled] = useState(false);
  const [showSetPinModal, setShowSetPinModal] = useState(false);

  const handleEnablePinLock = () => {
    setShowSetPinModal(true);
  };

  const handleDisablePinLock = async () => {
    await window.electronAPI.wipePin();
    setPinLockEnabled(false);
    alert('PIN lock disabled');
  };

  const handlePinSet = () => {
    setPinLockEnabled(true);
    setShowSetPinModal(false);
    alert('PIN lock enabled');
  };

  return (
    <div>
      {/* Existing Privacy settings code here */}

      <h2>PIN Lock</h2>
      <div style={{ marginBottom: '1em' }}>
        <p>
          Add an extra layer of security with a local PIN lock. If you forget your PIN, you will need to re-link this device and your message history will be wiped.
        </p>
        {pinLockEnabled ? (
          <div
            onClick={handleDisablePinLock}
            className="button-like-style"
            role="button"
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter') handleDisablePinLock(); }}
          >
            Disable PIN Lock
          </div>
        ) : (
          <div
            onClick={handleEnablePinLock}
            className="button-like-style"
            role="button"
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter') handleEnablePinLock(); }}
          >
            Enable PIN Lock
          </div>
        )}
      </div>

      {showSetPinModal && (
        <div>
          <h3>Set your PIN</h3>
          <div
            onClick={handlePinSet}
            className="button-like-style"
            role="button"
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter') handlePinSet(); }}
          >
            Set PIN (demo)
          </div>
          <div
            onClick={() => setShowSetPinModal(false)}
            className="button-like-style"
            role="button"
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter') setShowSetPinModal(false); }}
          >
            Cancel
          </div>
        </div>
      )}
    </div>
  );
};

export default Privacy;