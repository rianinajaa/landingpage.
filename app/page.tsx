import type { Metadata } from "next";
import { HomePage } from "@/components/site/home-page";
import { brand } from "@/content/brand";

export const metadata: Metadata = {
  title: { absolute: `${brand.name} | Design, development and AI` },
  description: brand.description,
};

export default function Page() {
  return <HomePage />;
}
