import "@/app/_assets/globals.css";
import ReactQueryContext from "@/lib/context/ReactQueryContext";
import React from "react";
import { Toaster } from "@/components/ui/toaster"
import { Metadata } from "next";
// import { ToastProvider } from "@/components/ui/toast"

export const metadata: Metadata = {
  title: "zolpa admin",
  robots: {
    index: false,
  },

};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
      {/* <link rel="icon" type="image/png" href="/favicon-48x48.png" sizes="48x48" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" /> */}
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
        <link rel="manifest" href="/favicon.ico" />
      </head>
      <body>
        <ReactQueryContext>
         
           <main> {children}</main>

          <Toaster />
        </ReactQueryContext>
      </body>
    </html>
  );
}
