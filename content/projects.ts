export type Project = {
  slug: string
  title: string
  industry: string
  year: string
  disciplines: string[]
  summary: string
  problem: string
  work: string
  outcome: string
  cover: "ledger" | "fieldnote" | "relay"
  sample: boolean
}

export const projects: Project[] = [
  {
    slug: "harbor-ledger",
    title: "Harbor Ledger",
    industry: "Finance",
    year: "2026",
    disciplines: ["UI/UX Design"],
    summary: "A sample dashboard for a bookkeeping product. A layout study, not a client engagement.",
    problem:
      "The imagined product kept five tools open at once. Nothing showed what a reviewer had to handle first.",
    work: "One queue, a quiet type scale and a review flow that fits on a laptop without a second screen.",
    outcome:
      "A sample interface for the portfolio. It is not a launched product and it does not claim a performance number.",
    cover: "ledger",
    sample: true,
  },
  {
    slug: "fieldnote",
    title: "Fieldnote",
    industry: "Architecture",
    year: "2026",
    disciplines: ["UI/UX Design", "Development"],
    summary: "A sample studio site with long project pages and a grid that lets the work lead.",
    problem:
      "The imagined practice was winning work on reputation, then sending people to a site that looked rented.",
    work: "A typographic homepage, project pages with room for drawings, and a build a small team could edit.",
    outcome:
      "A sample case used to show web design and development together. The practice is fictional.",
    cover: "fieldnote",
    sample: true,
  },
  {
    slug: "relay-desk",
    title: "Relay Desk",
    industry: "Operations",
    year: "2026",
    disciplines: ["Product Design", "AI Integration"],
    summary: "A sample workspace where new enquiries are sorted before a person replies.",
    problem:
      "The imagined team answered the same questions in an inbox, then lost the thread when the day got busy.",
    work: "A desk that groups enquiries, drafts a reply from approved answers and flags anything a person must take.",
    outcome:
      "A sample of an AI workflow UI. No customer data sits behind it and no savings figure is claimed.",
    cover: "relay",
    sample: true,
  },
]

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug)
}

export const featuredProjects = projects.slice(0, 4)
