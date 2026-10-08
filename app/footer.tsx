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
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.footerLeft}>
        <a
          href="#"
          onClick={(e) => handleNav(e, "home")}
          className={styles.footerBrandLink}
        >
          Spotter gym member system
        </a>
      </div>
      <div className={styles.footerRight}>
        <a
          href="#privacy"
          onClick={(e) => handleNav(e, "privacy")}
          className={`${styles.footerNavLink} ${
            activeView === "privacy" ? styles.footerNavLinkActive : ""
          }`}
        >
          privacy policy
        </a>
        <a
          href="#terms"
          onClick={(e) => handleNav(e, "terms")}
          className={`${styles.footerNavLink} ${
            activeView === "terms" ? styles.footerNavLinkActive : ""
          }`}
        >
          terms of service
        </a>
      </div>
    </footer>
  );
}
