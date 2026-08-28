const TOKEN_COOKIE_NAME = "token";

export const AUTH_CHANGE_EVENT = "kasa-auth-change";

function notifyAuthChange() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

/**
 * Enregistre le token d’authentification dans un cookie.
 *
 * @param {string} token
 */
export function saveToken(token) {
  if (typeof document === "undefined") return;

  document.cookie = [
    `${TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "path=/",
    "max-age=3600",
    "SameSite=Strict",
  ].join("; ");

  notifyAuthChange();
}

/**
 * Récupère le token d’authentification.
 *
 * @returns {string|null}
 */
export function getToken() {
  if (typeof document === "undefined") return null;

  const tokenCookie = document.cookie
    .split("; ")
    .find((cookie) =>
      cookie.startsWith(`${TOKEN_COOKIE_NAME}=`)
    );

  if (!tokenCookie) return null;

  const encodedToken = tokenCookie
    .split("=")
    .slice(1)
    .join("=");

  return decodeURIComponent(encodedToken);
}

/**
 * Supprime le token d’authentification.
 */
export function removeToken() {
  if (typeof document === "undefined") return;

  document.cookie = [
    `${TOKEN_COOKIE_NAME}=`,
    "path=/",
    "max-age=0",
    "expires=Thu, 01 Jan 1970 00:00:00 GMT",
    "SameSite=Strict",
  ].join("; ");

  notifyAuthChange();
}

/**
 * Décode le JWT stocké dans le cookie et retourne
 * les informations de l’utilisateur connecté.
 *
 * @returns {object|null} Payload du JWT ou null
 * si aucun utilisateur valide n’est connecté.
 */

export function getCurrentUser() {
  const token = getToken();

  if (!token) return null;

  try {
    const payload = token.split(".")[1];

    if (!payload) return null;

    const normalizedPayload = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const decodedPayload = decodeURIComponent(
      atob(normalizedPayload)
        .split("")
        .map(
          (char) =>
            "%" +
            char
              .charCodeAt(0)
              .toString(16)
              .padStart(2, "0")
        )
        .join("")
    );

    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
}