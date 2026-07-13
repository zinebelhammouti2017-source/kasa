import styles from "./PropertyGridSkeleton.module.css";

const SKELETON_CARDS_COUNT = 6;

export default function PropertyGridSkeleton() {
  return (
    <section
      className={styles.section}
      aria-label="Chargement des logements"
      aria-busy="true"
    >
      <p className={styles.screenReaderText} role="status">
        Chargement des logements en cours…
      </p>

      <div className={styles.grid} aria-hidden="true">
        {Array.from({ length: SKELETON_CARDS_COUNT }).map((_, index) => (
          <article className={styles.card} key={index}>
            <div className={styles.image} />

            <div className={styles.content}>
              <div className={`${styles.line} ${styles.title}`} />
              <div className={`${styles.line} ${styles.location}`} />
              <div className={`${styles.line} ${styles.price}`} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}