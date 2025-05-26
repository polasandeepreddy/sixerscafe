"use client"

import { Routes, Route, useLocation } from "react-router-dom"
import { useEffect, useState, lazy, Suspense } from "react"
import Header from "./components/Header"
import Footer from "./components/Footer"
import LoadingSpinner from "./components/LoadingSpinner"
import NotFoundPage from "./pages/NotFoundPage"
import 'bootstrap/dist/css/bootstrap.min.css'
import BookingStatus from './pages/BookingStatus';


// Lazy load pages for performance
const HomePage = lazy(() => import("./pages/HomePage"))
const BookingPage = lazy(() => import("./pages/BookingPage"))
const AdminPage = lazy(() => import("./pages/AdminPage"))
const BookingConfirmation = lazy(() => import("./pages/BookingConfirmation"))

// Page loader component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
)

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Simulate initial app load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
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
