import Link from "next/link";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.footerLeft}>
        <Link href="/" className={styles.footerBrandLink}>
          Spotter gym member system
        </Link>
      </div>
      <div className={styles.footerRight}>
        <Link href="/privacy" className={styles.footerNavLink}>
          privacy policy
        </Link>
        <Link href="/terms" className={styles.footerNavLink}>
          terms of service
        </Link>
      </div>
    </footer>
  );
}
