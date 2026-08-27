import React from "react";
import Link from "next/link";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  target?: string;
  rel?: string;
};

export default function Button({ href, children, className = "", onClick, ...rest }: ButtonProps) {
  const baseStyles =
    "hover:shadow-[0_4px_25px_rgba(197,160,89,0.35)] inline-flex items-center justify-center rounded-[8px] bg-gradient-primary text-dark-card font-inter font-[600] transition-all duration-300 hover:brightness-110 active:scale-[0.98]";

  if (href) {
    return (
      <Link href={href} className={`${baseStyles} ${className}`} onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>} target={rest.target} rel={rest.rel}>
        {children}
      </Link>
    );
  }

  return (
    <button className={`${baseStyles} ${className}`} onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}>
      {children}
    </button>
  );
}
