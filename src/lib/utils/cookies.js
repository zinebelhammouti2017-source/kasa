const TOKEN_COOKIE_NAME = "token";

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
}