"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import PageLoader from "@/components/general/Loader";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <Toaster richColors position="top-center" closeButton />
      {loading && <PageLoader />} 
      {children}
    </>
  );
}
