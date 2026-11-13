import { cookies } from "next/headers";
import "./global.css";
import { Inter, Plus_Jakarta_Sans, Syne } from "next/font/google";
import { Providers } from "@/components/providers";
import { DEFAULT_LOCALE, LOCALE_COOKIE } from "@/components/locale";
import { DirectionProvider } from "@/components/foundations/direction/direction";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  axes: ["opsz"],
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata = {
  title: {
    default: "JoyUI",
    template: "%s — JoyUI",
  },
  description:
    "JoyUI — React + Tailwind 设计系统：基础组件、组合组件、图表与模板，面向智能体界面。",
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/JoyUI_logo.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default async function Layout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const rawLocale = String(
    cookieStore.get(LOCALE_COOKIE)?.value ?? DEFAULT_LOCALE,
  );
  // Docs UI locale (fumadocs) vs BCP 47 tag for React Aria DirectionProvider.
  const locale = rawLocale;
  const directionLocale = locale.startsWith("zh") ? "zh-Hans" : "en-US";

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${sans.variable} ${display.variable} ${inter.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <DirectionProvider locale={directionLocale}>
          <Providers locale={locale}>{children}</Providers>
        </DirectionProvider>
      </body>
    </html>
  );
}
