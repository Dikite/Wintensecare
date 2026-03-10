import { NextIntlClientProvider } from "next-intl";
import MuiProvider from "@/app/providers/MuiProvider";

const locales = ["en","ta","hi","te","kn","ml"];

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {

  const { locale } = await params;

  const safeLocale = locales.includes(locale) ? locale : "en";

  const messages =
    (await import(`@/messages/${safeLocale}.json`)).default;

  return (
    <html lang={safeLocale}>
      <body>
        <NextIntlClientProvider locale={safeLocale} messages={messages}>
          <MuiProvider>
            {children}
          </MuiProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}