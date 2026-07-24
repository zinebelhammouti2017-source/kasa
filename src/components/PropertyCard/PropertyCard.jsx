"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
  const [isFavoriteLoading, setIsFavoriteLoading] =
    useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function initializeFavorite() {
      try {
        const favoriteState = await isFavorite(property.id);

        if (!isCancelled) {
          setFavorite(favoriteState);
        }
      } catch (error) {
        /*
         * Si le token a expiré, le service le supprime.
         * On relit alors les favoris locaux du visiteur.
         */
        if (error.status === 401) {
          try {
            const localFavoriteState = await isFavorite(
              property.id
            );

            if (!isCancelled) {
              setFavorite(localFavoriteState);
            }
          } catch (localError) {
            console.error(
              "Impossible de récupérer les favoris locaux.",
              localError
            );
          }
        } else {
          console.error(
            "Impossible de récupérer les favoris.",
            error
          );
        }
      } finally {
        if (!isCancelled) {
          setIsFavoriteLoading(false);
        }
      }
    }

    initializeFavorite();

    return () => {
      isCancelled = true;
    };
  }, [property.id]);

  async function handleFavoriteClick() {
    if (isFavoriteLoading) return;

    setIsFavoriteLoading(true);

    try {
      const newFavoriteState = await toggleFavorite(
        property.id,
        favorite
      );

      setFavorite(newFavoriteState);

      onFavoriteChange?.(
        property.id,
        newFavoriteState
      );
    } catch (error) {
      if (error.status === 401) {
        window.alert(
          "Votre session a expiré. Vous pouvez vous reconnecter pour gérer les favoris de votre compte."
        );
      } else {
        window.alert(
          "Impossible de modifier ce favori pour le moment. Veuillez réessayer."
        );
      }
    } finally {
      setIsFavoriteLoading(false);
    }
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
        disabled={isFavoriteLoading}
        aria-busy={isFavoriteLoading}
        aria-pressed={favorite}
        aria-label={
          isFavoriteLoading
            ? `Chargement du favori ${property.title}`
            : favorite
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