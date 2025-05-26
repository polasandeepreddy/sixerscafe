"use client"

import React, { useEffect, useState, lazy, Suspense, Component } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import LoadingSpinner from "./components/LoadingSpinner"
import NotFoundPage from "./pages/NotFoundPage"
import BookingStatus from './pages/BookingStatus'
import 'bootstrap/dist/css/bootstrap.min.css'
import { twMerge } from 'tailwind-merge'

// Lazy loaded pages
const HomePage = lazy(() => import("./pages/HomePage"))
const BookingPage = lazy(() => import("./pages/BookingPage"))
const AdminPage = lazy(() => import("./pages/AdminPage"))
const BookingConfirmation = lazy(() => import("./pages/BookingConfirmation"))

// Simple page loader component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
)

// Error Boundary component to catch errors in lazy loading
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center text-red-600">
          <p>Something went wrong loading this page.</p>
        </div>
      )
    }

    return this.props.children
  }
}

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasPadding, setHasPadding] = useState(true)
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
        <ErrorBoundary>
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
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}

export default App
