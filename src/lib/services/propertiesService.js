import { API_URL } from "../config/api";
import { getToken } from "../utils/cookies";

export class PropertyApiError extends Error {
  constructor(message, { status, type, cause } = {}) {
    super(message);
    this.name = "PropertyApiError";
    this.status = status;
    this.type = type;
    this.cause = cause;
  }
}

async function getErrorMessage(response) {
  try {
    const data = await response.json();

    return data?.error || data?.message || response.statusText;
  } catch {
    return response.statusText;
  }
}

function getErrorType(status) {
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status >= 500) return "server_error";

  return "api_error";
}

function requireToken() {
  const token = getToken();

  if (!token) {
    throw new PropertyApiError(
      "Vous devez être connecté pour effectuer cette action",
      {
        status: 401,
        type: "unauthorized",
      }
    );
  }

  return token;
}

function getApiBaseUrl() {
  return typeof window === "undefined"
    ? API_URL
    : "/backend/api";
}

export async function getProperties() {
  const response = await fetch(
    `${getApiBaseUrl()}/properties`
  );

  if (!response.ok) {
    throw new PropertyApiError(
      "Erreur lors de la récupération des propriétés",
      {
        status: response.status,
        type:
          response.status >= 500
            ? "server_error"
            : "api_error",
      }
    );
  }

  return response.json();
}

export async function getPropertyById(id) {
  let response;

  try {
    response = await fetch(
      `${getApiBaseUrl()}/properties/${id}`
    );
  } catch (error) {
    throw new PropertyApiError(
      "Impossible de joindre le serveur API",
      {
        type: "network_error",
        cause: error,
      }
    );
  }

  if (response.status === 404) {
    throw new PropertyApiError(
      "Logement introuvable",
      {
        status: 404,
        type: "not_found",
      }
    );
  }

  if (!response.ok) {
    throw new PropertyApiError(
      await getErrorMessage(response),
      {
        status: response.status,
        type: getErrorType(response.status),
      }
    );
  }

  return response.json();
}

/**
 * Envoie une image au backend.
 *
 * @param {File} file Image sélectionnée par l’utilisateur.
 * @param {"property-cover"|"property-picture"|"user-picture"} purpose
 * Usage de l’image.
 * @returns {Promise<object>} Informations de l’image envoyée.
 */
export async function uploadPropertyImage(
  file,
  purpose
) {
  if (!file) {
    throw new PropertyApiError(
      "Veuillez sélectionner une image",
      {
        status: 400,
        type: "validation_error",
      }
    );
  }

  const token = requireToken();
  const formData = new FormData();

  formData.append("file", file);
  formData.append("purpose", purpose);

  let response;

  try {
    response = await fetch(
      `${getApiBaseUrl()}/uploads/image`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
  } catch (error) {
    throw new PropertyApiError(
      "Impossible d’envoyer l’image",
      {
        type: "network_error",
        cause: error,
      }
    );
  }

  if (!response.ok) {
    throw new PropertyApiError(
      await getErrorMessage(response),
      {
        status: response.status,
        type: getErrorType(response.status),
      }
    );
  }

  const uploadedImage = await response.json();

  if (!uploadedImage?.url) {
    throw new PropertyApiError(
      "L’API n’a pas renvoyé l’URL de l’image",
      {
        status: response.status,
        type: "invalid_response",
      }
    );
  }

  return uploadedImage;
}

/**
 * Crée une propriété dans le backend.
 *
 * @param {object} propertyData Données complètes de la propriété.
 * @returns {Promise<object>} Propriété créée.
 */
export async function createProperty(propertyData) {
  const token = requireToken();

  let response;

  try {
    response = await fetch(
      `${getApiBaseUrl()}/properties`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propertyData),
      }
    );
  } catch (error) {
    throw new PropertyApiError(
      "Impossible de créer la propriété",
      {
        type: "network_error",
        cause: error,
      }
    );
  }

  if (!response.ok) {
    throw new PropertyApiError(
      await getErrorMessage(response),
      {
        status: response.status,
        type: getErrorType(response.status),
      }
    );
  }

  return response.json();
}