"use client";

import { useActionState } from "react";
import Link from "next/link";
import { submitEnquiry } from "@/app/contact/actions";
import { brand } from "@/content/brand";
import { interestOptions, isInterest, type EnquiryState } from "@/lib/enquiry";
import { Button } from "./button";

export function EnquiryForm({ interest }: { interest?: string }) {
  const [state, action, pending] = useActionState(submitEnquiry, null as EnquiryState);
  const defaultInterest = interest && isInterest(interest) ? interest : "";

  if (state?.status === "success") {
    return (
      <div className="rounded-3xl bg-white p-7 text-ink sm:p-9" role="status">
        <p className="font-mono text-[0.72rem] tracking-[0.14em] text-muted uppercase">Request received</p>
        <h3 className="mt-3 text-3xl tracking-[-0.04em]">We have it.</h3>
        <p className="mt-4 max-w-md text-base leading-relaxed text-gray-600">
          We read your request and reply within {brand.responseWindow}.
        </p>
      </div>
    );
  }

  const errors = state?.status === "error" ? state.errors : {};

  return (
    <form action={action} className="relative rounded-3xl bg-white p-7 text-ink sm:p-9" noValidate>
      <p className="text-2xl tracking-[-0.04em]">Tell us about your project</p>
      <p className="mt-2 text-base text-gray-600">A few details are enough. We will take it from there.</p>
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label className="field">
          <span>Your name</span>
          <input name="name" autoComplete="name" aria-invalid={errors.name ? true : undefined} aria-describedby={errors.name ? "err-name" : undefined} required />
          {errors.name ? <p id="err-name" className="field-error">{errors.name}</p> : null}
        </label>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" aria-invalid={errors.email ? true : undefined} aria-describedby={errors.email ? "err-email" : undefined} required />
          {errors.email ? <p id="err-email" className="field-error">{errors.email}</p> : null}
        </label>
        <label className="field sm:col-span-2">
          <span>I am interested in</span>
          <select name="interest" defaultValue={defaultInterest} aria-invalid={errors.interest ? true : undefined} aria-describedby={errors.interest ? "err-interest" : undefined} required>
            <option value="">Choose one</option>
            {interestOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.interest ? <p id="err-interest" className="field-error">{errors.interest}</p> : null}
        </label>
        <label className="field sm:col-span-2">
          <span>Your budget in EUR, a rough number</span>
          <input name="budget" inputMode="decimal" autoComplete="off" placeholder="Optional" />
        </label>
        <label className="field sm:col-span-2">
          <span>Tell us about your project</span>
          <textarea name="message" aria-invalid={errors.message ? true : undefined} aria-describedby={errors.message ? "err-message" : undefined} required />
          {errors.message ? <p id="err-message" className="field-error">{errors.message}</p> : null}
        </label>
      </div>
      <label className="hp" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="mt-5 flex items-start gap-3 text-base leading-relaxed text-gray-600">
        <input name="consent" type="checkbox" className="mt-1 size-4" aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? "err-consent" : undefined} />
        <span>
          By submitting this form, you agree to our <Link href="/policies" className="text-link">terms</Link> and{" "}
          <Link href="/policies#privacy" className="text-link">privacy policy</Link>.
        </span>
      </label>
      {errors.consent ? <p id="err-consent" className="field-error mt-3">{errors.consent}</p> : null}
      <div className="mt-6">
        <Button type="submit" variant="ink" disabled={pending}>
          {pending ? "Sending" : "Send quote request"}
        </Button>
      </div>
      <p className="mt-4 text-sm text-gray-600">What happens next: we read your request and reply within {brand.responseWindow}.</p>
    </form>
  );
}
