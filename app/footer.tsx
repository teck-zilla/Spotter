import styles from "./footer.module.css";

export type ActiveView = "home" | "privacy" | "terms";

interface FooterProps {
  activeView?: ActiveView;
  onSelectView?: (view: ActiveView) => void;
}

export default function Footer({ activeView = "home", onSelectView }: FooterProps) {
  const handleNav = (e: React.MouseEvent, view: ActiveView) => {
    e.preventDefault();
    if (onSelectView) {
      onSelectView(view);
    }
  };

  return (
    <footer className={styles.footer} role="contentinfo" aria-label="Site footer">
      <div className={styles.footerLeft}>
        <a
          href="#"
          onClick={(e) => handleNav(e, "home")}
          className={styles.footerBrandLink}
          aria-label="Spotter gym member system home"
        >
          Spotter gym member system
        </a>
      </div>
      <nav className={styles.footerRight} aria-label="Legal links">
        <a
          href="#privacy"
          onClick={(e) => handleNav(e, "privacy")}
          className={`${styles.footerNavLink} ${
            activeView === "privacy" ? styles.footerNavLinkActive : ""
          }`}
          aria-label="View privacy policy"
          aria-current={activeView === "privacy" ? "page" : undefined}
        >
          privacy policy
        </a>
        <a
          href="#terms"
          onClick={(e) => handleNav(e, "terms")}
          className={`${styles.footerNavLink} ${
            activeView === "terms" ? styles.footerNavLinkActive : ""
          }`}
          aria-label="View terms of service"
          aria-current={activeView === "terms" ? "page" : undefined}
        >
          terms of service
        </a>
      </nav>
    </footer>
  );
}
