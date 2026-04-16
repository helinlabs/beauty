import { NextIntlClientProvider } from "next-intl";
import { Inter, Lora, Geist_Mono } from "next/font/google";

import "@/styles/admin.css";
import { ThemeProvider } from "@/components/admin/theme-provider";
import { Toaster } from "@/components/admin/ui/sonner";
import { TooltipProvider } from "@/components/admin/ui/tooltip";
import { cn } from "@/lib/admin-utils";

const loraHeading = Lora({ subsets: ["latin"], variable: "--font-heading" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminGroupLayout({ children, params }: Props) {
  const { locale } = await params;

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable,
        loraHeading.variable,
      )}
    >
      <body className="min-h-svh bg-background text-foreground">
        <NextIntlClientProvider>
          <ThemeProvider>
            <TooltipProvider delayDuration={200}>
              {children}
              <Toaster position="top-center" />
            </TooltipProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
