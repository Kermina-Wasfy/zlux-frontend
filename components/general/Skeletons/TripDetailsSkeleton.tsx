import { Skeleton } from "@/components/ui/skeleton";

export default function TripDetailsSkeleton() {
  return (
    <section className="w-full pb-12 pt-4 bg-[#0D0D0D]">
      <div className="container mx-auto">
        <div className="mb-8 md:mb-10">
          <Skeleton className="h-[24px] md:h-[40px] w-40 md:w-64 mb-3" />
          <Skeleton className="h-[14px] md:h-[20px] w-64 md:w-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 xl:col-span-7 flex md:px-5">
            <div className="space-y-6 flex flex-col w-full">
              <div className="grid grid-cols-2 gap-5">
                <Skeleton className="h-[52px]" />
                <Skeleton className="h-[52px]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Skeleton className="h-[52px]" />
                <Skeleton className="h-[52px]" />
                <Skeleton className="h-[52px]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Skeleton className="h-[116px]" />
                <Skeleton className="h-[116px]" />
              </div>
              <Skeleton className="h-[52px] w-full" />
            </div>
          </div>
          <div className="lg:col-span-6 xl:col-span-5 hidden md:flex">
            <div className="w-full h-[420px] lg:h-full min-h-[420px]">
              <Skeleton className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}