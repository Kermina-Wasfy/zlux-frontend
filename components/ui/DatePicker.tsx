"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export interface DatePickerProps {
  label?: string;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  containerClassName?: string;
  className?: string;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function toDateOnly(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function DatePicker({
  label,
  error,
  value,
  onChange,
  placeholder = "MM/DD/YYYY",
  containerClassName = "",
  className = "",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const d = new Date(`${value}T00:00:00`);
      if (!Number.isNaN(d.getTime())) return d;
    }
    return new Date();
  });

  const containerRef = useRef<HTMLDivElement>(null);

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

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const selectedValue = value || "";
  const selectedDate = selectedValue
    ? new Date(`${selectedValue}T00:00:00`)
    : null;

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const monthLabel = viewDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const displayed = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      })
    : "";

  const selectDay = (day: number) => {
    onChange?.(toDateOnly(new Date(year, month, day)));
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
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen((o) => !o);
            }
          }}
          className={`flex items-center w-full h-[52px] px-4 pr-11 overflow-hidden rounded-[8px] bg-[#0D0D0D] text-[#E5E4E2] font-inter text-[16px] border border-gold-deep transition-all duration-200 outline-none cursor-pointer text-left ${
            error
              ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
              : open
                ? "border-[#C5A059] ring-1 ring-[#C5A059]/30"
                : "border-[#453823]/80 hover:border-[#C5A059]/60 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/30"
          } ${className}`}
        >
          <span className={`truncate ${displayed ? "" : "text-[#6D6D6D]"} text-[16px]`}>
            {displayed || placeholder}
          </span>
        </button>

        <div className="absolute right-3.5 flex items-center pointer-events-none text-[#8C8273]">
          <Calendar className="w-5 h-5" />
        </div>

        {open && (
          <div
            className="absolute top-full left-0 z-30 mt-2 min-w-[320px] max-w-[calc(100vw-2rem)] xl:right-0 rounded-[8px] bg-[#141414] border border-gold-deep shadow-[0_12px_40px_rgba(0,0,0,0.6)] p-4"
            style={{ animation: "dropFade 0.15s ease-out" }}
          >
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={prevMonth}
                className="text-[#C5A059] hover:text-[#F8E387] transition-colors p-1"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-[#E5E4E2] font-inter text-[15px] font-[600]">
                {monthLabel}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="text-[#C5A059] hover:text-[#F8E387] transition-colors p-1"
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
              {WEEKDAYS.map((w) => (
                <span
                  key={w}
                  className="text-center text-[11px] text-[#91918F] font-inter font-[600] py-1"
                >
                  {w}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (day === null) return <span key={`empty-${i}`} />;
                const d = new Date(year, month, day);
                const dateStr = toDateOnly(d);
                const isSelected = selectedValue === dateStr;
                const isToday = dateStr === toDateOnly(today);
                const isPast = dateStr < toDateOnly(today);

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => selectDay(day)}
                    disabled={isPast}
                    className={`h-9 w-full rounded-[6px] text-[13px] font-inter transition-colors duration-150 ${
                      isSelected
                        ? "bg-[#C5A059] text-[#0D0D0D] font-[600]"
                        : isPast
                          ? "text-[#4A4A48] cursor-not-allowed"
                          : isToday
                            ? "text-[#C5A059] font-[600] hover:bg-[#2A2417]"
                            : "text-[#E5E4E2] hover:bg-[#2A2417]"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
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
