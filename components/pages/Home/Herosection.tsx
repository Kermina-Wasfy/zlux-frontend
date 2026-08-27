import React from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";

export default function Herosection() {
  return (
    <section className="relative z-0 md:min-h-screen h-[500px] w-full flex flex-col justify-between overflow-hidden bg-[#0D0D0D]">
      {/* Background Image with Overlays */}
      <div className="absolute inset-0 w-full h-full z-[-1] select-none">
        <Image
          src="/herosectionBg.jpg"
          alt="Luxury Chauffeur Service"
          fill
          priority
          quality={90}
          className="object-cover object-center scale-100"
        />
        {/* Subtle dark gradient overlay for text readability while preserving the car and mansion */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/75 via-[#0D0D0D]/35 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      {/* Main Hero Content */}
      <div className="container mx-auto flex-1 flex flex-col justify-center">
        <div className=" flex flex-col items-start gap-3">
          {/* Tagline / Overline */}
          <span className="text-[14px] md:text-[24px] font-[700]  uppercase text-platinum font-montserrat">
            Premium Private Chauffeur Service
          </span>

          {/* Main Headline */}
          <h1 className="md:text-[60px] text-[20px] font-[700] text-platinum font-montserrat leading-[0.9] md:mt-4 md:mb-6 mt-2 mb-4">
            Elevate Your{" "}
            <span className="text-primary">
              Journey
            </span>{" "}
            in Ultimate{" "}
            <span className="text-primary">
              Luxury
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-[12px] md:text-[20px] text-silver font-montserrat font-[700] md:leading-6 leading-4 max-w-3xl">
            Experience Seamless, Punctual, And Executive Transportation Across
            The US. Your Premium Ride Is Just A Click Away.
          </p>

          {/* Action CTA Button */}
          <div className="pt-12 md:pt-20">
            <Button
              href="#reserve"
              className="px-8 py-2 text-[16px] md:text-[20px] hover:shadow-[0_4px_25px_rgba(197,160,89,0.35)]"
            >
              Reserve Now
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom spacer for balance */}
      {/* <div className="h-8 sm:h-12 w-full pointer-events-none" /> */}
    </section>
  );
}
