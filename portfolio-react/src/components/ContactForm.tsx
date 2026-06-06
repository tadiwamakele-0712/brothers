import { useState, useEffect, type FormEvent } from "react";
import { DRAFT_KEY } from "../constants";
import { postContact } from "../api/portfolioApi";

interface ContactFormProps {
  onSent?: () => void;
}

export default function ContactForm({ onSent }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [lastName, setLastName] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);
  const [viaApi, setViaApi] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (!saved) return;

    try {
      const draft = JSON.parse(saved);
      setName(draft.name || "");
      setEmail(draft.email || "");
      setMessage(draft.message || "");
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    }
  }, []);

  useEffect(() => {
    if (sent) return;

    const timer = setTimeout(() => {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ name, email, message })
      );
      setDraftSaved(true);
    }, 400);

    return () => clearTimeout(timer);
  }, [name, email, message, sent]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      alert("Zadza zvese — zita, email, uye message.");
      return;
    }

    setSending(true);
    let savedToApi = false;

    try {
      await postContact({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      savedToApi = true;
    } catch {
      savedToApi = false;
    }

    setLastName(name.trim());
    setViaApi(savedToApi);
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
    localStorage.removeItem(DRAFT_KEY);
    setDraftSaved(false);
    setSending(false);
    onSent?.();
  }

  function resetForm() {
    setSent(false);
    setLastName("");
    setViaApi(false);
  }

  if (sent) {
    return (
      <div className="form-success">
        <p>
          Maita basa, <strong>{lastName}</strong>! Message yako yatambirwa
          {viaApi ? " uye yachengetwa pa Express API." : " (local mode — API offline)."}
        </p>
        <button type="button" className="btn-small" onClick={resetForm}>
          Tumira imwe message
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>
        Zita
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Zita rako"
        />
      </label>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
        />
      </label>
      <label>
        Message
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nyora message yako pano..."
          rows={4}
        />
      </label>
      {draftSaved && (
        <p className="draft-hint">Draft yachengetwa mu browser</p>
      )}
      <button type="submit" className="btn-submit" disabled={sending}>
        {sending ? "Kutumira..." : "Tumira ku API"}
      </button>
    </form>
  );
}
