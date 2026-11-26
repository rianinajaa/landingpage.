export type Service = {
  slug: string
  group: string
  title: string
  navLabel: string
  interest: string
  summary: string
  promise: string
  facts: { label: string; value: string }[]
  includes: { title: string; body: string }[]
  fit: string[]
  notFit: string[]
  faqs: { q: string; a: string }[]
}

export const services: Service[] = [
  {
    slug: "web-design",
    group: "Design",
    title: "Web design",
    navLabel: "Web Design",
    interest: "web-design",
    summary:
      "Custom interfaces shaped around your offer and the person who has to trust it.",
    promise:
      "A site that looks considered, reads clearly and makes the next step obvious.",
    facts: [
      { label: "Starting point", value: "Discovery" },
      { label: "Handoff", value: "Figma" },
      { label: "Timeline", value: "Scoped" },
    ],
    includes: [
      { title: "Discovery notes", body: "Goals, audience and the job the site has to do, written down before screens." },
      { title: "Page structure", body: "A map of pages and sections based on how a buyer decides." },
      { title: "Desktop and mobile", body: "Layouts designed for a phone and a wide screen from the start." },
      { title: "Type and color", body: "A small system, documented, so later pages do not drift." },
      { title: "Clickable prototype", body: "A Figma flow you can walk through before development." },
      { title: "Handoff notes", body: "Spacing, states and content notes a developer can build from." },
    ],
    fit: [
      "Design quality changes what a buyer believes about you.",
      "You are launching or replacing a site that looks like a template.",
      "You want design and build in one conversation.",
    ],
    notFit: [
      "You are collecting the lowest bid from several studios.",
      "You need a theme swapped in by the end of the week.",
    ],
    faqs: [
      {
        q: "What kinds of design projects do you take?",
        a: "New sites, redesigns and product interfaces where the way it looks changes revenue or trust.",
      },
      {
        q: "How long does design take?",
        a: "It is scoped after discovery. A single landing page is shorter than a site with a component system. Dates land in the proposal, not in a public rate card.",
      },
      {
        q: "What do you need from us?",
        a: "A clear offer, examples you like and access to anyone who approves the work. We will ask for the rest.",
      },
    ],
  },
  {
    slug: "web-development",
    group: "Development",
    title: "Web development",
    navLabel: "Web Development",
    interest: "development",
    summary:
      "Fast sites and web apps with a codebase the next person can read.",
    promise:
      "A build that loads quickly, stays editable and is ready to measure on day one.",
    facts: [
      { label: "Stack", value: "Next.js" },
      { label: "Also", value: "Shopify / WP" },
      { label: "Timeline", value: "Scoped" },
    ],
    includes: [
      { title: "Custom build", body: "Next.js when the site should be fast and specific. A platform when your team already lives in one." },
      { title: "Responsive UI", body: "The design built properly at phone, tablet and desktop widths." },
      { title: "Editable content", body: "A CMS or structured content your team will actually update." },
      { title: "Search foundations", body: "Titles, descriptions, headings and a sitemap that match the pages." },
      { title: "Measurement", body: "Analytics hooks so launch day is not a blank report." },
      { title: "Launch checklist", body: "Redirects, forms, performance and a handoff you can keep." },
    ],
    fit: [
      "You need the design implemented without a second agency.",
      "The current site is slow, fragile or hard to update.",
      "You are shipping a product interface, not only a brochure.",
    ],
    notFit: [
      "You want a page builder stack we would have to unwind in a year.",
      "The project is a plugin pile with no owner after launch.",
    ],
    faqs: [
      {
        q: "Do you only build in Next.js?",
        a: "No. Next.js is the default for custom work. WordPress and Shopify are on the table when they fit the team.",
      },
      {
        q: "Can you rebuild a site we already have?",
        a: "Yes. We start with what should be kept, what should be replaced and how search equity moves across.",
      },
      {
        q: "Who maintains it afterwards?",
        a: "We can, or your team can. The handoff includes how content and deploys work.",
      },
    ],
  },
  {
    slug: "growth",
    group: "Growth",
    title: "SEO and AI search",
    navLabel: "SEO and AI Search",
    interest: "growth",
    summary:
      "Structure and measurement so the right people can find you on Google and in AI answers.",
    promise:
      "Pages that are easier to understand, for people and for the systems that recommend you.",
    facts: [
      { label: "Search", value: "Google" },
      { label: "Answers", value: "AI search" },
      { label: "Model", value: "Retainer" },
    ],
    includes: [
      { title: "Technical fixes", body: "Indexing, speed, titles and the issues that keep pages out of results." },
      { title: "Page structure", body: "Headings and internal links that match how people search." },
      { title: "Copy direction", body: "What each important page should say, in your voice, not a keyword dump." },
      { title: "AI search", body: "Clear entities, answers and sources so assistants can describe you accurately." },
      { title: "Analytics", body: "A short set of numbers: visits, enquiries and the pages that produce them." },
      { title: "Monthly focus", body: "A written list of what changed and what is next. No vanity report." },
    ],
    fit: [
      "You already have a site and the enquiries are too quiet.",
      "You want search and the site handled by one team.",
      "You can stay with the work long enough for it to compound.",
    ],
    notFit: [
      "You want a guaranteed ranking position.",
      "You need ads managed this month and nothing else. Paid media is a later phase.",
    ],
    faqs: [
      {
        q: "Do you guarantee first place on Google?",
        a: "No. We fix structure, relevance and measurement. Rankings are an outcome, not a line item.",
      },
      {
        q: "What is AI search in this offer?",
        a: "Making your pages easy for answer engines to quote: clear services, proof and facts, without spammy markup.",
      },
      {
        q: "Is this a one-off audit?",
        a: "An audit can start the work. The offer itself is ongoing, because search decays when nobody tends it.",
      },
    ],
  },
  {
    slug: "ai",
    group: "AI",
    title: "AI integration",
    navLabel: "AI Integration",
    interest: "ai",
    summary:
      "Assistants and workflows trained on your material and wired into tools you already use.",
    promise:
      "AI that answers from your knowledge, hands off to a person, and has an owner.",
    facts: [
      { label: "Shape", value: "One use case" },
      { label: "Source", value: "Your content" },
      { label: "Quote", value: "Per build" },
    ],
    includes: [
      { title: "Use-case cut", body: "One job for the system, written as success and failure, before any prompt." },
      { title: "Knowledge setup", body: "The documents, pages or FAQs the assistant is allowed to use." },
      { title: "A single workflow", body: "Qualify a lead, answer a policy, or draft a reply. Not ten bots." },
      { title: "Human handoff", body: "A clear path to a person when the system should stop." },
      { title: "A simple log", body: "You can see what it said and correct it." },
      { title: "Launch notes", body: "What it will not do, and who updates the source material." },
    ],
    fit: [
      "You have repeated questions or a workflow a person does the same way every day.",
      "You can provide source material and someone to review the first weeks.",
      "You want the system inside your business, not a demo on the side.",
    ],
    notFit: [
      "You want a chatbot with no source material and no owner.",
      "You need a promise that the model will never be wrong.",
    ],
    faqs: [
      {
        q: "Will the assistant invent answers?",
        a: "It can. We limit it to your sources, tell it to refuse when it does not know, and log the replies so you can correct them.",
      },
      {
        q: "Do you build phone reception too?",
        a: "Not in this first release of the studio site. The current offer is on-site and workflow AI. Voice can be scoped later as its own project.",
      },
      {
        q: "Who owns the prompts and the data?",
        a: "You do. We document the setup so it is not locked to one person's laptop.",
      },
    ],
  },
]

export function getService(slug: string) {
  return services.find((service) => service.slug === slug)
}
