import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | NextGen Ecommerce",
    default: "NextGen Ecommerce",
  },
  description: "Experience the future of online shopping with NextGen Ecommerce.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(0, 0, 0, 0.9)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
              },
              success: {
                iconTheme: {
                  primary: '#22d3ee',
                  secondary: 'black',
                },
                style: {
                  border: '1px solid rgba(34, 211, 238, 0.3)',
                  boxShadow: '0 0 20px rgba(34, 211, 238, 0.1)',
                }
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: 'black',
                },
                style: {
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.1)',
                }
              },
              loading: {
                iconTheme: {
                  primary: '#a855f7',
                  secondary: 'black',
                },
                style: {
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                }
              }
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
