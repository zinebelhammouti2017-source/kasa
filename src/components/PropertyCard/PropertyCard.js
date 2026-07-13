import Link from "next/link";
import Image from "next/image";
import styles from "./PropertyCard.module.css";

export default function PropertyCard({ property }) {
  return (
    <article className={styles.card}>
      <Link
        href={`/property/${property.id}`}
        className={styles.cardLink}
        aria-label={`Voir le logement ${property.title}, situé à ${property.location}, au prix de ${property.price_per_night} euros par nuit`}
      >
        <div className={styles.imageWrapper}>
          <Image
            src={property.cover}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={styles.image}
          />
        </div>

        <div className={styles.content}>
          <h2>{property.title}</h2>
          <p className={styles.location}>{property.location}</p>
          <p className={styles.price}>
            {property.price_per_night}€ par nuit
          </p>
        </div>
      </Link>

      <button
        type="button"
        className={styles.favoriteButton}
        aria-label={`Ajouter ${property.title} aux favoris`}
      >
        ♡
      </button>
    </article>
  );
}