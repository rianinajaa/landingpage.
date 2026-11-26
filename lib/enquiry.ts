export const interestOptions = [
  { value: "web-design", label: "Web Design" },
  { value: "development", label: "Development" },
  { value: "growth", label: "Growth" },
  { value: "ai", label: "AI Integration" },
  { value: "other", label: "Other" },
] as const

export type Interest = (typeof interestOptions)[number]["value"]

export type FieldKey = "name" | "email" | "interest" | "message" | "consent"

export type FieldErrors = Partial<Record<FieldKey, string>>

export type EnquiryState = { status: "success" } | { status: "error"; errors: FieldErrors } | null

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isInterest(value: string): value is Interest {
  return interestOptions.some((option) => option.value === value)
}

export function readEnquiry(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim().slice(0, 120),
    email: String(formData.get("email") ?? "").trim().slice(0, 180),
    interest: String(formData.get("interest") ?? "").trim(),
    budget: String(formData.get("budget") ?? "").trim().slice(0, 12),
    message: String(formData.get("message") ?? "").trim().slice(0, 5000),
    consent: formData.get("consent") === "on",
    website: String(formData.get("website") ?? "").trim(),
  }
}

export function validateEnquiry(input: ReturnType<typeof readEnquiry>): {
  state: Exclude<EnquiryState, null>
  spam: boolean
} {
  if (input.website) {
    return { state: { status: "success" }, spam: true }
  }

  const errors: FieldErrors = {}
  if (input.name.length < 2) errors.name = "Enter your name."
  if (!emailPattern.test(input.email)) errors.email = "Enter a valid email address."
  if (!isInterest(input.interest)) errors.interest = "Choose what you need."
  if (input.message.length < 20) errors.message = "Tell us a little more, at least a sentence."
  if (!input.consent) errors.consent = "Agree to the terms and privacy policy to send this."

  if (Object.keys(errors).length > 0) {
    return { state: { status: "error", errors }, spam: false }
  }

  return { state: { status: "success" }, spam: false }
}
