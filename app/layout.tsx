import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Saira } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const display = Saira({ variable: "--font-display", weight: ["300", "400"], subsets: ["latin"] });
const sans = IBM_Plex_Sans({ variable: "--font-sans", weight: ["400", "500"], subsets: ["latin"] });
const mono = IBM_Plex_Mono({ variable: "--font-mono", weight: ["400", "500"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: site.name,
  description: `${site.name}. ${site.role}.`,
};

export const viewport: Viewport = { themeColor: "#04060a" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
