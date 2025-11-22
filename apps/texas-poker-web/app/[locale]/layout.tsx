import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
import { NextIntlClientProvider, useMessages } from 'next-intl';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Texas Hold'em Poker",
  description: "Real-time Texas Hold'em Poker Game",
};

export default function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = useMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
