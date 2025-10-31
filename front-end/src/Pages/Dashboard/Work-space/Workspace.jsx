// ComputerGrid.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "remixicon/fonts/remixicon.css"; /* icônes Remix Icon, préfixe ri- [web:48][web:13][web:19] */
import "./Workspace.css"; /* classes préfixées cm- pour éviter les collisions [web:23] */

export default function ComputerGrid({ machines = [], onRefreshPower, onSavePricePerMinute }) {
  const [power, setPower] = useState(() =>
    Object.fromEntries(machines.map(m => [m.id, m.watts || 0]))
  );
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [priceValue, setPriceValue] = useState(""); // prix par minute (ex: 50 FC/min ou 10 RWF/min selon besoin)
  const triggerRef = useRef(null);
  const inputRef = useRef(null);

  // Rafraîchit la puissance temps réel
  useEffect(() => {
    if (!onRefreshPower) return;
    const iv = setInterval(async () => {
      const updates = await Promise.all(
        machines.map(async m => {
          if (!m.active) return [m.id, 0];
          try {
            const w = await onRefreshPower(m.id);
            return [m.id, Number.isFinite(w) ? Math.max(0, Math.round(w)) : 0];
          } catch {
            return [m.id, 0];
          }
        })
      );
      setPower(prev => ({ ...prev, ...Object.fromEntries(updates) }));
    }, 3000);
    return () => clearInterval(iv);
  }, [machines, onRefreshPower]);

  const data = useMemo(
    () => machines.map(m => ({ ...m, watts: power[m.id] ?? m.watts ?? 0 })),
    [machines, power]
  );

  // Gestion modale (focus trap simplifié + ARIA)
  useEffect(() => {
    if (isPriceOpen) {
      const prevActive = document.activeElement;
      setTimeout(() => inputRef.current?.focus(), 0);
      const onKey = (e) => {
        if (e.key === "Escape") setIsPriceOpen(false);
      };
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("keydown", onKey);
        (prevActive || triggerRef.current)?.focus();
      };
    }
  }, [isPriceOpen]);

  const handleOpenPrice = () => setIsPriceOpen(true);
  const handleClosePrice = () => setIsPriceOpen(false);
  const handleSavePrice = () => {
    const num = Number(priceValue);
    if (!Number.isFinite(num) || num < 0) return;
    onSavePricePerMinute?.(num);
    setIsPriceOpen(false);
  };

  return (
    <>
      {/* Barre d’actions globale */}
      <div className="cm-toolbar">
        <button
          className="cm-primaryBtn"
          onClick={handleOpenPrice}
          ref={triggerRef}
          title="Définir le prix par minute"
        >
          <i className="ri-price-tag-3-line" aria-hidden="true" />
          <span>Prix/minute</span>
        </button>
      </div>

      {/* Grille des ordinateurs */}
      <section className="cm-grid" aria-label="Liste des ordinateurs">
        {data.map(m => {
          const hours = Math.floor((m.usedMinutes || 0) / 60);
          const minutes = (m.usedMinutes || 0) % 60;
          const timeText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

          return (
            <article
              key={m.id}
              className={`cm-card ${m.active ? "cm-card--on" : "cm-card--off"}`}
              role="group"
              aria-labelledby={`${m.id}-title`}
            >
              <header className="cm-head">
                <div className="cm-id">
                  <i className="ri-computer-line cm-id__icon" aria-hidden="true" />
                  <h3 id={`${m.id}-title`} className="cm-id__text">{m.id}</h3>
                </div>

                <div className={`cm-status ${m.active ? "cm-status--on" : "cm-status--off"}`} aria-live="polite">
                  <span className="cm-status__dot" aria-hidden="true" />
                  <span className="cm-status__label">{m.active ? "Allumé" : "Éteint"}</span>
                </div>
              </header>

              <div className="cm-metrics">
                <div className="cm-metric">
                  <i className="ri-time-line cm-metric__icon" aria-hidden="true" />
                  <span className="cm-metric__label">Durée</span>
                  <span className="cm-metric__value">{timeText}</span>
                </div>

                <div className="cm-metric">
                  <i className="ri-flashlight-fill cm-metric__icon" aria-hidden="true" />
                  <span className="cm-metric__label">Puissance</span>
                  <span className="cm-metric__value">
                    {m.active ? `${m.watts ?? 0} W` : "—"}
                  </span>
                </div>
              </div>

              <footer className="cm-foot">
                <button className="cm-ghostBtn" title="Voir détails">
                  <i className="ri-dashboard-3-line" aria-hidden="true" />
                  <span className="cm-srOnly">Détails {m.id}</span>
                </button>
                <button className="cm-ghostBtn" title="Notifier">
                  <i className="ri-notification-3-line" aria-hidden="true" />
                  <span className="cm-srOnly">Notifier {m.id}</span>
                </button>
                <button className="cm-ghostBtn" title="Menu">
                  <i className="ri-more-2-fill" aria-hidden="true" />
                  <span className="cm-srOnly">Menu {m.id}</span>
                </button>
              </footer>
            </article>
          );
        })}
      </section>

      {/* Modale Prix/minute */}
      {isPriceOpen && (
        <div className="cm-modalUnderlay" role="presentation">
          <div
            className="cm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cm-price-title"
            aria-describedby="cm-price-desc"
          >
            <header className="cm-modal__head">
              <i className="ri-price-tag-3-fill cm-modal__icon" aria-hidden="true" />
              <h4 id="cm-price-title" className="cm-modal__title">Définir le prix par minute</h4>
            </header>

            <p id="cm-price-desc" className="cm-modal__desc">
              Entrer un montant par minute; utiliser un nombre décimal si nécessaire.
            </p>

            <label className="cm-field">
              <span className="cm-field__label">Prix/minute</span>
              <div className="cm-field__control">
                <i className="ri-money-dollar-circle-line" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="number"
                  step="0.01"
                  min="0"
                  inputMode="decimal"
                  className="cm-input"
                  placeholder="ex. 10"
                  value={priceValue}
                  onChange={(e) => setPriceValue(e.target.value)}
                />
              </div>
            </label>

            <div className="cm-modal__actions">
              <button className="cm-secondaryBtn" onClick={handleClosePrice}>
                <i className="ri-close-line" aria-hidden="true" />
                <span>Annuler</span>
              </button>
              <button className="cm-primaryBtn" onClick={handleSavePrice}>
                <i className="ri-save-3-line" aria-hidden="true" />
                <span>Enregistrer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
