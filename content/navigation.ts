import { services } from "./services"

export const headerNav = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
] as const

export const footerNav = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

export const serviceNav = services.map((service) => ({
  href: `/services/${service.slug}`,
  label: service.navLabel,
  group: service.group,
  summary: service.summary,
}))

export const serviceGroups = ["Design", "Development", "Growth", "AI"] as const
