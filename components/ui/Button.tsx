import React from "react";
import Link from "next/link";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export default function Button({
  href,
  children,
  className = "",
  onClick,
  type = "button",
  disabled,
  ...rest
}: ButtonProps) {
  const baseStyles =
    "hover:text-primary border border-transparent hover:border hover:border-gold-deep hover:[background:#151515] inline-flex items-center justify-center rounded-[8px] bg-gradient-primary text-dark-card font-inter font-[600] transition-all duration-300";

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseStyles} ${className}`}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        target={rest.target}
        rel={rest.rel}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${className}`}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      {...rest}
    >
      {children}
    </button>
  );
}
