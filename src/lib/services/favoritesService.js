const FAVORITES_STORAGE_KEY = "kasa-favorites";

/**
 * Récupère les identifiants des logements favoris.
 *
 * @returns {string[]} Liste des identifiants favoris.
 */
export function getFavoriteIds() {
  if (typeof window === "undefined") {
    return [];
  }

  const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);

  if (!storedFavorites) {
    return [];
  }

  try {
    const parsedFavorites = JSON.parse(storedFavorites);

    return Array.isArray(parsedFavorites) ? parsedFavorites : [];
  } catch {
    return [];
  }
}

/**
 * Vérifie si un logement est enregistré dans les favoris.
 *
 * @param {string} propertyId Identifiant du logement.
 * @returns {boolean}
 */
export function isFavorite(propertyId) {
  return getFavoriteIds().includes(propertyId);
}

/**
 * Ajoute un logement aux favoris sans créer de doublon.
 *
 * @param {string} propertyId Identifiant du logement.
 * @returns {string[]} Nouvelle liste des favoris.
 */
export function addFavorite(propertyId) {
  const favoriteIds = getFavoriteIds();

  if (favoriteIds.includes(propertyId)) {
    return favoriteIds;
  }

  const updatedFavorites = [...favoriteIds, propertyId];

  localStorage.setItem(
    FAVORITES_STORAGE_KEY,
    JSON.stringify(updatedFavorites)
  );

  return updatedFavorites;
}

/**
 * Supprime un logement des favoris.
 *
 * @param {string} propertyId Identifiant du logement.
 * @returns {string[]} Nouvelle liste des favoris.
 */
export function removeFavorite(propertyId) {
  const updatedFavorites = getFavoriteIds().filter(
    (favoriteId) => favoriteId !== propertyId
  );

  localStorage.setItem(
    FAVORITES_STORAGE_KEY,
    JSON.stringify(updatedFavorites)
  );

  return updatedFavorites;
}

/**
 * Ajoute ou retire un logement des favoris.
 *
 * @param {string} propertyId Identifiant du logement.
 * @returns {boolean} Nouvel état du favori.
 */
export function toggleFavorite(propertyId) {
  if (isFavorite(propertyId)) {
    removeFavorite(propertyId);
    return false;
  }

  addFavorite(propertyId);
  return true;
}