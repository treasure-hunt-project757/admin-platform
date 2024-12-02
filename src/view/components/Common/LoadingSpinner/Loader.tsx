import React from 'react';
import './Loader.scss';

interface LoaderProps {
  isLoading: boolean;
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ isLoading, message }) => {
  if (!isLoading) return null;

  return (
    <div dir="rtl" className="loader-overlay">
      <div className="loader-container">
        <div className="loader-spinner"></div>
        {message && <div className="loader-message">{message}</div>}
      </div>
    </div>
  );
};

export default Loader;