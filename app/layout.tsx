import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { BookingProvider } from "@/context/BookingContext"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import DatabaseInitializer from "@/components/DatabaseInitializer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sixers Cafe - Cricket Box Booking",
  description: "Book your cricket box slot at Sixers Cafe",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BookingProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <DatabaseInitializer />
        </BookingProvider>
      </body>
    </html>
  )
}
