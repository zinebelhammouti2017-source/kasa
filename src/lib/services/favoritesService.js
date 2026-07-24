import {
  getToken,
  removeToken,
} from "@/lib/utils/cookies";

const FAVORITES_STORAGE_KEY = "kasa-favorites";

let cachedToken = null;
let favoritePropertiesPromise = null;

function resetApiFavoritesCache() {
  cachedToken = null;
  favoritePropertiesPromise = null;
}

function getLocalFavoriteIds() {
  if (typeof window === "undefined") {
    return [];
  }

  const storedFavorites = localStorage.getItem(
    FAVORITES_STORAGE_KEY
  );

  if (!storedFavorites) {
    return [];
  }

  try {
    const parsedFavorites = JSON.parse(storedFavorites);

    if (!Array.isArray(parsedFavorites)) {
      return [];
    }

    return parsedFavorites.map((propertyId) =>
      String(propertyId)
    );
  } catch {
    return [];
  }
}

function saveLocalFavoriteIds(favoriteIds) {
  localStorage.setItem(
    FAVORITES_STORAGE_KEY,
    JSON.stringify(favoriteIds)
  );
}

function getUserIdFromToken(token) {
  try {
    const payloadPart = token.split(".")[1];

    if (!payloadPart) {
      throw new Error("Token invalide");
    }

    const base64 = payloadPart
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(
        payloadPart.length +
          ((4 - (payloadPart.length % 4)) % 4),
        "="
      );

    const binaryPayload = window.atob(base64);

    const payloadBytes = Uint8Array.from(
      binaryPayload,
      (character) => character.charCodeAt(0)
    );

    const payload = JSON.parse(
      new TextDecoder().decode(payloadBytes)
    );

    if (!payload.id) {
      throw new Error("Identifiant utilisateur absent");
    }

    return payload.id;
  } catch {
    removeToken();
    resetApiFavoritesCache();

    const error = new Error(
      "Votre session a expiré. Veuillez vous reconnecter."
    );

    error.status = 401;

    throw error;
  }
}

async function request(token, url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      data?.error ||
        "Une erreur est survenue avec les favoris."
    );

    error.status = response.status;

    if (response.status === 401) {
      removeToken();
      resetApiFavoritesCache();
    }

    throw error;
  }

  return data;
}

async function getApiFavoriteProperties(token) {
  const userId = getUserIdFromToken(token);

  if (cachedToken !== token) {
    cachedToken = token;
    favoritePropertiesPromise = null;
  }

  if (!favoritePropertiesPromise) {
    favoritePropertiesPromise = request(
      token,
      `/backend/api/users/${encodeURIComponent(
        userId
      )}/favorites`
    )
      .then((properties) =>
        Array.isArray(properties) ? properties : []
      )
      .catch((error) => {
        favoritePropertiesPromise = null;
        throw error;
      });
  }

  return favoritePropertiesPromise;
}

/**
 * Récupère les logements favoris depuis le stockage adapté.
 *
 * @param {object[]} availableProperties Logements disponibles
 * pour le filtrage des favoris locaux.
 * @returns {Promise<object[]>}
 */
export async function getFavoriteProperties(
  availableProperties = []
) {
  const token = getToken();

  if (token) {
    return getApiFavoriteProperties(token);
  }

  const favoriteIds = getLocalFavoriteIds();

  return availableProperties.filter((property) =>
    favoriteIds.includes(String(property.id))
  );
}

/**
 * Récupère les identifiants des logements favoris.
 *
 * @returns {Promise<string[]>}
 */
export async function getFavoriteIds() {
  const token = getToken();

  if (!token) {
    return getLocalFavoriteIds();
  }

  const properties = await getApiFavoriteProperties(token);

  return properties.map((property) => String(property.id));
}

/**
 * Vérifie si un logement est enregistré dans les favoris.
 *
 * @param {string|number} propertyId
 * @returns {Promise<boolean>}
 */
export async function isFavorite(propertyId) {
  const favoriteIds = await getFavoriteIds();

  return favoriteIds.includes(String(propertyId));
}

/**
 * Ajoute un logement aux favoris.
 *
 * @param {string|number} propertyId
 * @returns {Promise<void>}
 */
export async function addFavorite(propertyId) {
  const normalizedPropertyId = String(propertyId);
  const token = getToken();

  if (!token) {
    const favoriteIds = getLocalFavoriteIds();

    if (!favoriteIds.includes(normalizedPropertyId)) {
      saveLocalFavoriteIds([
        ...favoriteIds,
        normalizedPropertyId,
      ]);
    }

    return;
  }

  await request(
    token,
    `/backend/api/properties/${encodeURIComponent(
      normalizedPropertyId
    )}/favorite`,
    {
      method: "POST",
    }
  );

  resetApiFavoritesCache();
}

/**
 * Supprime un logement des favoris.
 *
 * @param {string|number} propertyId
 * @returns {Promise<void>}
 */
export async function removeFavorite(propertyId) {
  const normalizedPropertyId = String(propertyId);
  const token = getToken();

  if (!token) {
    const updatedFavorites = getLocalFavoriteIds().filter(
      (favoriteId) =>
        favoriteId !== normalizedPropertyId
    );

    saveLocalFavoriteIds(updatedFavorites);
    return;
  }

  await request(
    token,
    `/backend/api/properties/${encodeURIComponent(
      normalizedPropertyId
    )}/favorite`,
    {
      method: "DELETE",
    }
  );

  resetApiFavoritesCache();
}

/**
 * Ajoute ou retire un logement des favoris.
 *
 * @param {string|number} propertyId
 * @param {boolean} currentFavoriteState
 * @returns {Promise<boolean>}
 */
export async function toggleFavorite(
  propertyId,
  currentFavoriteState
) {
  const favoriteState =
    typeof currentFavoriteState === "boolean"
      ? currentFavoriteState
      : await isFavorite(propertyId);

  if (favoriteState) {
    await removeFavorite(propertyId);
    return false;
  }

  await addFavorite(propertyId);
  return true;
}