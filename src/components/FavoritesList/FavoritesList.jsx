"use client";

import { useEffect, useState } from "react";

import PropertyGrid from "@/components/PropertyGrid/PropertyGrid";
import { getFavoriteProperties } from "@/lib/services/favoritesService";

import styles from "./FavoritesList.module.css";

export default function FavoritesList({ properties }) {
  const [favoriteProperties, setFavoriteProperties] =
    useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadFavorites() {
      try {
        const loadedFavorites =
          await getFavoriteProperties(properties);

        if (!isCancelled) {
          setFavoriteProperties(loadedFavorites);
        }
      } catch (error) {
        if (isCancelled) return;

        /*
         * Si la session a expiré, le service supprime le
         * token. On recharge alors les favoris locaux.
         */
        if (error.status === 401) {
          try {
            const localFavorites =
              await getFavoriteProperties(properties);

            if (!isCancelled) {
              setFavoriteProperties(localFavorites);
            }
          } catch (localError) {
            console.error(
              "Impossible de récupérer les favoris locaux.",
              localError
            );

            if (!isCancelled) {
              setErrorMessage(
                "Impossible de charger vos favoris pour le moment."
              );
            }
          }
        } else {
          console.error(
            "Impossible de récupérer les favoris.",
            error
          );

          setErrorMessage(
            "Impossible de charger vos favoris pour le moment."
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadFavorites();

    return () => {
      isCancelled = true;
    };
  }, [properties]);

  function handleFavoriteChange(
    propertyId,
    isNowFavorite
  ) {
    if (isNowFavorite) return;

    setFavoriteProperties((currentProperties) =>
      currentProperties.filter(
        (property) =>
          String(property.id) !== String(propertyId)
      )
    );
  }

  if (isLoading) {
    return (
      <p className={styles.emptyMessage} role="status">
        Chargement de vos favoris…
      </p>
    );
  }

  if (errorMessage) {
    return (
      <p className={styles.emptyMessage} role="alert">
        {errorMessage}
      </p>
    );
  }

  if (favoriteProperties.length === 0) {
    return (
      <p className={styles.emptyMessage}>
        Vous n’avez encore ajouté aucun logement à vos
        favoris.
      </p>
    );
  }

  return (
    <PropertyGrid
      properties={favoriteProperties}
      onFavoriteChange={handleFavoriteChange}
    />
  );
}