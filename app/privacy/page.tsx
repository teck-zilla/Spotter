import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Footer from "../footer";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Spotter gym member privacy policy and data protection notice.",
};

export default function PrivacyPolicyPage() {
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
        <span className={styles.badge}>Privacy Notice</span>
      </header>

      <main className={styles.mainContent}>
        <article className={styles.card}>
          <div className={styles.titleArea}>
            <h1 className={styles.title}>Data Privacy Notice</h1>
            <p className={styles.subtitle}>
              How Spotter safeguards and processes member records.
            </p>
          </div>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Data Controller &amp; Processor</h2>
            <p className={styles.sectionBody}>
              The gym is your data controller. Spotter acts solely as a data processor.
              We operate under Nigerian data protection laws (NDPA/NDPR) to maintain the integrity
              and confidentiality of your personal records.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. What Records Are Stored</h2>
            <p className={styles.sectionBody}>
              Spotter stores only information necessary to verify your membership: attendance timestamps,
              subscription validity dates, payment receipts, ledger records, and device activation hashes.
              Your PIN is hashed using Argon2id and is never stored in plain text or logged.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Private Data Protection</h2>
            <p className={styles.sectionBody}>
              Private records are accessed strictly by exact member ID verified through the server session.
              Private records are never embedded into vector indexes, never searched by meaning across members,
              and never exposed to general artificial intelligence models.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Member Rights &amp; Exit Export</h2>
            <p className={styles.sectionBody}>
              You have the right to inspect your private records at any time directly in the app.
              Upon request at the front desk, an export or deletion of your records will be processed
              in accordance with gym retention policies.
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
