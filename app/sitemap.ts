import type { MetadataRoute } from "next";
import { brand } from "@/content/brand";
import { projects } from "@/content/projects";
import { services } from "@/content/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/services",
    ...services.map((service) => `/services/${service.slug}`),
    "/portfolio",
    ...projects.map((project) => `/portfolio/${project.slug}`),
    "/about",
    "/contact",
    "/policies",
  ];

  return paths.map((path) => ({
    url: new URL(path, brand.siteUrl).toString(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
