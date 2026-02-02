import '@/app/ui/global.css';
import { Inter, Geist } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const geis = Geist({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
