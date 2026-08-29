import { Info } from "lucide-react";

export default function SideNote() {
  return (
    <div className="w-full bg-[#151515] py-4 px-8 border border-gold-deep flex items-start gap-3 select-none mt-10">
      <div className="text-gold-deep mt-0.5 shrink-0">
        <Info className="w-5 h-5" />
      </div>
      <p className="text-silver/80 font-inter text-[12px] md:text-[14px] leading-relaxed">
        Free Cancellation Up To 24 Hours Before Pickup. Driver Info Sent Via Email 2 Hours Prior.
      </p>
    </div>
  );
}
