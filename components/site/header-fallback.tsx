import Link from "next/link";
import { brand } from "@/content/brand";

export function HeaderFallback() {
  return (
    <header className="site-header" data-theme="dark">
      <div className="container-x flex w-full items-center justify-between">
        <Link href="/" className="wordmark">
          {brand.name}
        </Link>
        <Link href="/contact" className="btn" data-variant="light" data-size="md">
          <span className="btn__label">Let&apos;s talk</span>
        </Link>
      </div>
    </header>
  );
}
