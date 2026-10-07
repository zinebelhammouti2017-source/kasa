"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";

import { createConversation } from "@/lib/services/messagesService";
import {
  AUTH_CHANGE_EVENT,
  getCurrentUser,
  getToken,
} from "@/lib/utils/cookies";

import styles from "./HostCard.module.css";

function subscribeToAuthentication(onStoreChange) {
  window.addEventListener(AUTH_CHANGE_EVENT, onStoreChange);
  window.addEventListener("focus", onStoreChange);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("focus", onStoreChange);
  };
}

function getAuthenticationSnapshot() {
  return Boolean(getToken());
}

function getServerAuthenticationSnapshot() {
  return false;
}

export default function HostCard({
  host,
  rating,
  propertyId,
}) {
  const router = useRouter();

  const [isOpening, setIsOpening] = useState(false);
  const [error, setError] = useState("");

  const hostName = host?.name || "Hôte Kasa";
  const hostPicture = host?.picture?.trim();

  const isAuthenticated = useSyncExternalStore(
    subscribeToAuthentication,
    getAuthenticationSnapshot,
    getServerAuthenticationSnapshot
  );

  const currentUser = isAuthenticated ? getCurrentUser() : null;

  const isOwnProperty =
    currentUser &&
    String(currentUser.id) === String(host?.id);

  async function handleMessageClick() {
    if (isOpening) return;

    setIsOpening(true);
    setError("");

    try {
      const conversation = await createConversation(propertyId);

      router.push(
        `/messages?conversation=${encodeURIComponent(
          conversation.id
        )}`
      );
    } catch (requestError) {
      setError(
        requestError.message ||
          "Impossible d’ouvrir la conversation."
      );

      setIsOpening(false);
    }
  }

  return (
    <aside
      className={styles.card}
      aria-labelledby="host-title"
    >
      <h2
        id="host-title"
        className={styles.title}
      >
        Votre hôte
      </h2>

      <div className={styles.identity}>
        {hostPicture ? (
          <Image
            src={hostPicture}
            alt={`Portrait de ${hostName}`}
            width={64}
            height={64}
            className={styles.avatar}
          />
        ) : (
          <div
            className={styles.avatarFallback}
            aria-hidden="true"
          >
            {hostName.charAt(0).toUpperCase()}
          </div>
        )}

        <div className={styles.details}>
          <p className={styles.name}>
            {hostName}
          </p>

          <p
            className={styles.rating}
            aria-label={`Note moyenne : ${
              rating ?? 0
            } sur 5`}
          >
            ★ {rating ?? 0}
          </p>
        </div>
      </div>

      {!isOwnProperty && (
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.button}
            onClick={handleMessageClick}
            disabled={isOpening}
            aria-busy={isOpening}
          >
            {isOpening
              ? "Ouverture…"
              : "Envoyer un message"}
          </button>

          {error && (
            <p
              className={styles.error}
              role="alert"
            >
              {error}
            </p>
          )}
        </div>
      )}
    </aside>
  );
}