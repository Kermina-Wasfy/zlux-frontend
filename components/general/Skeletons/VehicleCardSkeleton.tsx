import { Skeleton } from "@/components/ui/skeleton";

export default function VehicleCardSkeleton() {
  return (
    <div className="w-full border border-gold-deep bg-[#151515] flex flex-row items-stretch justify-between gap-4 select-none">
      <div className="p-3 sm:p-5 flex items-stretch gap-3 sm:gap-8 flex-1 min-w-0">
        <div className="flex-shrink-0 self-stretch">
          <Skeleton className="w-[110px] sm:w-[160px] md:w-[190px] h-[120px] sm:h-[150px]" />
        </div>
        <div className="flex flex-col justify-center flex-1 min-w-0 gap-2 sm:gap-3">
          <Skeleton className="h-[14px] sm:h-[24px] w-3/5 max-w-[260px]" />
          <Skeleton className="h-[12px] sm:h-[16px] w-full max-w-[340px]" />
          <Skeleton className="h-[12px] sm:h-[16px] w-2/3 max-w-[260px] hidden sm:block" />
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 mt-1">
            <Skeleton className="h-[12px] sm:h-[16px] w-[80px] sm:w-[110px]" />
            <Skeleton className="h-[12px] sm:h-[16px] w-[60px] sm:w-[90px]" />
            <Skeleton className="h-[12px] sm:h-[16px] w-[70px] sm:w-[100px]" />
          </div>
        </div>
      </div>
      <div className="border-l border-gold-deep flex items-center">
        <div className="p-3 sm:p-5 flex flex-col items-center justify-center min-w-[100px] sm:min-w-[120px] md:min-w-[140px] gap-2">
          <Skeleton className="h-[22px] sm:h-[32px] w-[60px] sm:w-[90px]" />
          <Skeleton className="h-[12px] w-[60px] sm:w-[70px]" />
          <Skeleton className="w-[18px] h-[18px] md:w-[24px] md:h-[24px] rounded-full" />
        </div>
      </div>
    </div>
  );
}