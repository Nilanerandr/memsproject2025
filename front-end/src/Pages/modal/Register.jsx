import React, { useEffect, useRef, useState } from "react";
import "remixicon/fonts/remixicon.css";
import "./Login.css";
import "./register.css";

export default function RegisterModal({ open, onClose, onSubmit }) {
  const firstInputRef = useRef(null);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    if (!open) return;
    const esc = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", esc);
    setTimeout(() => firstInputRef.current?.focus(), 0);
    return () => document.removeEventListener("keydown", esc);
  }, [open, onClose]);

  // Nettoyer la prévisualisation quand le modal se ferme
  useEffect(() => {
    if (!open && photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
      setPhotoFile(null);
    }
  }, [open, photoPreview]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide');
        return;
      }
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
      setPhotoFile(file);
    }
  };

  const removePhoto = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
    setPhotoFile(null);
  };

  if (!open) return null;

  return (
    <div className="am-underlay" role="presentation" onClick={onClose}>
      <div
        className="am-modal"
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

        <form
          className="am-form"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            if (photoFile) {
              formData.set('photo', photoFile);
            }
            const data = Object.fromEntries(formData);
            onSubmit?.(data);
            onClose?.();
          }}
        >
          <div className="am-grid2">
            <label className="am-field">
              <span className="am-label">First name</span>
              <input 
                ref={firstInputRef} 
                name="firstName" 
                type="text" 
                required 
                placeholder="Jane" 
                className="am-input" 
              />
            </label>

            {/* Input Photo remplaçant lastName */}
            <label className="am-field">
              <span className="am-label">Photo</span>
              <div className="am-photo-wrapper">
                <input 
                  name="photo" 
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
                
                {photoPreview && (
                  <div className="am-photo-preview">
                    <img src={photoPreview} alt="Preview" />
                    <button 
                      type="button" 
                      className="am-photo-remove" 
                      onClick={removePhoto}
                      aria-label="Remove photo"
                    >
                      <i className="ri-close-circle-fill" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Input Nom ESP32 */}
          <label className="am-field">
            <span className="am-label">ESP32 Name</span>
            <input 
              name="esp32Name" 
              type="text" 
              required 
              placeholder="ESP32-001" 
              className="am-input" 
            />
          </label>

          <label className="am-field">
            <span className="am-label">Email</span>
            <input 
              name="email" 
              type="email" 
              required 
              placeholder="name@domain.com" 
              className="am-input" 
            />
          </label>

          <div className="am-grid2">
            <label className="am-field">
              <span className="am-label">Password</span>
              <div className="am-password">
                <input 
                  name="password" 
                  type={show1 ? "text" : "password"} 
                  required 
                  placeholder="••••••••" 
                  className="am-input" 
                />
                <button 
                  type="button" 
                  className="am-eye" 
                  aria-pressed={show1 ? "true" : "false"} 
                  aria-label={show1 ? "Hide password" : "Show password"} 
                  onClick={() => setShow1(s => !s)}
                >
                  <i className={show1 ? "ri-eye-off-line" : "ri-eye-line"} aria-hidden="true" />
                </button>
              </div>
            </label>

            <label className="am-field">
              <span className="am-label">Confirm</span>
              <div className="am-password">
                <input 
                  name="confirm" 
                  type={show2 ? "text" : "password"} 
                  required 
                  placeholder="••••••••" 
                  className="am-input" 
                />
                <button 
                  type="button" 
                  className="am-eye" 
                  aria-pressed={show2 ? "true" : "false"} 
                  aria-label={show2 ? "Hide password" : "Show password"} 
                  onClick={() => setShow2(s => !s)}
                >
                  <i className={show2 ? "ri-eye-off-line" : "ri-eye-line"} aria-hidden="true" />
                </button>
              </div>
            </label>
          </div>

          <button className="am-primary" type="submit">
            <i className="ri-user-add-line" aria-hidden="true" />
            <span>Create account</span>
          </button>

          <div className="am-legal">
            En créant un compte, accepter les conditions et la politique de confidentialité.
          </div>
        </form>

      
      </div>
    </div>
  );
}
