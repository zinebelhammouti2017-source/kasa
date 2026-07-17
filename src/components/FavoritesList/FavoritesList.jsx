"use client";

import { useEffect, useState } from "react";

import PropertyGrid from "@/components/PropertyGrid/PropertyGrid";
import { getFavoriteIds } from "@/lib/services/favoritesService";

import styles from "./FavoritesList.module.css";

export default function FavoritesList({
  properties,
}) {
  const [
    favoriteProperties,
    setFavoriteProperties,
  ] = useState([]);

  useEffect(() => {
    const favoriteIds = getFavoriteIds();

    const filteredProperties = properties.filter(
      (property) => favoriteIds.includes(property.id)
    );

    // Initialisation de la liste à partir du localStorage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavoriteProperties(filteredProperties);
  }, [properties]);

  function handleFavoriteChange(
    propertyId,
    isNowFavorite
  ) {
    if (isNowFavorite) {
      return;
    }

    setFavoriteProperties((currentProperties) =>
      currentProperties.filter(
        (property) => property.id !== propertyId
      )
    );
  }

  if (favoriteProperties.length === 0) {
    return (
      <p className={styles.emptyMessage}>
        Vous n’avez encore ajouté aucun logement à vos favoris.
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