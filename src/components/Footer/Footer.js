import Logo from "../HouseLogo/HouseLogo";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Logo />

      <p>© 2020 Kasa. All rights reserved</p>
    </footer>
  );
}