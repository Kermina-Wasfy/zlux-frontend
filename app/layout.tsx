import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import Header from "@/components/general/Header/Header";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import ReactQuery from "@/lib/ReactQuery";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "ZLUX | Premium Private Chauffeur Service",
  icons: {
    icon: "/logoMobile.svg",
  },
  description:
    "Experience Seamless, Punctual, And Executive Transportation Across The US. Your Premium Ride Is Just A Click Away.",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${montserrat.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <ReactQuery>
          <ClientLayout>
            <Header />
            {children}
          </ClientLayout>
        </ReactQuery>
      </body>
    </html>
  );
}
