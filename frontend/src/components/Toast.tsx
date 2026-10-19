/** Render feedback inside the active dialog so modal content stays accessible. */
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export function Toast({ message }: { message: string | null }) {
  const [host, setHost] = useState<Element>(document.body);
  useEffect(() => {
    setHost(document.querySelector('dialog[open]') || document.body);
  });
  return createPortal(
    <div className={`toast ${message ? 'visible' : ''}`} role="status" aria-live="polite">
      {message}
    </div>,
    host,
  );
}
