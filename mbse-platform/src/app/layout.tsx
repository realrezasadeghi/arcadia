import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/presentation/providers/theme-provider";
import { QueryProvider } from "@/presentation/providers/query-provider";

export const metadata: Metadata = {
  title: "نقطه — پلتفرم مدل‌سازی معماری MBSE",
  description: "پلتفرم مدل‌محور برای طراحی، تحلیل و رهگیری معماری سیستم‌های پیچیده",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
