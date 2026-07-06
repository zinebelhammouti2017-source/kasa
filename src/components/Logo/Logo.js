import styles from "./Logo.module.css";

export default function Logo() {
  return (
    <div className={styles.logo}>
      <span className={styles.text}>k</span>
      <span className={styles.house}>⌂</span>
      <span className={styles.text}>sa</span>
    </div>
  );
}