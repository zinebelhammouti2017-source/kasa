import { API_URL } from "../config/api";

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

export async function getProperties() {
  const response = await fetch(`${API_URL}/properties`);

  if (!response.ok) {
    throw new PropertyApiError("Erreur lors de la récupération des propriétés", {
      status: response.status,
      type: response.status >= 500 ? "server_error" : "api_error",
    });
  }

  return response.json();
}

export async function getPropertyById(id) {
  let response;

  try {
    response = await fetch(`${API_URL}/properties/${id}`);
  } catch (error) {
    throw new PropertyApiError("Impossible de joindre le serveur API", {
      type: "network_error",
      cause: error,
    });
  }

  if (response.status === 404) {
    throw new PropertyApiError("Logement introuvable", {
      status: 404,
      type: "not_found",
    });
  }

  if (!response.ok) {
    throw new PropertyApiError(
      await getErrorMessage(response),
      {
        status: response.status,
        type: response.status >= 500 ? "server_error" : "api_error",
      }
    );
  }

  return response.json();
}
