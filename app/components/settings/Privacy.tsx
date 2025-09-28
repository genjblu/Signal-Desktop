import React, { useState } from 'react';
// Import your PIN modal/dialog if needed
// import PinPromptModal from '../../components/PinPromptModal';

const Privacy: React.FC = () => {
  // State for managing PIN lock status
  const [pinLockEnabled, setPinLockEnabled] = useState(false);
  const [showSetPinModal, setShowSetPinModal] = useState(false);

  // Optionally fetch this state from Redux/store
  // const pinLockEnabled = useSelector(...);

  const handleEnablePinLock = () => {
    setShowSetPinModal(true);
  };

  const handleDisablePinLock = async () => {
    // Remove PIN from secure storage
    await window.electronAPI.wipePin();
    setPinLockEnabled(false);
    alert('PIN lock disabled');
  };

  // This would be called after PIN is set in the modal
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
          <button onClick={handleDisablePinLock}>Disable PIN Lock</button>
        ) : (
          <button onClick={handleEnablePinLock}>Enable PIN Lock</button>
        )}
      </div>

      {/* Show PIN set/change modal if needed */}
      {showSetPinModal && (
        // Replace with your PIN modal implementation
        <div>
          {/* <PinPromptModal onUnlock={handlePinSet} /> */}
          <div>
            <h3>Set your PIN</h3>
            {/* Add PIN input fields and confirm logic here */}
            <button onClick={handlePinSet}>Set PIN (demo)</button>
            <button onClick={() => setShowSetPinModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Privacy;