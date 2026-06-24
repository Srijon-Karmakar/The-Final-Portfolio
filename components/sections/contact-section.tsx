"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type ContactFormData = {
  address: string;
  email: string;
  message: string;
  name: string;
};

const CONTACT_TABLE =
  process.env.NEXT_PUBLIC_SUPABASE_CONTACT_TABLE ?? "contact_messages";

const CONTACT_COLUMNS = {
  address: process.env.NEXT_PUBLIC_SUPABASE_CONTACT_ADDRESS_COLUMN ?? "address",
  email: process.env.NEXT_PUBLIC_SUPABASE_CONTACT_EMAIL_COLUMN ?? "email",
  message: process.env.NEXT_PUBLIC_SUPABASE_CONTACT_MESSAGE_COLUMN ?? "message",
  name: process.env.NEXT_PUBLIC_SUPABASE_CONTACT_NAME_COLUMN ?? "name",
} as const;

const INITIAL_FORM: ContactFormData = {
  address: "",
  email: "",
  message: "",
  name: "",
};

export function ContactSection() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const openModal = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) {
      return;
    }

    setIsOpen(false);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedData = {
      address: formData.address.trim(),
      email: formData.email.trim(),
      message: formData.message.trim(),
      name: formData.name.trim(),
    };

    if (
      !trimmedData.name ||
      !trimmedData.email ||
      !trimmedData.address ||
      !trimmedData.message
    ) {
      setErrorMessage("Fill in all fields before sending.");
      setSuccessMessage("");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const payload = {
        [CONTACT_COLUMNS.address]: trimmedData.address,
        [CONTACT_COLUMNS.email]: trimmedData.email,
        [CONTACT_COLUMNS.message]: trimmedData.message,
        [CONTACT_COLUMNS.name]: trimmedData.name,
      };

      const { error } = await supabase.from(CONTACT_TABLE).insert(payload);

      if (error) {
        throw error;
      }

      setFormData(INITIAL_FORM);
      setSuccessMessage("Message sent. I will get back to you soon.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while sending your message.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="contact-section" id="contact">
        <div className="contact-shell">
          <div className="contact-grid">
            <div className="contact-mark" aria-hidden="true">
              <img src="/logo/icon.png" alt="" className="contact-mark__image" />
            </div>

            <div className="contact-content">
              <h2 className="contact-title">Let&apos;s talk about your project and the next steps</h2>

              <div className="contact-actions">
                <button
                  type="button"
                  className="contact-action contact-action--primary"
                  onClick={openModal}
                >
                  Start a Project
                </button>
                <a
                  className="contact-action contact-action--secondary"
                  href="mailto:srijonkarmakar.dev@gmail.com"
                >
                  srijonkarmakar.dev@gmail.com
                </a>
              </div>

              <div className="contact-meta">
                <div className="contact-meta__row">
                  <span className="contact-meta__label">Quick Contact</span>
                  <div className="contact-meta__value">
                    <a href="mailto:srijonkarmakar.dev@gmail.com">Email</a>
                    <a
                      href="https://www.linkedin.com/in/srijon-karmakar/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>

                <div className="contact-meta__row">
                  <span className="contact-meta__label">Location</span>
                  <div className="contact-meta__value">
                    <span>Kolkata, India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-footer">
            <span>All rights reserved. Srijon K. 2026.</span>
            <a href="/cv/cv.pdf" target="_blank" rel="noopener noreferrer">
              Resume / CV
            </a>
            <span>Full-Stack Developer</span>
          </div>
        </div>
      </section>

      {isOpen ? (
        <div
          className="contact-modal-backdrop"
          onClick={closeModal}
          role="presentation"
        >
          <div
            className="contact-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="contact-modal__header">
              <div>
                <span className="contact-modal__eyebrow">Message</span>
                <h3 id="contact-modal-title" className="contact-modal__title">
                  Start the conversation
                </h3>
              </div>
              <button
                type="button"
                className="contact-modal__close"
                onClick={closeModal}
                aria-label="Close contact modal"
              >
                Close
              </button>
            </div>

            <form className="contact-modal__form" onSubmit={handleSubmit}>
              <label className="contact-modal__field">
                <span>Name</span>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>

              <label className="contact-modal__field">
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </label>

              <label className="contact-modal__field">
                <span>City, Country</span>
                <input
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Kolkata, India"
                  autoComplete="address-level2"
                />
              </label>

              <label className="contact-modal__field">
                <span>Message</span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about the role, project, or collaboration."
                  rows={5}
                />
              </label>

              {errorMessage ? (
                <p className="contact-modal__status contact-modal__status--error">
                  {errorMessage}
                </p>
              ) : null}

              {successMessage ? (
                <p className="contact-modal__status contact-modal__status--success">
                  {successMessage}
                </p>
              ) : null}

              <button
                type="submit"
                className="contact-modal__submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
