import "./globals.css"; // global style must before all other styles due to tailwindcss
import "@mantine/core/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OVM 3rd party service proxy",
  description: "OVM 3rd party service proxy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${inter.className} bg-slate-100`}>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
