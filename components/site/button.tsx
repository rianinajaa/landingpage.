import Link from "next/link";

type Variant = "light" | "ink" | "on-accent" | "outline" | "outline-light" | "accent";

type Props = {
  children: React.ReactNode;
  href?: string;
  variant?: Variant;
  size?: "md" | "lg";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
};

function ArrowIcon() {
  return (
    <svg viewBox="0 0 12 12" className="size-3" fill="none" aria-hidden="true">
      <path d="M3 1.5h7.5V9M10.5 1.5 1.5 10.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function Button({
  children,
  href,
  variant = "light",
  size = "md",
  type = "button",
  disabled,
  className,
}: Props) {
  const classNames = ["btn", className].filter(Boolean).join(" ");
  const inner = (
    <>
      <span className="btn__fill" aria-hidden="true" />
      <span className="btn__label">{children}</span>
      <span className="btn__chip" aria-hidden="true">
        <ArrowIcon />
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classNames} data-variant={variant} data-size={size} data-icon="true">
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} className={classNames} data-variant={variant} data-size={size} data-icon="true" disabled={disabled}>
      {inner}
    </button>
  );
}
