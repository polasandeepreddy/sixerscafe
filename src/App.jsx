"use client"

import { Routes, Route, useLocation } from "react-router-dom"
import { useEffect, useState, lazy, Suspense } from "react"
import Header from "./components/Header"
import Footer from "./components/Footer"
import LoadingSpinner from "./components/LoadingSpinner"
import NotFoundPage from "./pages/NotFoundPage"
import 'bootstrap/dist/css/bootstrap.min.css'
import { twMerge } from 'tailwind-merge'

import BookingStatus from './pages/BookingStatus';

const HomePage = lazy(() => import("./pages/HomePage"))
const BookingPage = lazy(() => import("./pages/BookingPage"))
const AdminPage = lazy(() => import("./pages/AdminPage"))
const BookingConfirmation = lazy(() => import("./pages/BookingConfirmation"))

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
)

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasPadding, setHasPadding] = useState(true) // example toggle for padding
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Dynamically merge Tailwind classes using twMerge
  const mainClass = twMerge(
    "flex-grow",
    hasPadding ? "p-6" : "p-0",
    "bg-gray-50"
  )

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={mainClass}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />
            <Route path="/status" element={<BookingStatus />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default App
