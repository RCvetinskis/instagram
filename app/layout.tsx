import type { Metadata } from "next";
import { Inconsolata } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const font = Inconsolata({
  weight: ["500", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Instagram",
  description: "Instagram clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      signUpUrl="/sign-up"
      signInUrl="/sign-in"
      appearance={{
        baseTheme: neobrutalism,
        variables: { colorPrimary: "blue", spacingUnit: "0.8rem" },
      }}
    >
      <html lang="en" suppressHydrationWarning={true}>
        <body className={font.className} suppressHydrationWarning={true}>
          <ThemeProvider attribute="class" defaultTheme="system">
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
