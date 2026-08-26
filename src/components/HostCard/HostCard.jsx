"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createConversation } from "@/lib/services/messagesService";

import styles from "./HostCard.module.css";

export default function HostCard({
  host,
  rating,
  propertyId,
}) {
  const router = useRouter();
  const [isOpening, setIsOpening] = useState(false);
  const [error, setError] = useState("");

  async function handleMessageClick() {
    if (isOpening) return;

    setIsOpening(true);
    setError("");

    try {
      const conversation =
        await createConversation(propertyId);

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
      <h2 id="host-title" className={styles.title}>
        Votre hôte
      </h2>

      <div className={styles.identity}>
        <Image
          src={host.picture}
          alt={`Portrait de ${host.name}`}
          width={64}
          height={64}
          className={styles.avatar}
        />

        <div className={styles.details}>
          <p className={styles.name}>{host.name}</p>
          <p
            className={styles.rating}
            aria-label={`Note moyenne : ${rating} sur 5`}
          >
            ★ {rating}
          </p>
        </div>
      </div>

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
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
      </div>
    </aside>
  );
}