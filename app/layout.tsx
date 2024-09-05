import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IT Days",
  description: "IT Days Attendance System",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
        <Toaster duration={2000}
        toastOptions={{
          classNames: {
            error: 'bg-red-500',
            success: 'bg-green-500',
            warning: 'text-yellow-400',
            info: 'bg-blue-400',
          },
        }}/>
      </body>
    </html>
  );
}
