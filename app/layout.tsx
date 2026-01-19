import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storageKey = 'theme';
                  var className = 'dark';
                  var theme = localStorage.getItem(storageKey);
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var systemTheme = supportDarkMode ? 'dark' : 'light';
                  
                  // Default to dark if no storage
                  if (!theme) {
                    document.documentElement.classList.add(className);
                  } else {
                    if (theme === 'dark') {
                      document.documentElement.classList.add(className);
                    } else {
                      document.documentElement.classList.remove(className);
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <AuthProvider>
          <ThemeProvider>
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
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
