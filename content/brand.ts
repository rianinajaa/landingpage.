export const brand = {
  name: "Northline",
  legalName: "Northline Studio",
  tagline: "Design. Build. Grow.",
  eyebrow: "Digital design and growth studio",
  description:
    "Northline designs and builds websites, product interfaces and AI systems for businesses that want to look trusted and bring in better clients.",
  email: "hello@northline.studio",
  city: "Remote",
  availability: "available" as const,
  locale: "en",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  responseWindow: "12 hours",
  stats: [
    { label: "Projects delivered", value: "Selected" },
    { label: "Disciplines", value: "4" },
    { label: "Response time", value: "12h" },
  ],
  trustLine: "Working with founders and teams across time zones.",
  showreel: null as null | { poster: string; src: string; duration: string },
  copyrightYear: 2026,
}

export const principles = [
  {
    title: "Custom and human-crafted",
    body: "Layouts, interactions and lines of copy are made for your buyer. Nothing is pulled from a theme.",
  },
  {
    title: "Modern and premium",
    body: "Quiet type, tight spacing and a finish that still feels right after the trend cycle moves on.",
  },
  {
    title: "Built to grow",
    body: "Speed, structure and the next step for a visitor are part of the design, not a later pass.",
  },
  {
    title: "Direct communication",
    body: "You talk to the people doing the work. Decisions stay short, and so does the path to an answer.",
  },
]

export const offerings = [
  "Presentation websites",
  "Landing pages",
  "Corporate websites",
  "Online stores",
  "Personal brand sites",
  "Web apps and dashboards",
  "SaaS platforms",
  "AI assistants",
  "Custom platforms",
]

export const processSteps = [
  {
    title: "Strategy",
    body: "We learn the offer, the buyer and the result the project has to produce.",
  },
  {
    title: "Build",
    body: "We design and develop around clarity, speed and a path a visitor can follow.",
  },
  {
    title: "Launch",
    body: "We go live with the structure, the journey and the tracking foundations in place.",
  },
  {
    title: "Grow",
    body: "We keep improving what the site earns, with tighter pages and cleaner measurement.",
  },
]

export const toolGroups = [
  { label: "Design", items: ["Figma", "Framer"] },
  {
    label: "Development",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Supabase", "Vercel"],
  },
  { label: "Platforms", items: ["WordPress", "Webflow", "Shopify"] },
  { label: "AI and automation", items: ["OpenAI", "Claude", "n8n"] },
  { label: "Growth", items: ["Google Analytics", "Search Console", "Google Ads"] },
]

export const logoRows = [
  {
    label: "Clients",
    names: ["Practice", "Studio", "Product team", "Local service", "Specialist firm"],
  },
  {
    label: "Partners",
    names: ["Figma", "Next.js", "Vercel", "Shopify"],
  },
]

export const contactSteps = [
  {
    title: "We read your message",
    body: "Your note goes to the people who would do the work, not to a sales script.",
  },
  {
    title: "A short discovery call",
    body: "We talk through the goal, the audience and the timing so the scope is real.",
  },
  {
    title: "A clear proposal",
    body: "You get the scope, the price and the schedule in writing before anything starts.",
  },
]

export const contactFaqs = [
  {
    q: "How much does a website cost?",
    a: "Each project is scoped on its own. After a short call you get a fixed price and a list of what is included.",
  },
  {
    q: "How long does a project take?",
    a: "A landing page moves faster than a product platform. The proposal includes milestones and dates before kickoff.",
  },
  {
    q: "Do you work with clients outside your city?",
    a: "Yes. Calls, reviews and delivery happen online. The studio is set up to work across time zones.",
  },
  {
    q: "Do you offer support after launch?",
    a: "Yes. Maintenance, small improvements and measurement can continue after the site is live.",
  },
]

export const serviceFaqs = [
  {
    q: "Can we hire you for one discipline?",
    a: "Yes. Most work starts with one: design, development, growth or an AI build. You are not required to bundle them.",
  },
  {
    q: "How does pricing work?",
    a: "Design and development are fixed quotes after discovery. Growth is a retainer. AI is quoted per use case. Prices are not listed because the scope changes the number.",
  },
  {
    q: "Who does the work?",
    a: "You talk to the people designing and building. There is no account layer in between.",
  },
]
