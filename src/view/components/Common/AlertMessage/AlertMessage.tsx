import React, { useState, useEffect } from "react";
import "./AlertMessage.scss";

const AlertMessageHeb = {
  close: "סגור",
};

interface AlertMessageProps {
  message: string;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Whenever the message changes (even if it's the same), show the alert again
  useEffect(() => {
    if (message) {
      setIsVisible(true);
    }
  }, [message]);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <div className="alert-message-overlay">
      <div className="alert-message">
        <p>{message}</p>
        <button onClick={handleClose}>{AlertMessageHeb.close}</button>
      </div>
    </div>
  );
};

export default AlertMessage;
