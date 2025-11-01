// SuccessToast.jsx
import React, { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import "./succes.css";

function SuccessToast({
  show,
  onClose,
  message = "Connexion réussie",
  duration = 6000,
}) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(t);
  }, [show, duration, onClose]);

  return (
    <div
      className={`st__container ${show ? "st__visible" : ""}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{ "--st-duration": `${duration}ms` }}
    >
      <div className="st__toast">
        <span className="st__icon" aria-hidden="true">
          <FaCheckCircle className="iconrs" size={22} />
        </span>
        <span className="st__text">{message}</span>
        <div className="st__progress" />
      </div>
    </div>
  );
}

export default SuccessToast;
