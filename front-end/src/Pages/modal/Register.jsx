import React, { useEffect, useRef, useState } from "react";
import "remixicon/fonts/remixicon.css";
import "./Login.css";
import "./register.css";
import { registerUser } from "../../api/apiregisterandlogin.js";
import { createDeviceLink } from "../../api/apiowner.js";

export default function RegisterModal({ open, onClose, onSuccess }) {
  const firstInputRef = useRef(null);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // Nouveau state pour succès

  useEffect(() => {
    if (!open) return;
    const esc = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", esc);
    setTimeout(() => firstInputRef.current?.focus(), 0);
    return () => document.removeEventListener("keydown", esc);
  }, [open, onClose]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide');
        return;
      }
      setPhotoFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false); // Reset success

    try {
      const formData = new FormData(e.currentTarget);
      if (photoFile) formData.set('photo', photoFile);

      const userResponse = await registerUser(formData);
      const { user, token } = userResponse;

      localStorage.setItem('token', token);
      localStorage.setItem("id_user", user.id_user);

      await createDeviceLink({ nom_esp32: formData.get('nom_esp32') });

      setSuccess(true); // Marquer succès
      onSuccess?.("Inscription réussie");
      
      // On ferme le modal après un court délai pour que l'utilisateur voie le message
      setTimeout(() => {
        onClose?.();
        window.location.reload();
      }, 1500);

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="am-underlay" role="presentation" onClick={onClose}>
      <div
        className="am-modal  registernmodal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-title"
        aria-describedby="register-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="am-close" onClick={onClose} aria-label="Close">
          <i className="ri-close-line" aria-hidden="true" />
        </button>

        <header className="am-head">
          <div className="am-logo"><i className="ri-wifi-line" aria-hidden="true" /></div>
          <h2 id="register-title" className="am-title">Create account</h2>
          <p id="register-desc" className="am-desc">Fill in your information to get started.</p>
        </header>

        <form className="am-form" onSubmit={handleSubmit}>
          <div className="am-grid2">
            <label className="am-field">
              <span className="am-label">First name</span>
              <input ref={firstInputRef} name="name" type="text" required  className="am-input" />
            </label>

            <label className="am-field">
              <span className="am-label">Photo</span>
              <div className="am-photo-wrapper">
                <input
                  name="img"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="am-input-file"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="am-file-label">
                  <i className="ri-image-add-line" aria-hidden="true" />
                  <span>{photoFile ? photoFile.name : 'Choose photo'}</span>
                </label>
              </div>
            </label>
          </div>

          <label className="am-field">
            <span className="am-label">ESP32 Name</span>
            <input name="nom_esp32" type="text" required  className="am-input" />
          </label>

          <label className="am-field">
            <span className="am-label">Email</span>
            <input name="email" type="email" required  className="am-input" />
          </label>

          <div className="am-grid2">
            <label className="am-field">
              <span className="am-label">Password</span>
              <div className="am-password">
                <input name="password" type={show1 ? "text" : "password"} required  className="am-input" />
                <button type="button" className="am-eye" aria-pressed={show1 ? "true" : "false"} aria-label={show1 ? "Hide password" : "Show password"} onClick={() => setShow1(s => !s)}>
                  <i className={show1 ? "ri-eye-off-line" : "ri-eye-line"} aria-hidden="true" />
                </button>
              </div>
            </label>

            <label className="am-field">
              <span className="am-label">Confirm</span>
              <div className="am-password">
                <input name="confirm" type={show2 ? "text" : "password"} required  className="am-input" />
                <button type="button" className="am-eye" aria-pressed={show2 ? "true" : "false"} aria-label={show2 ? "Hide password" : "Show password"} onClick={() => setShow2(s => !s)}>
                  <i className={show2 ? "ri-eye-off-line" : "ri-eye-line"} aria-hidden="true" />
                </button>
              </div>
            </label>
          </div>

          <button className="am-primary" type="submit" disabled={loading}>
            <i className="ri-user-add-line" aria-hidden="true" />
            <span>
              {loading ? "Processing..." : success ? "Inscription réussie" : "Create account"}
            </span>
          </button>

          <div className="am-legal">
            En créant un compte, accepter les conditions et la politique de confidentialité.
          </div>
        </form>
      </div>
    </div>
  );
}
