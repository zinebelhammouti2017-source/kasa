"use client";

import Link from "next/link";
import { useEffect } from "react";

import styles from "./error.module.css";

export default function PropertyError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className={styles.page} aria-labelledby="error-title">
      <h1 id="error-title">Impossible de charger ce logement</h1>

      <p>
        Une erreur technique empêche l&apos;affichage du logement. Vous pouvez
        réessayer ou revenir aux annonces.
      </p>

      <div className={styles.actions}>
        <button type="button" className={styles.button} onClick={reset}>
          Réessayer
        </button>

        <Link href="/" className={styles.link}>
          Retour aux annonces
        </Link>
      </div>
    </section>
  );
}
