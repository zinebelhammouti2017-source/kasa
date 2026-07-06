import styles from "./HouseLogo.module.css";

export default function HouseLogo() {
  return (
    <div className={styles.logo} aria-label="Logo Kasa">
      <span className={styles.roof}></span>
      <span className={styles.body}></span>
      <span className={styles.door}></span>
    </div>
  );
}