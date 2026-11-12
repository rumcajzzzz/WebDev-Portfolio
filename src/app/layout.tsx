import type { Metadata } from "next";
import AppLoader from "@/components/AppLoader";
import "./globals.css";

const title = "rumcajzdev.pl";
const description =
  "Tworzę nowoczesne, szybkie i responsywne strony internetowe dla firm i osób prywatnych. Projekt UX/UI, optymalizacja i pomoc przy publikacji.";

export const metadata: Metadata = {
  // Absolute base for OG image URLs; set NEXT_PUBLIC_SITE_URL to the production domain.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "/",
    siteName: "Rumcajz",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`antialiased`}
      >
          <AppLoader>
            {children}
          </AppLoader>
      </body>
    </html>
  );
}
