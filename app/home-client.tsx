"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import Footer from "./footer";

type AuthMode = "activate" | "login";
type ActivationStep = "code" | "privacy" | "pin" | "completed";

export default function HomeClient() {
  const [authMode, setAuthMode] = useState<AuthMode>("activate");
  const [activationStep, setActivationStep] = useState<ActivationStep>("code");
  const [activationCode, setActivationCode] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);
  const [newPin, setNewPin] = useState(["", "", "", ""]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sessionSuccess, setSessionSuccess] = useState(false);

  // Handle 8-character activation code submission (FR-1, FR-2)
  const handleActivationCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const cleaned = activationCode.trim().toUpperCase();
    if (cleaned.length !== 8) {
      setErrorMsg("Activation codes are exactly 8 uppercase letters and digits.");
      return;
    }
    // Proceed to Privacy Notice before PIN setup (FR-3, auth-and-roles.md)
    setActivationStep("privacy");
  };

  // Accept privacy notice and proceed to PIN setup (FR-3)
  const handleAcceptPrivacy = () => {
    setActivationStep("pin");
  };

  // Complete PIN setup
  const handlePinSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pinStr = newPin.join("");
    if (pinStr.length !== 4) {
      setErrorMsg("Please enter a 4-digit PIN.");
      return;
    }
    setActivationStep("completed");
    setSessionSuccess(true);
    setErrorMsg(null);
  };

  // Returning member PIN login (FR-6)
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pinStr = pin.join("");
    if (pinStr.length !== 4) {
      setErrorMsg("Please enter your 4-digit PIN.");
      return;
    }
    setSessionSuccess(true);
    setErrorMsg(null);
  };

  const handlePinChange = (
    index: number,
    value: string,
    isSetup: boolean
  ) => {
    if (!/^\d*$/.test(value)) return;
    const targetArr = isSetup ? [...newPin] : [...pin];
    targetArr[index] = value.slice(-1);
    if (isSetup) {
      setNewPin(targetArr);
    } else {
      setPin(targetArr);
    }

    // Auto-advance to next input
    if (value && index < 3) {
      const nextInputId = isSetup
        ? `new-pin-digit-${index + 1}`
        : `login-pin-digit-${index + 1}`;
      document.getElementById(nextInputId)?.focus();
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Brand Header */}
      <header className={styles.header}>
        <div className={styles.brandGroup}>
          <Image
            src="/icon.svg"
            alt="Spotter"
            width={32}
            height={32}
            priority
            className={styles.logoImage}
          />
          <span className={styles.brandName}>Spotter</span>
        </div>
        <span className={styles.badge}>Member App</span>
      </header>

      {/* Main 100vh Content */}
      <main className={styles.mainContent}>
        <section className={styles.heroCard}>
          <div className={styles.heroHeader}>
            <span className={styles.eyebrow}>Your Gym, Your Records</span>
            <h1 className={styles.heroTitle}>Spotter</h1>
            <p className={styles.heroSubtitle}>
              Check in at the door, verify your attendance and balance, and pay renewals with zero guesswork.
            </p>
          </div>

          {/* Core Feature Highlights */}
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <span className={styles.featureTitle}>⚡ Instant Check-In</span>
              <span className={styles.featureDesc}>Enter today&apos;s 4-digit code in 3 seconds.</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureTitle}>📋 My Records</span>
              <span className={styles.featureDesc}>Exact attendance history &amp; balance facts.</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureTitle}>💳 Renew &amp; Pay</span>
              <span className={styles.featureDesc}>Instant subscription renewal via gateway.</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureTitle}>💬 Ask the Desk</span>
              <span className={styles.featureDesc}>Direct WhatsApp handoff to officer on duty.</span>
            </div>
          </div>

          {/* Authentication Mode Switcher */}
          {!sessionSuccess && (
            <div className={styles.authTabs}>
              <button
                type="button"
                className={`${styles.authTabButton} ${
                  authMode === "activate" ? styles.authTabButtonActive : ""
                }`}
                onClick={() => {
                  setAuthMode("activate");
                  setErrorMsg(null);
                }}
              >
                Activate Device
              </button>
              <button
                type="button"
                className={`${styles.authTabButton} ${
                  authMode === "login" ? styles.authTabButtonActive : ""
                }`}
                onClick={() => {
                  setAuthMode("login");
                  setErrorMsg(null);
                }}
              >
                Sign In (PIN)
              </button>
            </div>
          )}

          {errorMsg && <div className={styles.errorBanner}>{errorMsg}</div>}

          {/* Success Session Feedback */}
          {sessionSuccess ? (
            <div className={styles.successBanner}>
              ✓ Device authenticated! Welcome to Spotter.
            </div>
          ) : authMode === "activate" ? (
            /* Activation Flow (FR-1 to FR-4) */
            <div className={styles.authPanel}>
              {activationStep === "code" && (
                <form onSubmit={handleActivationCodeSubmit} className={styles.authPanel}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="activationCode" className={styles.label}>
                      Front Desk Activation Code
                    </label>
                    <input
                      id="activationCode"
                      type="text"
                      maxLength={8}
                      autoComplete="off"
                      autoCapitalize="characters"
                      spellCheck={false}
                      className={styles.inputField}
                      placeholder="e.g. 7K9X2M4Q"
                      value={activationCode}
                      onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
                      autoFocus
                    />
                  </div>
                  <button type="submit" className={styles.primaryButton}>
                    Continue with Code
                  </button>
                </form>
              )}

              {activationStep === "privacy" && (
                <div className={styles.authPanel}>
                  <div className={styles.privacyBox}>
                    <span className={styles.privacyTitle}>Data Privacy Notice</span>
                    <p className={styles.privacyText}>
                      Spotter stores your attendance timestamps, subscription validity, and payment receipts.
                      Private records are fetched by your exact member ID and never shared or indexed into search.
                      The gym is your data controller.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAcceptPrivacy}
                    className={styles.primaryButton}
                  >
                    I Accept &amp; Continue
                  </button>
                </div>
              )}

              {activationStep === "pin" && (
                <form onSubmit={handlePinSetupSubmit} className={styles.authPanel}>
                  <div role="group" aria-labelledby="new-pin-label" className={styles.inputGroup}>
                    <span id="new-pin-label" className={styles.label}>Create Your 4-Digit PIN</span>
                    <div className={styles.pinInputsContainer}>
                      {[0, 1, 2, 3].map((i) => (
                        <input
                          key={`new-pin-${i}`}
                          id={`new-pin-digit-${i}`}
                          type="password"
                          inputMode="numeric"
                          maxLength={1}
                          aria-label={`New PIN digit ${i + 1}`}
                          autoComplete="one-time-code"
                          className={styles.pinDigitInput}
                          value={newPin[i]}
                          onChange={(e) => handlePinChange(i, e.target.value, true)}
                        />
                      ))}
                    </div>
                  </div>
                  <button type="submit" className={styles.primaryButton}>
                    Complete Device Setup
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* PIN Unlock Flow (FR-6, FR-7) */
            <form onSubmit={handleLoginSubmit} className={styles.authPanel}>
              <div role="group" aria-labelledby="login-pin-label" className={styles.inputGroup}>
                <span id="login-pin-label" className={styles.label}>Enter Your 4-Digit PIN</span>
                <div className={styles.pinInputsContainer}>
                  {[0, 1, 2, 3].map((i) => (
                    <input
                      key={`login-pin-${i}`}
                      id={`login-pin-digit-${i}`}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      aria-label={`PIN digit ${i + 1}`}
                      autoComplete="current-password"
                      className={styles.pinDigitInput}
                      value={pin[i]}
                      onChange={(e) => handlePinChange(i, e.target.value, false)}
                    />
                  ))}
                </div>
              </div>
              <button type="submit" className={styles.primaryButton}>
                Unlock App
              </button>
            </form>
          )}

          {/* Member Assistance & WhatsApp Handoff (PRD 6.1 Empty State) */}
          <div className={styles.footerNote}>
            Need an activation code? Ask at the front desk or{" "}
            <a
              href="https://wa.me/?text=Hello%2C%20I%20need%20my%20Spotter%20activation%20code"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              message the desk on WhatsApp
            </a>
            .
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
