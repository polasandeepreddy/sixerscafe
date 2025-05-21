"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useBooking } from "@/context/BookingContext"
import { formatDisplayDate } from "@/utils/dateUtils"
import LoadingSpinner from "@/components/LoadingSpinner"

const ADMIN_PASSWORD = "admin123"
const ITEMS_PER_PAGE = 10

export default function AdminPage() {
  // Authentication state
  const [passwordInput, setPasswordInput] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState("")
  const [isContextReady, setIsContextReady] = useState(false)

  // Booking state
  const [bookings, setBookings] = useState<any[]>([])
  const [totalBookings, setTotalBookings] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Date filters
  const [activeTab, setActiveTab] = useState<"today" | "tomorrow" | "all">("today")
  const today = new Date()
  const todayISO = today.toISOString().split("T")[0]
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowISO = tomorrow.toISOString().split("T")[0]

  // Safely access the booking context
  const bookingContext = React.useRef<any>(null)

  const {
    removeBooking,
    updateBookingStatus,
    fetchBookingsForDate,
    fetchBookingsWithPagination,
    useLocalStorage,
    setUseLocalStorage,
  } = useBooking()

  useEffect(() => {
    try {
      // Store the context functions in the ref
      bookingContext.current = {
        removeBooking,
        updateBookingStatus,
        fetchBookingsForDate,
        fetchBookingsWithPagination,
        useLocalStorage,
        setUseLocalStorage,
      }

      setIsContextReady(true)
    } catch (error) {
      console.error("BookingContext not available yet:", error)
      setFetchError("BookingContext not available. Please refresh the page.")
    }
  }, [
    removeBooking,
    updateBookingStatus,
    fetchBookingsForDate,
    fetchBookingsWithPagination,
    useLocalStorage,
    setUseLocalStorage,
  ])

  const loadBookings = useCallback(async () => {
    if (!isContextReady || !bookingContext.current) {
      return
    }

    setIsLoading(true)
    setFetchError(null)

    try {
      let dateFilter: string | null = null

      if (activeTab === "today") {
        dateFilter = todayISO
      } else if (activeTab === "tomorrow") {
        dateFilter = tomorrowISO
      }

      const result = await bookingContext.current.fetchBookingsWithPagination(currentPage, ITEMS_PER_PAGE, dateFilter)

      setBookings(result.bookings)
      setTotalBookings(result.totalCount)
    } catch (error) {
      console.error("Error loading bookings:", error)
      setFetchError("Failed to load bookings. Please try again or use local storage.")
    } finally {
      setIsLoading(false)
    }
  }, [activeTab, currentPage, isContextReady, todayISO, tomorrowISO, fetchBookingsWithPagination])

  useEffect(() => {
    if (isAuthenticated && isContextReady) {
      loadBookings()
    }
  }, [isAuthenticated, loadBookings, isContextReady])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Incorrect password. Please try again.")
    }
    setPasswordInput("")
  }

  const handleSwitchToLocalStorage = () => {
    if (bookingContext.current) {
      bookingContext.current.setUseLocalStorage(true)
      setFetchError(null)
      loadBookings()
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleRemove = async (id: string) => {
    if (!bookingContext.current) return

    if (window.confirm("Are you sure you want to permanently remove this booking?")) {
      await bookingContext.current.removeBooking(id)
      loadBookings()
    }
  }

  const handleUpdateStatus = async (id: string, status: "approved" | "rejected") => {
    if (!bookingContext.current) return

    await bookingContext.current.updateBookingStatus(id, status)
    loadBookings()
  }

  if (!isContextReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <h2 className="text-xl font-semibold">Initializing application...</h2>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
            autoFocus
            aria-label="Admin password input"
          />
          {error && (
            <p className="text-red-600 mb-4 text-center" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
            Login
          </button>
        </form>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <h2 className="text-xl font-semibold">Loading bookings...</h2>
        </div>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Connection Error</h2>
          <p className="mb-6">{fetchError}</p>
          <button
            onClick={handleSwitchToLocalStorage}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition mb-4 w-full"
          >
            Switch to Local Storage
          </button>
          <button
            onClick={loadBookings}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Render the bookings table
  return (
    <div className="min-h-screen bg-gray-100 py-4 flex flex-col" style={{ height: "100vh" }}>
      <div className="container mx-auto px-4 bg-white rounded-lg shadow-md py-6 flex flex-col flex-grow overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Booking Management</h1>

          <div className="flex items-center">
            <span className="mr-2 text-sm">
              {bookingContext.current?.useLocalStorage ? "Using: Local Storage" : "Using: Database"}
            </span>
            <button
              onClick={() => {
                if (bookingContext.current) {
                  bookingContext.current.setUseLocalStorage(!bookingContext.current.useLocalStorage)
                  loadBookings()
                }
              }}
              className="bg-blue-600 text-white text-sm py-1 px-3 rounded hover:bg-blue-700"
            >
              Switch to {bookingContext.current?.useLocalStorage ? "Database" : "Local Storage"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-3 mb-4">
          <button
            onClick={() => setActiveTab("today")}
            className={`py-1.5 px-4 text-sm font-semibold rounded-md transition ${
              activeTab === "today" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Today
            <br />
            <span className="text-xs font-normal text-gray-400">{formatDisplayDate(todayISO)}</span>
          </button>

          <button
            onClick={() => setActiveTab("tomorrow")}
            className={`py-1.5 px-4 text-sm font-semibold rounded-md transition ${
              activeTab === "tomorrow" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Tomorrow
            <br />
            <span className="text-xs font-normal text-gray-400">{formatDisplayDate(tomorrowISO)}</span>
          </button>

          <button
            onClick={() => setActiveTab("all")}
            className={`py-1.5 px-4 text-sm font-semibold rounded-md transition ${
              activeTab === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All Slots
          </button>
        </div>

        {/* Bookings table */}
        <div className="flex-grow flex flex-col overflow-hidden">
          <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col h-full">
            <h2 className="text-xl font-semibold p-6 bg-gray-50 border-b border-gray-200 flex-shrink-0">
              {activeTab === "today"
                ? `Today's Booked Slots (${formatDisplayDate(todayISO)})`
                : activeTab === "tomorrow"
                  ? `Tomorrow's Booked Slots (${formatDisplayDate(tomorrowISO)})`
                  : "All Booked Slots"}
            </h2>
            <div className="overflow-auto flex-grow min-w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mobile
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Slots
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Proof
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.mobileNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDisplayDate(booking.date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex flex-wrap gap-2">
                          {booking.slots.map((slot: any) => (
                            <span
                              key={slot.id}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                            >
                              {slot.time}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{booking.totalAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            booking.paymentStatus === "approved"
                              ? "bg-green-100 text-green-800"
                              : booking.paymentStatus === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.paymentScreenshot && (
                          <button
                            onClick={() => setSelectedScreenshot(booking.paymentScreenshot)}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition text-sm font-semibold"
                            aria-label="View Payment Screenshot"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            View
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          {booking.paymentStatus === "pending" && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(booking.id, "approved")}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs font-medium transition"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(booking.id, "rejected")}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs font-medium transition"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleRemove(booking.id)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-xs font-medium transition"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                        No bookings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalBookings > ITEMS_PER_PAGE && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalBookings)}</span> of{" "}
                  <span className="font-medium">{totalBookings}</span> bookings
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage * ITEMS_PER_PAGE >= totalBookings}
                    className={`px-3 py-1 rounded ${
                      currentPage * ITEMS_PER_PAGE >= totalBookings
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Screenshot Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <img
              src={selectedScreenshot || "/placeholder.svg"}
              alt="Payment screenshot"
              className="max-w-full h-auto"
            />
          </div>
        </div>
      )}
    </div>
  )
}
