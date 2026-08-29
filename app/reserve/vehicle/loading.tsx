import { Skeleton } from "@/components/ui/skeleton";
import VehicleCardSkeleton from "@/components/general/Skeletons/VehicleCardSkeleton";

export default function Loading() {
  return (
    <section className="w-full pb-12 pt-4 bg-[#0D0D0D]">
      <div className="container mx-auto">
        <div className="mb-8 md:mb-10">
          <Skeleton className="h-[24px] md:h-[40px] w-56 md:w-80 mb-3" />
          <Skeleton className="h-[14px] md:h-[20px] w-80 md:w-[600px]" />
        </div>
        <div className="flex flex-col gap-4 md:gap-8 md:px-12">
          <VehicleCardSkeleton />
          <VehicleCardSkeleton />
          <VehicleCardSkeleton />
        </div>
      </div>
    </section>
  );
}