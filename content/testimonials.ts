export type Testimonial = {
  quote: string
  name: string
  role: string
  source: string
  rating: 5
  sample: boolean
}

export const testimonials: Testimonial[] = [
  {
    quote: "Sample review. Replace this sentence with words a client actually wrote.",
    name: "Client name",
    role: "Role, company",
    source: "Sample",
    rating: 5,
    sample: true,
  },
  {
    quote: "Second sample card, so the carousel can move. Real quotes are added in the content file.",
    name: "Client name",
    role: "Role, company",
    source: "Sample",
    rating: 5,
    sample: true,
  },
]
