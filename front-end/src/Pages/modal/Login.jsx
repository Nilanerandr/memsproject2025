import React, { useEffect, useRef, useState } from "react";
import "remixicon/fonts/remixicon.css";
import "./Login.css"; // même CSS partagé
import { LoginUser } from "../../api/apiregisterandlogin.js";

export default function LoginModal({ open, onClose }) {
  const dialogRef = useRef(null);
  const firstInputRef = useRef(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const esc = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", esc);
    setTimeout(() => firstInputRef.current?.focus(), 0);
    return () => document.removeEventListener("keydown", esc);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = Object.fromEntries(new FormData(e.currentTarget));
      const { email, password } = formData;

      // 🔹 Login
      const userResponse = await LoginUser({ email, password });

      // 🔹 Stocker le token
      const { token } = userResponse;
      localStorage.setItem("token", token);

      alert("Login réussi !");
      onClose?.();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors du login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="am-underlay" role="presentation" onClick={onClose}>
      <div
        className="am-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        aria-describedby="login-desc"
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="am-close" onClick={onClose} aria-label="Close">
          <i className="ri-close-line" aria-hidden="true" />
        </button>

        <header className="am-head">
          <div className="am-logo"><i className="ri-wifi-line" aria-hidden="true" /></div>
          <h2 id="login-title" className="am-title">Welcome back</h2>
          <p id="login-desc" className="am-desc">Please enter your details to login.</p>
        </header>

        <form className="am-form" onSubmit={handleSubmit}>
          <label className="am-field">
            <span className="am-label">Email</span>
            <input 
              name="email" 
              type="email" 
              ref={firstInputRef}
              required 
              placeholder="name@domain.com" 
              className="am-input" 
            />
          </label>

          <label className="am-field">
            <span className="am-label">Password</span>
            <div className="am-password">
              <input 
                name="password" 
                type={show ? "text" : "password"} 
                required 
                placeholder="••••••••" 
                className="am-input" 
              />
              <button
                type="button"
                className="am-eye"
                aria-pressed={show ? "true" : "false"}
                aria-label={show ? "Hide password" : "Show password"}
                onClick={() => setShow(s => !s)}
              >
                <i className={show ? "ri-eye-off-line" : "ri-eye-line"} aria-hidden="true" />
              </button>
            </div>
          </label>

          <label className="am-remember">
            <input name="remember" type="checkbox" /> <span>Remember me</span>
          </label>

          <button className="am-primary" type="submit" disabled={loading}>
            <i className="ri-login-box-line" aria-hidden="true" />
            <span>{loading ? "Processing..." : "Login"}</span>
          </button>

          <button className="am-linkbtn" type="button">Forgot password?</button>
        </form>

        <footer className="am-foot">
          <button className="am-altbtn"><i className="ri-apple-fill" /> Apple</button>
          <button className="am-altbtn"><i className="ri-google-fill" /> Google</button>
        </footer>
      </div>
    </div>
  );
}
