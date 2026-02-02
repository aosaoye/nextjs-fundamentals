import '@/app/ui/global.css';
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${dmSans.className} antialiased`}>{children}</body>
    </html>
  );
}
