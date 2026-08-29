import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-[8px] bg-[#2A2A2A]", className)} {...props} />;
}

export { Skeleton };