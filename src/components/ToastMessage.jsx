import { useEffect } from "react";

function ToastMessage({ toast, onClose }) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 2800);

    return () => window.clearTimeout(timer);
  }, [toast.id, onClose]);

  return <div className={`toast toast--${toast.tone}`}>{toast.message}</div>;
}

export default ToastMessage;
