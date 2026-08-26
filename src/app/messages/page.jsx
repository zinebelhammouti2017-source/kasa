"use client";

import {
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";

import {
  getConversations,
  getConversationMessages,
  markConversationAsRead,
  sendMessage,
} from "@/lib/services/messagesService";

import styles from "./page.module.css";

function parseDate(value) {
  if (!value) return null;

  const normalizedValue =
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(
      value
    )
      ? `${value.replace(" ", "T")}Z`
      : value;

  const date = new Date(normalizedValue);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatTime(value) {
  const date = parseDate(value);

  if (!date) return "";

  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getDayKey(value) {
  const date = parseDate(value);

  if (!date) return "";

  return [
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ].join("-");
}

function formatDateSeparator(value) {
  const date = parseDate(value);

  if (!date) return "";

  const today = new Date();

  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  ) {
    return "AUJOURD’HUI";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
  })
    .format(date)
    .toUpperCase();
}

function getInitial(name) {
  return name?.trim().charAt(0).toUpperCase() || "?";
}

function getImageSource(picture) {
  if (!picture) return null;

  try {
    const imageUrl = new URL(picture);

    if (imageUrl.pathname.startsWith("/uploads/")) {
      return imageUrl.pathname;
    }
  } catch {
    return picture;
  }

  return picture;
}

function Avatar({
  picture,
  name,
  message = false,
}) {
  const imageSource = getImageSource(picture);

  const imageClassName = message
    ? styles.messageAvatar
    : styles.avatar;

  const fallbackClassName = message
    ? styles.messageAvatarFallback
    : styles.avatarFallback;

  const size = message ? 32 : 48;

  if (!imageSource) {
    return (
      <span
        className={fallbackClassName}
        aria-hidden="true"
      >
        {getInitial(name)}
      </span>
    );
  }

  return (
    <Image
      className={imageClassName}
      src={imageSource}
      alt=""
      width={size}
      height={size}
    />
  );
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState(
    []
  );
  const [
    selectedConversationId,
    setSelectedConversationId,
  ] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");

  const [
    isLoadingConversations,
    setIsLoadingConversations,
  ] = useState(true);
  const [
    isLoadingMessages,
    setIsLoadingMessages,
  ] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] =
    useState(false);

  const [conversationsError, setConversationsError] =
    useState("");
  const [messagesError, setMessagesError] =
    useState("");
  const [sendError, setSendError] = useState("");

  const messagesContainerRef = useRef(null);
  const backButtonRef = useRef(null);
  const selectedConversationButtonRef = useRef(null);
  const textareaRef = useRef(null);

  const selectedConversation = conversations.find(
    (conversation) =>
      String(conversation.id) ===
      String(selectedConversationId)
  );

  useEffect(() => {
    let isCancelled = false;

    async function loadConversations() {
      setIsLoadingConversations(true);
      setConversationsError("");

      try {
        const receivedConversations =
          await getConversations();

        if (isCancelled) return;

        setConversations(receivedConversations);

        if (receivedConversations.length > 0) {
          setSelectedConversationId(
            receivedConversations[0].id
          );
        }
      } catch (error) {
        if (isCancelled) return;

        setConversationsError(
          error.message ||
            "Impossible de charger les conversations."
        );
      } finally {
        if (!isCancelled) {
          setIsLoadingConversations(false);
        }
      }
    }

    loadConversations();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedConversationId) {
     return;
    }

    let isCancelled = false;

    async function loadMessages() {
      setIsLoadingMessages(true);
      setMessagesError("");
      setSendError("");

      try {
        const data = await getConversationMessages(
          selectedConversationId
        );

        if (isCancelled) return;

        setMessages(data.messages);

        try {
          await markConversationAsRead(
            selectedConversationId
          );

          if (isCancelled) return;

          setConversations((currentConversations) =>
            currentConversations.map((conversation) =>
              String(conversation.id) ===
              String(selectedConversationId)
                ? {
                    ...conversation,
                    unread_count: 0,
                  }
                : conversation
            )
          );
        } catch {
          // Les messages restent consultables même si leur
          // statut de lecture n’a pas pu être actualisé.
        }
      } catch (error) {
        if (isCancelled) return;

        setMessages([]);
        setMessagesError(
          error.message ||
            "Impossible de charger les messages."
        );
      } finally {
        if (!isCancelled) {
          setIsLoadingMessages(false);
        }
      }
    }

    loadMessages();

    return () => {
      isCancelled = true;
    };
  }, [selectedConversationId]);

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (isMobileChatOpen) {
      backButtonRef.current?.focus();
    }
  }, [isMobileChatOpen]);

  function handleConversationSelection(
    conversationId
  ) {
    setSelectedConversationId(conversationId);
    setIsMobileChatOpen(true);
  }

  function handleMobileBack() {
    setIsMobileChatOpen(false);

    window.requestAnimationFrame(() => {
      selectedConversationButtonRef.current?.focus();
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const normalizedDraft = draft.trim();

    if (
      !selectedConversationId ||
      !normalizedDraft ||
      isSending
    ) {
      return;
    }

    setIsSending(true);
    setSendError("");

    try {
      const newMessage = await sendMessage(
        selectedConversationId,
        normalizedDraft
      );

      setMessages((currentMessages) => [
        ...currentMessages,
        newMessage,
      ]);

      setConversations((currentConversations) =>
        currentConversations.map((conversation) =>
          String(conversation.id) ===
          String(selectedConversationId)
            ? {
                ...conversation,
                last_message: {
                  id: newMessage.id,
                  content: newMessage.content,
                  sender_id: newMessage.sender.id,
                  is_read: newMessage.is_read,
                  created_at: newMessage.created_at,
                },
                updated_at: newMessage.created_at,
              }
            : conversation
        )
      );

      setDraft("");
    } catch (error) {
      setSendError(
        error.message ||
          "Le message n’a pas pu être envoyé."
      );
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.messaging}>
        <aside
          className={`${styles.sidebar} ${
            isMobileChatOpen
              ? styles.sidebarHidden
              : ""
          }`}
          aria-label="Liste des conversations"
        >
          <Link href="/" className={styles.backLink}>
            ← Retour 
          </Link>

          <h1 className={styles.title}>Messages</h1>

          {isLoadingConversations && (
            <p
              className={styles.status}
              role="status"
            >
              Chargement des conversations…
            </p>
          )}

          {conversationsError && (
            <p className={styles.error} role="alert">
              {conversationsError}
            </p>
          )}

          {!isLoadingConversations &&
            !conversationsError &&
            conversations.length === 0 && (
              <p className={styles.status}>
                Vous n’avez aucune conversation pour le
                moment.
              </p>
            )}

          {conversations.length > 0 && (
            <ul
              className={styles.conversationList}
              aria-label="Vos conversations"
            >
              {conversations.map((conversation) => {
                const isSelected =
                  String(conversation.id) ===
                  String(selectedConversationId);

                const participantName =
                  conversation.participant?.name ||
                  "Utilisateur";

                const unreadCount =
                  Number(
                    conversation.unread_count
                  ) || 0;

                return (
                  <li
                    key={conversation.id}
                    className={
                      styles.conversationItem
                    }
                  >
                    <button
                      ref={
                        isSelected
                          ? selectedConversationButtonRef
                          : null
                      }
                      type="button"
                      className={`${
                        styles.conversationButton
                      } ${
                        isSelected
                          ? styles.conversationButtonActive
                          : ""
                      }`}
                      aria-current={
                        isSelected
                          ? "true"
                          : undefined
                      }
                      aria-label={`${participantName}, ${
                        conversation.property?.title ||
                        "logement"
                      }${
                        unreadCount > 0
                          ? `, ${unreadCount} message${
                              unreadCount > 1
                                ? "s"
                                : ""
                            } non lu${
                              unreadCount > 1
                                ? "s"
                                : ""
                            }`
                          : ""
                      }`}
                      onClick={() =>
                        handleConversationSelection(
                          conversation.id
                        )
                      }
                    >
                      <Avatar
                        picture={
                          conversation.participant
                            ?.picture
                        }
                        name={participantName}
                      />

                      <span
                        className={
                          styles.conversationContent
                        }
                      >
                        <span
                          className={
                            styles.conversationTopLine
                          }
                        >
                          <span
                            className={
                              styles.participantName
                            }
                          >
                            {participantName}
                          </span>

                          <time
                            className={styles.time}
                            dateTime={
                              conversation.last_message
                                ?.created_at ||
                              conversation.updated_at
                            }
                          >
                            {formatTime(
                              conversation.last_message
                                ?.created_at ||
                                conversation.updated_at
                            )}
                          </time>
                        </span>

                        <span
                          className={
                            styles.previewLine
                          }
                        >
                          <span
                            className={
                              styles.preview
                            }
                          >
                            {conversation.last_message
                              ?.content ||
                              conversation.property
                                ?.title ||
                              "Nouvelle conversation"}
                          </span>

                          {unreadCount > 0 && (
                            <span
                              className={
                                styles.unreadDot
                              }
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        <section
          className={`${styles.chat} ${
            isMobileChatOpen
              ? styles.chatOpen
              : ""
          }`}
          aria-label={
            selectedConversation
              ? `Conversation avec ${
                  selectedConversation.participant
                    ?.name || "l’utilisateur"
                }`
              : "Conversation"
          }
          aria-busy={isLoadingMessages}
        >
          {!selectedConversation ? (
            <p className={styles.chatStatus}>
              Sélectionnez une conversation pour afficher
              les messages.
            </p>
          ) : (
            <>
              <button
                ref={backButtonRef}
                type="button"
                className={styles.mobileBackButton}
                onClick={handleMobileBack}
              >
                ← Retour
              </button>

              {isLoadingMessages ? (
                <p
                  className={styles.chatStatus}
                  role="status"
                >
                  Chargement des messages…
                </p>
              ) : (
                <>
                  <div
                    ref={messagesContainerRef}
                    className={styles.messages}
                    aria-live="polite"
                  >
                    {messagesError && (
                      <p
                        className={styles.error}
                        role="alert"
                      >
                        {messagesError}
                      </p>
                    )}

                    {!messagesError &&
                      messages.length === 0 && (
                        <p
                          className={
                            styles.chatStatus
                          }
                        >
                          Aucun message pour le moment.
                          Vous pouvez commencer la
                          conversation.
                        </p>
                      )}

                    {!messagesError &&
                      messages.map(
                        (message, index) => {
                          const previousMessage =
                            messages[index - 1];

                          const shouldDisplayDate =
                            Boolean(previousMessage) &&
                            getDayKey(previousMessage.created_at) !==
                            getDayKey(message.created_at);

                          const participantId =
                            selectedConversation
                              .participant?.id;

                          const isSent =
                            String(
                              message.sender?.id
                            ) !==
                            String(participantId);

                          const senderName =
                            message.sender?.name ||
                            "Utilisateur";

                          return (
                            <Fragment key={message.id}>
                              {shouldDisplayDate && (
                                <div
                                  className={
                                    styles.dateSeparator
                                  }
                                >
                                  <span>
                                    {formatDateSeparator(
                                      message.created_at
                                    )}
                                  </span>
                                </div>
                              )}

                              <article
                                className={`${
                                  styles.messageRow
                                } ${
                                  isSent
                                    ? styles.sentRow
                                    : ""
                                }`}
                              >
                                <Avatar
                                  picture={
                                    message.sender
                                      ?.picture
                                  }
                                  name={senderName}
                                  message
                                />

                                <div
                                  className={
                                    styles.messageContent
                                  }
                                >
                                  <div
                                    className={`${
                                      styles.messageMeta
                                    } ${
                                      isSent
                                        ? styles.sentMeta
                                        : ""
                                    }`}
                                  >
                                    <span>
                                      {senderName}
                                    </span>

                                    <span aria-hidden="true">•</span>
                                    
                                    <time
                                      dateTime={
                                        message.created_at
                                      }
                                    >
                                      {formatTime(
                                        message.created_at
                                      )}
                                    </time>
                                  </div>

                                  <p
                                    className={`${
                                      styles.messageBubble
                                    } ${
                                      isSent
                                        ? styles.sentBubble
                                        : styles.receivedBubble
                                    }`}
                                  >
                                    {message.content}
                                  </p>
                                </div>
                              </article>
                            </Fragment>
                          );
                        }
                      )}
                  </div>

                  <form
                    className={styles.composer}
                    onSubmit={handleSubmit}
                  >
                    <label
                      className={styles.inputLabel}
                      htmlFor="message-content"
                    >
                      Votre message
                    </label>

                    <textarea
                      ref={textareaRef}
                      id="message-content"
                      className={styles.textarea}
                      value={draft}
                      rows="1"
                      maxLength="2000"
                      placeholder="Écrivez votre message..."
                      disabled={isSending}
                      onChange={(event) =>
                        setDraft(event.target.value)
                      }
                    />

                    <button
                      type="submit"
                      className={styles.sendButton}
                      disabled={
                        isSending || !draft.trim()
                      }
                      aria-label="Envoyer le message"
                    >
                      {isSending ? "…" : "➤"}
                    </button>
                  </form>

                  {sendError && (
                    <p
                      className={styles.error}
                      role="alert"
                    >
                      {sendError}
                    </p>
                  )}
                </>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}