"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  isFavorite,
  toggleFavorite,
} from "@/lib/services/favoritesService";

import styles from "./PropertyCard.module.css";

export default function PropertyCard({
  property,
  onFavoriteChange,
}) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    // Synchronisation initiale avec le localStorage côté navigateur.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavorite(isFavorite(property.id));
  }, [property.id]);

  function handleFavoriteClick() {
    const newFavoriteState = toggleFavorite(property.id);

    setFavorite(newFavoriteState);
    onFavoriteChange?.(property.id, newFavoriteState);
  }

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

          <p className={styles.location}>
            {property.location}
          </p>

          <p className={styles.price}>
            {property.price_per_night}€ par nuit
          </p>
        </div>
      </Link>

      <button
        type="button"
        className={styles.favoriteButton}
        onClick={handleFavoriteClick}
        aria-pressed={favorite}
        aria-label={
          favorite
            ? `Retirer ${property.title} des favoris`
            : `Ajouter ${property.title} aux favoris`
        }
      >
        <span aria-hidden="true">
          {favorite ? "♥" : "♡"}
        </span>
      </button>
    </article>
  );
}