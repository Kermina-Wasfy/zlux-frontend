"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export interface StepItem {
    id: number;
    label: string;
}

const DEFAULT_STEPS: StepItem[] = [
    { id: 1, label: "Trip Details" },
    { id: 2, label: "Select Vehicle" },
    { id: 3, label: "Checkout" },
];

interface TabsProps {
    currentStep?: number;
    steps?: StepItem[];
    backHref?: string;
    backLabel?: string;
}

export default function Tabs({
    currentStep = 1,
    steps = DEFAULT_STEPS,
    backHref = "/",
    backLabel = "Back To Home",
}: TabsProps) {
    return (
        <div>
            <div className="container mx-auto md:pt-8">
                <div className="relative flex flex-col gap-6 pt-6 pb-10">
                <div className="absolute left-0 right-0 bottom-0 h-[1px] [background:linear-gradient(to_right,#775A19,#F8E387,#775A19)]" />
                    {/* Back link */}
                    <div className="w-full flex justify-start">
                        <Link
                            href={backHref}
                            className="inline-flex items-center gap-2.5 text-muted-gray font-inter text-[12px] md:text-[20px] font-[600] transition-colors group"
                        >
                            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1 text-gold-deep" />
                            <span>{backLabel}</span>
                        </Link>
                    </div>

                    {/* Stepper Progress Bar */}
                    <div className="w-full flex items-center justify-center md:px-8">
                        <div className="w-full flex items-center justify-between ">
                            {steps.map((step, index) => {
                                const isActive = step.id === currentStep;
                                const isCompleted = step.id < currentStep;

                                return (
                                    <React.Fragment key={step.id}>
                                        {/* Step Node */}
                                        <div className="flex flex-col items-center select-none cursor-default">
                                            {/* Step Circle */}
                                            <div
                                                className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[16px] md:text-[20px] font-[600] font-inter transition-all duration-300 ${isActive
                                                        ? "bg-primary text-[#0D0D0D] "
                                                        : isCompleted
                                                            ? "bg-primary text-[#0D0D0D]"
                                                            : "bg-transparent border border-gold-deep text-gold-deep "
                                                    }`}
                                            >
                                                {step.id}
                                            </div>

                                            {/* Step Label */}
                                            <span
                                                className={`mt-2.5 text-[14px] md:text-[20px] font-inter font-[600] tracking-wide transition-colors duration-200 whitespace-nowrap ${isActive
                                                        ? "text-primary"
                                                        : isCompleted
                                                            ? "text-primary"
                                                            : "text-muted-gray"
                                                    }`}
                                            >
                                                {step.label}
                                            </span>
                                        </div>

                                        {/* Connecting line between steps */}
                                        {index < steps.length - 1 && (
                                            <div className="flex-1 h-[1px] mx-2 md:mx-6 mb-6 bg-gold-deep transition-colors duration-300 relative">
                                                {isCompleted && (
                                                    <div className="absolute inset-0 bg-gold-deep" />
                                                )}
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
