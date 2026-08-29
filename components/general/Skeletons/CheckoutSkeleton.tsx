import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutSkeleton() {
  return (
    <section className="w-full pb-16 pt-4 bg-[#0D0D0D]">
      <div className="container mx-auto">
        <div className="mb-8 md:mb-10">
          <Skeleton className="h-[24px] md:h-[40px] w-44 md:w-72 mb-3" />
          <Skeleton className="h-[14px] md:h-[20px] w-72 md:w-[460px]" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-20 items-start">
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col lg:gap-12 gap-8">
            <div className="bg-[#151515] border border-gold-deep p-4 md:p-6">
              <Skeleton className="h-[22px] w-52 mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-[48px]" />
                <Skeleton className="h-[48px]" />
                <Skeleton className="h-[48px]" />
                <Skeleton className="h-[48px]" />
              </div>
              <Skeleton className="h-[48px] w-full sm:w-1/2 mt-4" />
              <Skeleton className="h-[48px] w-full mt-4" />
              <Skeleton className="h-[96px] w-full mt-4" />
            </div>
            <div className="bg-[#151515] border border-gold-deep p-4 md:p-6">
              <Skeleton className="h-[22px] w-44 mb-6" />
              <Skeleton className="h-[48px] w-full mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Skeleton className="h-[48px]" />
                <Skeleton className="h-[48px]" />
                <Skeleton className="h-[48px]" />
              </div>
              <Skeleton className="h-[52px] w-full mt-6" />
            </div>
          </div>
          <div className="lg:col-span-5 xl:col-span-5 hidden lg:block">
            <div className="w-full bg-[#151515] pb-4 md:pb-6 border border-gold-deep">
              <Skeleton className="h-[180px] sm:h-[210px] md:h-[240px] w-full rounded-none" />
              <div className="p-4 md:p-6 space-y-4">
                <Skeleton className="h-[24px] w-2/3" />
                <Skeleton className="h-[16px] w-1/2" />
                <Skeleton className="h-[16px] w-full" />
                <Skeleton className="h-[16px] w-3/4" />
                <Skeleton className="h-[16px] w-2/3" />
                <Skeleton className="h-[16px] w-1/2" />
                <Skeleton className="h-[28px] w-1/2 mt-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}