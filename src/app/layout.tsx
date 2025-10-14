import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediReminder",
  description: "Simple medicine reminders with Next.js and TypeScript",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <div className="flex min-h-screen flex-col">
          {/* Header / Navbar */}
          <header className="border-b bg-white shadow-sm">
            <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
              <h1 className="text-xl font-bold text-green-600">MediReminder</h1>
              <nav className="space-x-4 text-sm text-gray-700">
                {/* Later: add links like Dashboard, About, Profile */}
                <a href="/" className="hover:text-green-600">Home</a>
                <a href="#" className="hover:text-green-600">About</a>
              </nav>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 mx-auto w-full max-w-4xl p-6">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t bg-white text-center text-sm text-gray-500 py-4">
            © {new Date().getFullYear()} MediReminder. All rights reserved.
          </footer>
        </div>
      </body>
    </html>
    // <html lang="en">
    //   <body
    //     className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    //   >
    //     {children}
    //   </body>
    // </html>
  );
}
