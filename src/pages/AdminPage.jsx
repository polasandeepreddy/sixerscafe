"use client"

import { useState } from "react"
import { formatDisplayDate } from "../utils/dateUtils"
import LoadingSpinner from "../components/LoadingSpinner"
import { useBooking } from "../context/BookingContext"
import { Eye } from "lucide-react"

const formatTimeTo12Hour = (time) => {
  if (typeof time !== "string") return ""
  const [hourStr, minuteStr] = time.split(":")
  const hour = parseInt(hourStr, 10)
  const minute = parseInt(minuteStr, 10)

  if (isNaN(hour) || isNaN(minute)) return time

  const date = new Date()
  date.setHours(hour)
  date.setMinutes(minute)
  date.setSeconds(0)
  date.setMilliseconds(0)

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

const ITEMS_PER_PAGE = 10

export default function AdminDashboard() {
  const {
    bookings,
    removeBooking,
    updateBookingStatus,
    fetchBookings,
    isLoading: contextLoading,
  } = useBooking()

  const [selectedScreenshot, setSelectedScreenshot] = useState(null)
  const [fetchError, setFetchError] = useState(null)
  const [activeTab, setActiveTab] = useState("today")
  const [currentPage, setCurrentPage] = useState(1)

  // New state for password
  const [password, setPassword] = useState("")
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  // Loading state for action buttons
  const [actionLoading, setActionLoading] = useState(false)

  const today = new Date()
  const todayISO = today.toISOString().split("T")[0]
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowISO = tomorrow.toISOString().split("T")[0]

  const todayBookings = bookings.filter((b) => b.date === todayISO)
  const tomorrowBookings = bookings.filter((b) => b.date === tomorrowISO)

  const sortByNewest = (list) =>
    [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const displayedBookings =
    activeTab === "today"
      ? sortByNewest(todayBookings)
      : activeTab === "tomorrow"
      ? sortByNewest(tomorrowBookings)
      : sortByNewest(bookings)

  const paginatedBookings = displayedBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const totalPages = Math.ceil(displayedBookings.length / ITEMS_PER_PAGE)

  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to remove this booking?")) {
      try {
        setActionLoading(true)
        await removeBooking(id)
        await fetchBookings()
      } finally {
        setActionLoading(false)
      }
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      setActionLoading(true)
      await updateBookingStatus(id, status)
      await fetchBookings()
    } finally {
      setActionLoading(false)
    }
  }

  // Password submit handler
  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (password === "admin123") {
      setIsAuthorized(true)
      setPasswordError("")
    } else {
      setPasswordError("Incorrect password. Please try again.")
    }
  }

  if (!isAuthorized) {
    return (
      <div
        className="d-flex align-items-center justify-content-center vh-100 px-3"
        style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white p-5 rounded-4 shadow-lg"
          style={{
            maxWidth: "400px",
            width: "100%",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
        >
          <h2
            className="mb-4 text-center fw-bold text-primary"
            style={{ letterSpacing: "1.5px" }}
          >
            ADMIN LOGIN
          </h2>

          <div className="mb-4">
            <label htmlFor="admin-password" className="visually-hidden">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className={`form-control form-control-lg ${
                passwordError ? "is-invalid" : ""
              }`}
              autoComplete="off"
              style={{
                borderRadius: "0.75rem",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
                transition: "border-color 0.3s ease",
                fontSize: "1.1rem",
                padding: "0.75rem 1rem",
              }}
              aria-describedby="passwordHelp"
              aria-invalid={passwordError ? "true" : "false"}
            />
            {passwordError && (
              <div
                id="passwordHelp"
                className="invalid-feedback text-center"
                style={{ fontSize: "0.9rem" }}
              >
                {passwordError}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-3 fw-semibold"
            style={{
              borderRadius: "0.75rem",
              fontSize: "1.1rem",
              boxShadow: "0 6px 12px rgba(102,126,234,0.6)",
              transition: "background-color 0.3s ease",
            }}
          >
            Login
          </button>
        </form>
      </div>
    )
  }

  if (contextLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-gray-700 text-lg">Loading bookings...</p>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-red-600 text-xl font-semibold mb-4">
            Connection Error
          </h2>
          <p className="mb-4">{fetchError}</p>
          <button
            onClick={() => fetchBookings()}
            className="bg-blue-600 hover:bg-blue-700 transition text-white py-2 px-4 rounded w-full"
            type="button"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      {/* ...rest of your existing dashboard JSX */}
      <div className="container mx-auto bg-white shadow rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Booking Management</h1>
        </div>

        <div className="flex flex-wrap space-x-2 mb-4">
          {["today", "tomorrow", "all"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab)
                setCurrentPage(1)
              }}
              className={`py-2 px-4 rounded-md font-medium transition ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              type="button"
            >
              {tab === "today"
                ? `Today (${formatDisplayDate(todayISO)})`
                : tab === "tomorrow"
                ? `Tomorrow (${formatDisplayDate(tomorrowISO)})`
                : "All"}
            </button>
          ))}
        </div>

        <div className="overflow-auto rounded border border-gray-300">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10 text-xs text-gray-500">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Mobile</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Slots</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Proof</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="p-2">{booking.fullName}</td>
                    <td className="p-2">{booking.mobileNumber}</td>
                    <td className="p-2">{formatDisplayDate(booking.date)}</td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1 max-w-[140px]">
                        {booking.slots.map((s) => (
                          <span
                            key={s.id}
                            className="inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs"
                            style={{ flexBasis: "48%" }}
                          >
                            {formatTimeTo12Hour(s.time)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-2">₹{booking.totalAmount}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          booking.paymentStatus === "approved"
                            ? "bg-green-100 text-green-700"
                            : booking.paymentStatus === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="p-2">
                      {booking.paymentScreenshot && (
                        <button
                          onClick={() => setSelectedScreenshot(booking.paymentScreenshot)}
                          className="flex items-center text-blue-600 hover:underline text-sm space-x-1"
                          type="button"
                          aria-label="View payment screenshot"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                    </td>
                    <td className="p-2 space-x-1">
                      {booking.paymentStatus === "pending" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(booking.id, "approved")}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs rounded"
                            type="button"
                            disabled={actionLoading}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(booking.id, "rejected")}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded"
                            type="button"
                            disabled={actionLoading}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleRemove(booking.id)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 text-xs rounded"
                        type="button"
                        disabled={actionLoading}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 p-4">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center flex-wrap gap-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`py-2 px-4 rounded-md font-medium transition ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                  type="button"
                  aria-current={currentPage === pageNum ? "page" : undefined}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>
        )}

        {/* Screenshot Modal */}
        {selectedScreenshot && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="screenshot-modal-title"
          >
            <div className="relative bg-white rounded-lg p-4 max-w-lg max-h-[90vh] overflow-auto">
              <h2
                id="screenshot-modal-title"
                className="text-lg font-semibold mb-2 text-center"
              >
                Payment Screenshot
              </h2>
              <img
                src={selectedScreenshot}
                alt="Payment screenshot"
                className="max-w-full max-h-[70vh] rounded"
              />
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl font-bold"
                aria-label="Close screenshot modal"
                type="button"
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
