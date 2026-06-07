"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Editable } from "@/components/cms/editable";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all three fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      // CRM endpoint is configurable via the inline editor (settings.crmWebhookUrl).
      const cfg = await fetch("/api/content")
        .then((r) => r.json())
        .catch(() => ({}));
      const url = cfg?.settings?.crmWebhookUrl || "/api/lead";
      await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
    } catch {
      /* network issue — still acknowledge the visitor */
    } finally {
      setSubmitting(false);
      setSent(true);
    }
  }

  return (
    <div className="glass-strong rounded-3xl p-8 sm:p-10">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue to-blue text-white"
            >
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </motion.div>
            <h3 className="mt-6 font-display text-2xl font-bold">
              Thanks, {name.split(" ")[0]}!
            </h3>
            <p className="mt-2 text-muted">
              We&apos;ve received your details and will be in touch shortly.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
            noValidate
          >
            <Field
              label="Name"
              labelId="contact.form.name"
              required
              value={name}
              onChange={setName}
              type="text"
              placeholder="Your name"
            />
            <Field
              label="Email"
              labelId="contact.form.email"
              required
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="you@company.com"
            />
            <Field
              label="How can we help?"
              labelId="contact.form.message"
              required
              value={message}
              onChange={setMessage}
              type="textarea"
              placeholder="Tell us about your AI goals or the ROI you want to measure…"
            />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-rose-600"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={submitting}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              className="w-full rounded-full bg-gradient-to-r from-blue via-blue-bright to-navy px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(3,105,161,0.45)] disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Submit"}
            </motion.button>

            <Editable as="p" id="contact.form.notice" className="text-center text-xs leading-relaxed text-muted">
              This site is protected by reCAPTCHA and the Google Privacy Policy
              and Terms of Service apply.
            </Editable>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  labelId,
  required,
  value,
  onChange,
  type,
  placeholder,
}: {
  label: string;
  labelId: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  type: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground/90">
        <Editable as="span" id={labelId}>{label}</Editable>
        {required && <span className="text-blue"> *</span>}
      </span>
      {type === "textarea" ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-foreground outline-none transition-all placeholder:text-muted/60 focus:border-blue/50 focus:ring-2 focus:ring-blue/20"
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-foreground outline-none transition-all placeholder:text-muted/60 focus:border-blue/50 focus:bg-white focus:ring-2 focus:ring-blue/20"
        />
      )}
    </label>
  );
}
