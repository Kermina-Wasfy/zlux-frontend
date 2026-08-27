"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Clock } from "lucide-react";

export interface TimePickerProps {
  label?: string;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  containerClassName?: string;
  className?: string;
}

function to24h(hour: number, minute: number): string {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function to12h(hour24: number, minute: number): string {
  const period = hour24 < 12 ? "AM" : "PM";
  const h = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${h}:${String(minute).padStart(2, "0")} ${period}`;
}

function generateTimes(): { value: string; label: string }[] {
  const times: { value: string; label: string }[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      times.push({ value: to24h(h, m), label: to12h(h, m) });
    }
  }
  return times;
}

export default function TimePicker({
  label,
  error,
  value,
  onChange,
  placeholder = "--:--",
  containerClassName = "",
  className = "",
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const times = useMemo(() => generateTimes(), []);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

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

  const selectedIndex = value
    ? times.findIndex((t) => t.value === value)
    : -1;

  useEffect(() => {
    if (open && selectedIndex >= 0 && listRef.current) {
      const el = listRef.current.children[selectedIndex] as HTMLElement | undefined;
      if (el) el.scrollIntoView({ block: "nearest" });
    }
  }, [open, selectedIndex]);

  const selectTime = (v: string) => {
    onChange?.(v);
    setOpen(false);
  };

  const scrollToIndex = (idx: number) => {
    const next = Math.max(0, Math.min(times.length - 1, idx));
    if (listRef.current?.children[next]) {
      (listRef.current.children[next] as HTMLElement).scrollIntoView({
        block: "nearest",
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!open) {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      scrollToIndex(selectedIndex >= 0 ? selectedIndex + 1 : 0);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      scrollToIndex(selectedIndex >= 0 ? selectedIndex - 1 : 0);
    } else if (event.key === "Enter") {
      event.preventDefault();
      selectTime(times[selectedIndex >= 0 ? selectedIndex : 0].value);
    }
  };

  const selectedTime = selectedIndex >= 0 ? times[selectedIndex] : undefined;

  return (
    <div className={`flex flex-col w-full ${containerClassName}`}>
      {label && (
        <label className="text-primary text-[16px] md:text-[20px] font-[500] font-inter mb-2 tracking-wide">
          {label}
        </label>
      )}
      <div ref={containerRef} className="relative flex items-center w-full">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          onKeyDown={handleKeyDown}
          className={`w-full h-[52px] px-4 pr-11 rounded-[8px] bg-[#0D0D0D] text-[#E5E4E2] font-inter text-[12px] md:text-[16px] border border-gold-deep transition-all duration-200 outline-none cursor-pointer text-left ${
            error
              ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
              : open
                ? "border-[#C5A059] ring-1 ring-[#C5A059]/30"
                : "border-[#453823]/80 hover:border-[#C5A059]/60 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/30"
          } ${className}`}
        >
          <span className={`${selectedTime ? "" : "text-[#6D6D6D]"} text-[12px] md:text-[16px]`}>
            {selectedTime ? selectedTime.label : placeholder}
          </span>
        </button>

        <div className="absolute right-3.5 flex items-center pointer-events-none text-[#8C8273]">
          <Clock className="w-5 h-5" />
        </div>

        {open && (
          <ul
            ref={listRef}
            className="absolute top-full left-0 right-0 z-30 mt-2 max-h-64 overflow-auto rounded-[8px] bg-[#141414] border border-gold-deep shadow-[0_12px_40px_rgba(0,0,0,0.6)] py-1.5 custom-scroll"
            style={{ animation: "dropFade 0.15s ease-out" }}
          >
            {times.map((t) => {
              const isSelected = t.value === value;
              return (
                <li
                  key={t.value}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectTime(t.value)}
                  className={`px-4 py-2.5 text-[12px] md:text-[16px] font-inter cursor-pointer transition-colors duration-150 ${
                    isSelected
                      ? "bg-[#C5A059] text-[#0D0D0D] font-[600]"
                      : "text-[#E5E4E2] hover:bg-[#2A2417]"
                  }`}
                >
                  {t.label}
                </li>
              );
            })}
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
