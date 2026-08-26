import {
  getToken,
  removeToken,
} from "@/lib/utils/cookies";

function getAuthenticatedToken() {
  const token = getToken();

  if (!token) {
    const error = new Error(
      "Vous devez être connecté pour accéder à la messagerie."
    );

    error.status = 401;

    throw error;
  }

  return token;
}

async function request(url, options = {}) {
  const token = getAuthenticatedToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      removeToken();
    }

    const error = new Error(
      data?.error ||
        "Une erreur est survenue avec la messagerie."
    );

    error.status = response.status;

    throw error;
  }

  return data;
}

/**
 * Récupère les conversations de l’utilisateur connecté.
 *
 * @returns {Promise<object[]>}
 */
export async function getConversations() {
  const conversations = await request(
    "/backend/api/conversations"
  );

  return Array.isArray(conversations)
    ? conversations
    : [];
}

/**
 * Crée une conversation ou récupère celle qui existe déjà
 * pour un logement.
 *
 * @param {string|number} propertyId
 * @returns {Promise<object>}
 */
export async function createConversation(propertyId) {
  return request("/backend/api/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      property_id: propertyId,
    }),
  });
}

/**
 * Récupère les messages d’une conversation.
 *
 * @param {string|number} conversationId
 * @returns {Promise<object[]>}
 */
 export async function getConversationMessages(
  conversationId
) {
  const data = await request(
    `/backend/api/conversations/${encodeURIComponent(
      conversationId
    )}/messages`
  );

  return {
    conversation: data?.conversation || null,
    messages: Array.isArray(data?.messages)
      ? data.messages
      : [],
  };
}

/**
 * Envoie un message dans une conversation.
 *
 * @param {string|number} conversationId
 * @param {string} content
 * @returns {Promise<object>}
 */
export async function sendMessage(
  conversationId,
  content
) {
  const normalizedContent = content.trim();

  if (!normalizedContent) {
    const error = new Error(
      "Le message ne peut pas être vide."
    );

    error.status = 400;

    throw error;
  }

  return request(
    `/backend/api/conversations/${encodeURIComponent(
      conversationId
    )}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: normalizedContent,
      }),
    }
  );
}

/**
 * Marque comme lus les messages reçus dans une conversation.
 *
 * @param {string|number} conversationId
 * @returns {Promise<object>}
 */
export async function markConversationAsRead(
  conversationId
) {
  return request(
    `/backend/api/conversations/${encodeURIComponent(
      conversationId
    )}/read`,
    {
      method: "PATCH",
    }
  );
}