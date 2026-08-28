"use client";

import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useId,
  useCallback,
} from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Option {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  labelClassName?: string;
  error?: string;
  options: Option[];
  placeholder?: string;
  containerClassName?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLSelectElement> & { target: { value: string } },
  ) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      labelClassName,
      error,
      options,
      placeholder = "Select an option",
      className = "",
      containerClassName = "",
      id,
      value,
      onChange,
      disabled
    },
    ref
  ) => {
    const uid = useId();
    const rootId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const buttonId = rootId || `${uid}-select`;

    const [open, setOpen] = useState(false);
    const [internalValue, setInternalValue] = useState<string>("");

    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const isControlled = value !== undefined;
    const selectedValue = isControlled ? value : internalValue;

    useEffect(() => {
      if (isControlled) setInternalValue(value);
    }, [isControlled, value]);

    const selectedOption = options.find((o) => o.value === selectedValue);

    const emitChange = useCallback(
      (nextValue: string) => {
        if (!isControlled) setInternalValue(nextValue);
        onChange?.({
          target: { value: nextValue },
          currentTarget: { value: nextValue },
        } as React.ChangeEvent<HTMLSelectElement> & {
          target: { value: string };
        });
      },
      [isControlled, onChange]
    );

    const close = useCallback(() => {
      setOpen(false);
    }, []);

    useEffect(() => {
      const handlePointerDown = (event: MouseEvent | TouchEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          close();
        }
      };
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") close();
      };
      document.addEventListener("mousedown", handlePointerDown);
      document.addEventListener("touchstart", handlePointerDown);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("mousedown", handlePointerDown);
        document.removeEventListener("touchstart", handlePointerDown);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [close]);

    const handleTriggerKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (!open) {
          setOpen(true);
        }
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (!open) {
          setOpen(true);
        }
      }
    };

    const selectOption = (opt: Option) => {
      emitChange(opt.value);
      close();
    };

    return (
      <div className={`flex flex-col w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={buttonId}
            className={cn(
              "text-primary text-[16px] md:text-[20px] font-[500] font-inter mb-2 tracking-wide",
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        <div ref={containerRef} className="relative flex items-center w-full">
          <button
            type="button"
            id={buttonId}
            ref={ref as React.Ref<HTMLButtonElement>}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-labelledby={label ? undefined : buttonId}
            disabled={disabled}
            onClick={() => setOpen((o) => !o)}
            onKeyDown={handleTriggerKeyDown}
            onBlur={() => close()}
            className={`flex items-center w-full h-[52px] px-4 pr-11 overflow-hidden rounded-[8px] bg-transparent text-[#E5E4E2] font-inter text-[16px] border border-gold-deep transition-all duration-200 outline-none cursor-pointer text-left ${error
                ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                : open
                  ? "border-[#C5A059] ring-1 ring-[#C5A059]/30"
                  : "border-[#453823]/80 hover:border-[#C5A059]/60 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/30"
              } ${className}`}
          >
            <span
              className={`truncate ${selectedOption
                  ? "text-[#E5E4E2]"
                  : "text-muted placeholder:font-[400] text-[#6D6D6D]"
                }`}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </button>

          <div
            className={`absolute right-3.5 flex items-center pointer-events-none text-[#C5A059] transition-transform duration-200 ${open ? "rotate-180" : ""
              }`}
          >
            <ChevronDown className="w-5 h-5" />
          </div>

          {/* Dropdown */}
          {open && (
            <ul
              ref={listRef}
              role="listbox"
              className="absolute top-full left-0 right-0 z-30 mt-2 max-h-60 overflow-auto rounded-[8px] bg-[#141414] border border-gold-deep shadow-[0_12px_40px_rgba(0,0,0,0.6)] py-1.5 custom-scroll"
              style={{ animation: "dropFade 0.15s ease-out" }}
            >
              {options.map((option) => {
                const isSelected = option.value === selectedValue;
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    id={`${buttonId}-opt-${option.value}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectOption(option)}
                    className={`flex items-center justify-between gap-3 px-4 py-2.5 text-[12px] md:text-[16px] font-inter cursor-pointer transition-colors duration-150 ${isSelected
                        ? "bg-[#C5A059] text-[#0D0D0D] font-[600]"
                        : "text-[#E5E4E2] hover:bg-[#2A2417]"
                      }`}
                  >
                    <span>{option.label}</span>
                    {isSelected && <Check className="w-4 h-4 shrink-0" />}
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
);

Select.displayName = "Select";

export default Select;
