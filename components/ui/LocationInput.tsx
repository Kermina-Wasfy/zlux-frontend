"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { LOCATION_SUGGESTIONS, LocationSuggestion } from "@/shared/Locations";

interface LocationInputProps {
  label?: string;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  containerClassName?: string;
}

export default function LocationInput({
  label,
  error,
  value = "",
  onChange,
  placeholder = "Address, Airport , Or Hotel",
  containerClassName = "",
}: LocationInputProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const term = value.trim().toLowerCase();
  const suggestions = term
    ? LOCATION_SUGGESTIONS.filter(
        (s) =>
          s.label.toLowerCase().includes(term) ||
          s.subtitle.toLowerCase().includes(term)
      ).slice(0, 6)
    : [];

  const showDropdown = open && suggestions.length > 0;

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const select = (s: LocationSuggestion) => {
    onChange?.(s.label);
    setOpen(false);
  };

  return (
    <div className={`flex flex-col w-full ${containerClassName}`}>
      {label && (
        <label className="text-primary text-[16px] md:text-[20px] font-[500] font-inter mb-2 tracking-wide">
          {label}
        </label>
      )}
      <div ref={containerRef} className="relative flex items-center w-full">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange?.(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full h-[52px] px-4 pr-10 overflow-hidden text-ellipsis whitespace-nowrap rounded-[8px] bg-[#0D0D0D] text-[#E5E4E2] font-inter text-[16px] placeholder:text-[#6D6D6D] placeholder:font-inter placeholder:text-[16px] placeholder:overflow-hidden placeholder:text-ellipsis border border-gold-deep transition-all duration-200 outline-none ${
            error
              ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
              : "border-[#453823]/80 hover:border-[#C5A059]/60 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/30"
          }`}
        />
        {/* <div className="absolute right-3.5 flex items-center pointer-events-none text-[#8C8273]">
          <MapPin className="w-5 h-5" />
        </div> */}

        {showDropdown && (
          <ul
            className="absolute top-full left-0 right-0 z-30 mt-2 rounded-[8px] bg-[#141414] border border-gold-deep shadow-[0_12px_40px_rgba(0,0,0,0.6)] py-1.5 custom-scroll overflow-auto max-h-64"
            style={{ animation: "dropFade 0.15s ease-out" }}
          >
            {suggestions.map((s) => (
              <li
                key={s.id}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(s)}
                className="flex flex-col gap-0.5 px-4 py-2 cursor-pointer transition-colors duration-150 hover:bg-[#C5A059] group"
              >
                <span className="text-[#E5E4E2] group-hover:text-[#0D0D0D] text-[14px] font-inter font-[500] truncate">
                  {s.label}
                </span>
                <span className="text-[#91918F] group-hover:text-[#0D0D0D]/70 text-[12px] font-inter truncate">
                  {s.subtitle}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && (
        <span className="text-red-400 text-[12px] mt-1.5 font-inter transition-opacity animate-in fade-in duration-150">
          {error}
        </span>
      )}
    </div>
  );
}
