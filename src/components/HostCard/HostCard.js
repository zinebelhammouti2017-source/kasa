import Image from "next/image";
import styles from "./HostCard.module.css";

export default function HostCard({ host, rating }) {
  return (
    <aside className={styles.card} aria-labelledby="host-title">
      <h2 id="host-title" className={styles.title}>
        Votre hôte
      </h2>

      <div className={styles.identity}>
        <Image
          src={host.picture}
          alt={`Portrait de ${host.name}`}
          width={64}
          height={64}
          className={styles.avatar}
        />

        <div className={styles.details}>
          <p className={styles.name}>{host.name}</p>
          <p className={styles.rating} aria-label={`Note moyenne : ${rating} sur 5`}>
            ★ {rating}
          </p>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.button}>
          Contacter l’hôte
        </button>

        <button type="button" className={styles.button}>
          Envoyer un message
        </button>
      </div>
    </aside>
  );
}