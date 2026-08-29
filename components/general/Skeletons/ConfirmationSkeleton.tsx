import { Skeleton } from "@/components/ui/skeleton";

export default function ConfirmationSkeleton() {
  return (
    <section className="w-full min-h-screen bg-[#0D0D0D] py-12 md:py-16 px-4 flex flex-col items-center justify-center">
      <div className="w-full mx-auto flex flex-col items-center">
        <Skeleton className="w-14 h-14 md:w-16 md:h-16 rounded-full" />
        <Skeleton className="h-[20px] md:h-[32px] w-48 md:w-72 mt-6 mb-3" />
        <Skeleton className="h-[24px] md:h-[48px] w-64 md:w-[480px] rounded-[4px] mb-2" />
        <Skeleton className="h-[16px] md:h-[20px] w-80 md:w-[560px] mb-14" />
        <Skeleton className="max-w-[750px] w-full h-[96px] mb-10 rounded-none border border-gold-deep" />
        <Skeleton className="max-w-[750px] w-full h-[420px] md:h-[500px] mb-6 rounded-none" />
        <Skeleton className="max-w-[750px] w-full h-[220px] mb-6 rounded-none" />
        <div className="max-w-[750px] grid grid-cols-2 gap-4 w-full">
          <Skeleton className="h-[52px]" />
          <Skeleton className="h-[52px]" />
        </div>
      </div>
    </section>
  );
}