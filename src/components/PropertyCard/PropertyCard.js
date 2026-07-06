import Image from "next/image";
import styles from "./PropertyCard.module.css";

export default function PropertyCard({ property }) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={property.cover}
          alt={property.title}
          fill
          className={styles.image}
        />

        <button
          type="button"
          className={styles.favoriteButton}
          aria-label={`Ajouter ${property.title} aux favoris`}
        >
          ♡
        </button>
      </div>

      <div className={styles.content}>
        <h2>{property.title}</h2>
        <p className={styles.location}>{property.location}</p>
        <p className={styles.price}>{property.price_per_night}€ par nuit</p>
      </div>
    </article>
  );
}