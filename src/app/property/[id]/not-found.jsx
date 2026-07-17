import Link from "next/link";

import styles from "./not-found.module.css";

export default function PropertyNotFound() {
  return (
    <section className={styles.page} aria-labelledby="not-found-title">
      <h1 id="not-found-title">Logement introuvable</h1>

      <p>Le logement demandé n&apos;existe pas ou n&apos;est plus disponible.</p>

      <Link href="/" className={styles.link}>
        Retour aux annonces
      </Link>
    </section>
  );
}
