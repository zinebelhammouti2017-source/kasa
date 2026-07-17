import styles from "./HouseLogo.module.css";

export default function HouseLogo() {
  return (
    <div className={styles.logo} aria-hidden="true">
      <span className={styles.roof}></span>
      <span className={styles.body}></span>
      <span className={styles.door}></span>
    </div>
  );
}
