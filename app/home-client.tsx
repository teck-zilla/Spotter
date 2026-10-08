"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import Footer, { type ActiveView } from "./footer";

type AuthMode = "activate" | "login";
type ActivationStep = "code" | "privacy" | "pin" | "completed";

export default function HomeClient() {
  const [activeView, setActiveView] = useState<ActiveView>("home");
  const [authMode, setAuthMode] = useState<AuthMode>("activate");
  const [activationStep, setActivationStep] = useState<ActivationStep>("code");
  const [activationCode, setActivationCode] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);
  const [newPin, setNewPin] = useState(["", "", "", ""]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sessionSuccess, setSessionSuccess] = useState(false);

  // Sync active view with window hash on load and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#privacy") {
        setActiveView("privacy");
      } else if (hash === "#terms") {
        setActiveView("terms");
      } else {
        setActiveView("home");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Dynamically update document title based on the active view
  useEffect(() => {
    if (activeView === "privacy") {
      document.title = "Privacy Policy | Spotter";
    } else if (activeView === "terms") {
      document.title = "Terms of Service | Spotter";
    } else {
      document.title = "Spotter";
    }
  }, [activeView]);

  const handleSelectView = (view: ActiveView) => {
    setActiveView(view);
    if (typeof window !== "undefined") {
      if (view === "home") {
        window.history.replaceState(null, "", window.location.pathname);
      } else {
        window.location.hash = view;
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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
        <button
          type="button"
          onClick={() => handleSelectView("home")}
          className={styles.brandGroup}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
          aria-label="Spotter Home"
        >
          <Image
            src="/icon.svg"
            alt="Spotter"
            width={32}
            height={32}
            priority
            className={styles.logoImage}
          />
          <span className={styles.brandName}>Spotter</span>
        </button>
        <span className={styles.badge}>
          {activeView === "privacy"
            ? "Privacy Notice"
            : activeView === "terms"
            ? "Terms of Service"
            : "Member App"}
        </span>
      </header>

      {/* Main 100vh Content */}
      <main className={styles.mainContent}>
        {activeView === "home" && (
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
        )}

        {/* Conditional Privacy Notice View (FR-3, FR-58) */}
        {activeView === "privacy" && (
          <section className={styles.viewContainer} aria-labelledby="privacy-heading">
            <div className={styles.viewHeader}>
              <span className={styles.viewBadge}>Privacy Notice</span>
              <h1 id="privacy-heading" className={styles.viewTitle}>Data Privacy Notice</h1>
              <p className={styles.viewSubtitle}>
                How Spotter safeguards and processes member records.
              </p>
            </div>

            <div className={styles.viewSection}>
              <h2 className={styles.viewSectionTitle}>1. Data Controller &amp; Processor</h2>
              <p className={styles.viewSectionBody}>
                The gym is your data controller. Spotter acts solely as a data processor.
                We operate under Nigerian data protection laws (NDPA/NDPR) to maintain the integrity
                and confidentiality of your personal records.
              </p>
            </div>

            <div className={styles.viewSection}>
              <h2 className={styles.viewSectionTitle}>2. What Records Are Stored</h2>
              <p className={styles.viewSectionBody}>
                Spotter stores only information necessary to verify your membership: attendance timestamps,
                subscription validity dates, payment receipts, ledger records, and device activation hashes.
                Your PIN is hashed using Argon2id and is never stored in plain text or logged.
              </p>
            </div>

            <div className={styles.viewSection}>
              <h2 className={styles.viewSectionTitle}>3. Private Data Protection</h2>
              <p className={styles.viewSectionBody}>
                Private records are accessed strictly by exact member ID verified through the server session.
                Private records are never embedded into vector indexes, never searched by meaning across members,
                and never exposed to general artificial intelligence models.
              </p>
            </div>

            <div className={styles.viewSection}>
              <h2 className={styles.viewSectionTitle}>4. Member Rights &amp; Exit Export</h2>
              <p className={styles.viewSectionBody}>
                You have the right to inspect your private records at any time directly in the app.
                Upon request at the front desk, an export or deletion of your records will be processed
                in accordance with gym retention policies.
              </p>
            </div>

            <div className={styles.viewBackRow}>
              <button
                type="button"
                onClick={() => handleSelectView("home")}
                className={styles.viewBackButton}
              >
                &larr; Return to Spotter
              </button>
            </div>
          </section>
        )}

        {/* Conditional Terms of Service View (FR-19, FR-20) */}
        {activeView === "terms" && (
          <section className={styles.viewContainer} aria-labelledby="terms-heading">
            <div className={styles.viewHeader}>
              <span className={styles.viewBadge}>Terms of Service</span>
              <h1 id="terms-heading" className={styles.viewTitle}>Gym Terms of Service</h1>
              <p className={styles.viewSubtitle}>
                Standard member rules, check-in terms, and subscription policies.
              </p>
            </div>

            <div className={styles.viewSection}>
              <h2 className={styles.viewSectionTitle}>1. Single Device Binding</h2>
              <p className={styles.viewSectionBody}>
                Each member is issued a unique one-time activation code by the front desk.
                Your account is bound to one active mobile device at a time. Activating on a new device
                automatically revokes earlier sessions to protect your records.
              </p>
            </div>

            <div className={styles.viewSection}>
              <h2 className={styles.viewSectionTitle}>2. Check-In &amp; Access Hours</h2>
              <p className={styles.viewSectionBody}>
                Check-in is recorded using the daily 4-digit code displayed at the gym front desk.
                Members may check in at most once per calendar day during official opening hours.
                Check-in requires active network connectivity.
              </p>
            </div>

            <div className={styles.viewSection}>
              <h2 className={styles.viewSectionTitle}>3. Subscriptions &amp; Grace Period</h2>
              <p className={styles.viewSectionBody}>
                Access is granted based on your active membership plan. Following expiration,
                a 3-day grace period is provided. Members past grace cannot check in until subscription
                renewal is completed and verified.
              </p>
            </div>

            <div className={styles.viewSection}>
              <h2 className={styles.viewSectionTitle}>4. Payments &amp; Receipts</h2>
              <p className={styles.viewSectionBody}>
                All in-app subscription payments and arrears are processed securely via our payment gateway.
                Spotter never stores payment card details. Official receipts are generated for every verified
                transaction and remain accessible in your payment history.
              </p>
            </div>

            <div className={styles.viewBackRow}>
              <button
                type="button"
                onClick={() => handleSelectView("home")}
                className={styles.viewBackButton}
              >
                &larr; Return to Spotter
              </button>
            </div>
          </section>
        )}
      </main>
      <Footer activeView={activeView} onSelectView={handleSelectView} />
    </div>
  );
}
