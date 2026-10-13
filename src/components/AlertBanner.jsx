import React from 'react';

export function AlertBanner({ type = 'error', message, onClose }) {
  if (!message) return null;

  const alertClass = type === 'success' ? 'alert-success' : type === 'info' ? 'alert-info' : 'alert-error';

  return (
    <div className={`alert ${alertClass}`}>
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'inherit' }}
        >
          &times;
        </button>
      )}
    </div>
  );
}
