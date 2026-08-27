"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/shared/NavLinks";
import Button from "@/components/ui/Button";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isLinkActive = (link: { href: string }) => {
    if (link.href === "/") return pathname === "/";
    return pathname === "/" && (link.href === "#fleet" || link.href === "#services");
  };

  return (
    <header className="w-full z-50 py-5 md:py-5 sticky top-0 bg-[#0D0D0D]">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Desktop Logo */}
          <Link href="/" className="hidden md:flex items-center gap-2 group transition-opacity hover:opacity-90">
            <Image
              src="/logo.svg"
              alt="ZLUX Logo"
              width={183}
              height={60}
              priority
              className="h-10 lg:h-12 w-auto object-contain"
            />
          </Link>

          {/* Mobile Logo */}
          <Link href="/" className="flex md:hidden items-center transition-opacity hover:opacity-90">
            <Image
              src="/logoMobile.svg"
              alt="ZLUX Logo"
              width={40}
              height={40}
              priority
              className="h-12 w-12 object-contain"
            />
          </Link>

          {/* Desktop Navigation & Action Button */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            <nav className="flex items-center gap-8 lg:gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`font-inter  transition-all duration-200 ${
                    isLinkActive(link)
                      ? "text-primary font-[600] md:text-[20px] text-[18px] "
                      : "text-muted hover:text-primary font-[500] md:text-[16px] text-[14px]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Button
              href="/reserve"
              className="px-6 py-2 text-[18px] md:text-[20px] shadow-[0_2px_15px_rgba(197,160,89,0.25)]"
            >
              Reserve Now
            </Button>
          </div>

          {/* Mobile Burger Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-1.5 rounded-lg text-[#C5A059] hover:bg-white/5 transition-colors focus:outline-none"
          >
            <Image
              src="/burgerMenu.svg"
              alt="Toggle Menu"
              width={35}
              height={35}
              className="w-10 h-10 object-contain"
            />
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed left-0 right-0 top-16 bottom-0 p-5 mt-5 rounded-b-2xl bg-[#0D0D0D]/95 border border-[#C5A059]/30 backdrop-blur-xl shadow-2xl transition-all animate-in fade-in slide-in-from-top-2 z-50">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 px-3 rounded-[8px] font-inter transition-colors ${
                    isLinkActive(link)
                      ? "text-primary font-[600] md:text-[20px] text-[18px]"
                      : "text-muted hover:text-primary font-[500] md:text-[16px] text-[14px]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2">
                <Button
                  href="/reserve"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-[18px] md:text-[20px] duration-300 shadow-md hover:brightness-105 active:scale-95"
                >
                  Reserve Now
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
