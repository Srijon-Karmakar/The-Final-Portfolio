"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import {
  getStaticKnowledgeContext,
  isSrijonRelatedQuestion,
  staticChatbotAnswer,
} from "@/lib/chatbot/static-knowledge";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: "assistant",
    content: "Ask me about Srijon's skills, projects, experience, education, or contact details.",
  },
];

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const CHATBOT_FUNCTION_NAME =
  process.env.NEXT_PUBLIC_SUPABASE_CHATBOT_FUNCTION_NAME ?? "srijon-chatbot";

async function callSupabaseChatbot(question: string) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase public configuration.");
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 16000);

  try {
    const context = await getStaticKnowledgeContext();
    const response = await fetch(
      `${SUPABASE_URL.replace(/\/$/, "")}/functions/v1/${CHATBOT_FUNCTION_NAME}`,
      {
        body: JSON.stringify({ context, question }),
        headers: {
          apikey: SUPABASE_ANON_KEY,
          authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "content-type": "application/json",
        },
        method: "POST",
        signal: controller.signal,
      }
    );
    const data = await response.json().catch(() => null);

    if (!response.ok || typeof data?.answer !== "string") {
      throw new Error("Supabase chatbot function failed.");
    }

    return data.answer;
  } finally {
    window.clearTimeout(timeout);
  }
}

function BotIcon() {
  return (
    <svg
      className="chatbot-launcher__icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 5V3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M7.5 10.5h.01M16.5 10.5h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.6"
      />
      <path
        d="M8.5 15c1.9 1.25 5.1 1.25 7 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M6.75 7h10.5A3.75 3.75 0 0 1 21 10.75v4.5A3.75 3.75 0 0 1 17.25 19H6.75A3.75 3.75 0 0 1 3 15.25v-4.5A3.75 3.75 0 0 1 6.75 7Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.9"
      />
    </svg>
  );
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isSending]);

  const openChat = () => {
    setIsOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 80);
  };

  const sendMessage = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const question = input.trim();

    if (!question || isSending) {
      return;
    }

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: question },
    ];

    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const answer = isSrijonRelatedQuestion(question)
        ? await callSupabaseChatbot(question).catch(() => staticChatbotAnswer(question))
        : await staticChatbotAnswer(question);
      await new Promise((resolve) => window.setTimeout(resolve, 280));
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: answer,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "I could not connect right now. Ask me about Srijon again in a moment.",
        },
      ]);
    } finally {
      setIsSending(false);
      window.setTimeout(() => inputRef.current?.focus(), 80);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  return (
    <div className={`chatbot-widget ${isOpen ? "chatbot-widget--open" : ""}`}>
      {isOpen ? (
        <section className="chatbot-panel" aria-label="Srijon chatbot">
          <header className="chatbot-panel__header">
            <div>
              <span className="chatbot-panel__eyebrow">Srijon AI</span>
              <h2 className="chatbot-panel__title">Portfolio Chat</h2>
            </div>
            <button
              type="button"
              className="chatbot-icon-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
              title="Close"
            >
              x
            </button>
          </header>

          <div className="chatbot-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`chatbot-message chatbot-message--${message.role}`}
              >
                {message.content}
              </div>
            ))}
            {isSending ? (
              <div className="chatbot-message chatbot-message--assistant">
                Thinking...
              </div>
            ) : null}
            <div ref={messagesEndRef} aria-hidden="true" />
          </div>

          <form className="chatbot-form" onSubmit={sendMessage}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Srijon"
              rows={1}
              className="chatbot-form__input"
              aria-label="Ask about Srijon"
            />
            <button
              type="submit"
              className="chatbot-form__submit"
              disabled={isSending || !input.trim()}
              aria-label="Send message"
              title="Send"
            >
              {"\u2191"}
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        className="chatbot-launcher"
        onClick={openChat}
        aria-label="Open Srijon chatbot"
        title="Chat"
      >
        <span className="chatbot-launcher__glow chatbot-launcher__glow--outer" />
        <span className="chatbot-launcher__glow chatbot-launcher__glow--inner" />
        <span className="chatbot-launcher__border" />
        <span className="chatbot-launcher__content">
          <BotIcon />
        </span>
      </button>
    </div>
  );
}
