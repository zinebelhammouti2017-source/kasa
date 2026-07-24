/**
 * Authentifie un utilisateur avec son email et son mot de passe.
 *
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ token: string, user: object }>}
 */
export async function login(credentials) {
  const response = await fetch("/backend/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error);
    error.status = response.status;
    throw error;
  }

  if (!data.token) {
    throw new Error("Token absent de la réponse.");
  }

  return data;
}

