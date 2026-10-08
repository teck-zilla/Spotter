import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Footer from "../footer";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Spotter gym member terms of service and access policies.",
};

export default function TermsOfServicePage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.brandGroup}>
          <Image
            src="/icon.svg"
            alt="Spotter"
            width={32}
            height={32}
            priority
            className={styles.logoImage}
          />
          <span className={styles.brandName}>Spotter</span>
        </Link>
        <span className={styles.badge}>Terms of Service</span>
      </header>

      <main className={styles.mainContent}>
        <article className={styles.card}>
          <div className={styles.titleArea}>
            <h1 className={styles.title}>Gym Terms of Service</h1>
            <p className={styles.subtitle}>
              Standard member rules, check-in terms, and subscription policies.
            </p>
          </div>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Single Device Binding</h2>
            <p className={styles.sectionBody}>
              Each member is issued a unique one-time activation code by the front desk.
              Your account is bound to one active mobile device at a time. Activating on a new device
              automatically revokes earlier sessions to protect your records.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Check-In &amp; Access Hours</h2>
            <p className={styles.sectionBody}>
              Check-in is recorded using the daily 4-digit code displayed at the gym front desk.
              Members may check in at most once per calendar day during official opening hours.
              Check-in requires active network connectivity.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Subscriptions &amp; Grace Period</h2>
            <p className={styles.sectionBody}>
              Access is granted based on your active membership plan. Following expiration,
              a 3-day grace period is provided. Members past grace cannot check in until subscription
              renewal is completed and verified.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Payments &amp; Receipts</h2>
            <p className={styles.sectionBody}>
              All in-app subscription payments and arrears are processed securely via our payment gateway.
              Spotter never stores payment card details. Official receipts are generated for every verified
              transaction and remain accessible in your payment history.
            </p>
          </section>

          <div>
            <Link href="/" className={styles.backLink}>
              &larr; Return to Spotter
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
