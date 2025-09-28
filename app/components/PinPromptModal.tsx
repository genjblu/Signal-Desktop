import React, { useState } from 'react';

interface PinPromptModalProps {
  onUnlock: () => void;
  onForgotPin: () => void;
}

const MAX_ATTEMPTS = 5;

const PinPromptModal: React.FC<PinPromptModalProps> = ({ onUnlock, onForgotPin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockedOut, setLockedOut] = useState(false);

  const handleSubmit = async () => {
    // TODO: Replace with keytar PIN hash verification
    const isPinCorrect = await window.electronAPI.verifyPin(pin);
    if (isPinCorrect) {
      onUnlock();
    } else {
      setAttempts(a => a + 1);
      setError('Incorrect PIN. Try again.');
      if (attempts + 1 >= MAX_ATTEMPTS) {
        setLockedOut(true);
      }
    }
  };

  if (lockedOut) {
    return (
      <div>
        <h2>Too many failed attempts</h2>
        <p>
          To regain access, you must re-link this desktop app to your mobile device. 
          This will erase your local message history cache on this computer.
        </p>
        <button onClick={onForgotPin}>Forgot PIN / Re-link Device</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Enter PIN to unlock</h2>
      <input
        type="password"
        value={pin}
        onChange={e => setPin(e.target.value)}
        disabled={lockedOut}
        autoFocus
      />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button onClick={handleSubmit} disabled={lockedOut}>Unlock</button>
      <button onClick={onForgotPin}>Forgot PIN?</button>
    </div>
  );
};

export default PinPromptModal;