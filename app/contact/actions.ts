"use server";

import { brand } from "@/content/brand";
import { readEnquiry, validateEnquiry, type EnquiryState } from "@/lib/enquiry";

export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const input = readEnquiry(formData);
  const { state, spam } = validateEnquiry(input);

  if (state.status === "error" || spam) {
    if (spam) console.info("enquiry honeypot");
    return state;
  }

  const budget = /^\d+(\.\d+)?$/.test(input.budget) ? input.budget : "";
  console.info("enquiry received", {
    name: input.name,
    email: input.email,
    interest: input.interest,
    budget,
    message: input.message,
  });

  const key = process.env.RESEND_API_KEY;
  if (key) {
    const from = process.env.RESEND_FROM || `enquiries@${brand.email.split("@")[1] ?? "localhost"}`;
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [brand.email],
          reply_to: input.email,
          subject: `Project enquiry from ${input.name}`,
          text: [`Name: ${input.name}`, `Email: ${input.email}`, `Interest: ${input.interest}`, `Budget EUR: ${budget || "not given"}`, "", input.message].join("\n"),
        }),
      });
      if (!response.ok) console.info("enquiry email failed", response.status);
    } catch (error) {
      console.info("enquiry email error", error instanceof Error ? error.message : "unknown");
    }
  }

  return state;
}
