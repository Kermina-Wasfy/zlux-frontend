interface BookingReferenceCardProps {
  reference?: string;
  className?: string;
}

export default function BookingReferenceCard({
  reference = "APX-L9AG-7728",
  className = "",
}: BookingReferenceCardProps) {
  return (
    <div
      className={`max-w-[750px] w-full bg-[#151515] border border-gold-deep py-5 px-6 text-center flex flex-col items-center justify-center ${className}`}
     >
      <span className="text-[14px] md:text-[16px] text-primary font-inter font-[500] tracking-wider mb-2">
        Booking Reference
      </span>
      <span className="text-[32px] md:text-[48px] font-[700] text-primary font-inter tracking-wider leading-none">
        {reference}
      </span>
    </div>
  );
}
