"use client";
import Image from "next/image";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 bg-[#0D0D0D] flex items-center justify-center z-[99999]">
      <Image
        src="/logo.svg"
        alt="Loading.."
        width={100}
        height={100}
        className="animate-pulse"
      />
    </div>
  );
}
