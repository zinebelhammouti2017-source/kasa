import Link from "next/link";

export default function MessagesPage() {
  return (
    <main>
      <Link href="/" aria-label="Retour aux annonces">
        ← Retour aux annonces
      </Link>

      <h1>Messagerie</h1>

      <p>
        Cette fonctionnalité sera entièrement développée lors du Sprint 2.
      </p>

      <p>
        Vous pourrez consulter vos conversations et envoyer un message à votre
        hôte.
      </p>
    </main>
  );
}