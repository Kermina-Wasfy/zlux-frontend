export interface NextStepItem {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
}

const DEFAULT_STEPS: NextStepItem[] = [
  {
    id: "confirmation-email",
    stepNumber: "01",
    title: "Confirmation Email",
    description:
      "You'll Receive A Detailed Confirmation At Your Email Address Within 5 Minutes.",
  },
  {
    id: "driver-assignment",
    stepNumber: "02",
    title: "Driver Assignment",
    description:
      "Your Dedicated Chauffeur Will Be Assigned 24 Hours Before Pickup.",
  },
  {
    id: "day-of-contact",
    stepNumber: "03",
    title: "Day-Of Contact",
    description:
      "Your Driver Will Call 2 Hours Before Pickup With Their Name, Photo, And Vehicle Details.",
  },
  {
    id: "meet-and-greet",
    stepNumber: "04",
    title: "Meet & Greet",
    description:
      "For Airports, Your Driver Will Meet You At Baggage Claim With A Name Sign.",
  },
];

interface WhatHappensNextProps {
  steps?: NextStepItem[];
  className?: string;
}

export default function WhatHappensNext({
  steps = DEFAULT_STEPS,
  className = "",
}: WhatHappensNextProps) {
  return (
    <div
      className={`max-w-[750px] w-full bg-[#151515] border border-gold-deep p-6 md:p-8 flex flex-col ${className}`}
    >
      <h3 className="text-[20px] md:text-[32px] font-[600] text-primary font-montserrat tracking-tight mb-4">
        What Happens Next
      </h3>

      {/* Steps List */}
      <div className="space-y-6 md:space-y-10">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center gap-4 md:gap-10">
            {/* Step Number */}
            <span className="text-primary font-inter font-[700] text-[20px] md:text-[24px] shrink-0 min-w-[28px] leading-tight">
              {step.stepNumber}
            </span>

            {/* Step Content */}
            <div className="flex flex-col">
              <h4 className="text-[#E5E4E2] font-inter font-[700] text-[16px] md:text-[24px] leading-tight">
                {step.title}
              </h4>
              <p className="text-[#91918F] font-inter font-[500] text-[14px] md:text-[16px] mt-1 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
