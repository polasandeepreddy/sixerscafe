import React, { useState } from "react";
import axios from "axios";

const BookingStatus = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizeBooking = (booking) => {
    // Log each raw booking for debugging
    console.log("Normalizing booking:", booking);

    return {
      fullName:
        booking.fullName ||
        booking.name ||
        booking.customerName || // sometimes API uses different keys
        "N/A",
      mobileNumber:
        booking.mobileNumber ||
        booking.mobile ||
        booking.contactNumber ||
        "N/A",
      date:
        booking.date ||
        booking.bookingDate ||
        booking.booking_date ||
        "N/A",
      slots:
        Array.isArray(booking.slots)
          ? booking.slots
          : booking.slots
          ? [booking.slots]
          : [],
      amount:
        booking.amount ||
        booking.price ||
        booking.totalAmount ||
        booking.total_amount ||
        "N/A",
      status: booking.status || "Pending",
    };
  };

  const handleCheckStatus = async () => {
    setError("");
    setBookings([]);

    if (mobileNumber.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);

      // Make the API call
      const response = await axios.get(`/api/booking-status?mobileNumber=${mobileNumber}`);

      const rawData = response.data;
      console.log("API response data:", rawData);

      if (!rawData) {
        setError("No bookings found for this mobile number.");
        setBookings([]);
        return;
      }

      // Normalize response to an array of bookings
      let bookingArray = [];
      if (Array.isArray(rawData)) {
        bookingArray = rawData;
      } else if (rawData.bookings && Array.isArray(rawData.bookings)) {
        bookingArray = rawData.bookings;
      } else if (rawData.booking) {
        bookingArray = [rawData.booking];
      } else {
        // Fallback: wrap rawData itself into array
        bookingArray = [rawData];
      }

      console.log("Bookings array after parsing:", bookingArray);

      if (bookingArray.length === 0) {
        setError("No bookings found for this mobile number.");
        setBookings([]);
        return;
      }

      // Normalize each booking entry
      const normalizedBookings = bookingArray.map(normalizeBooking);
      setBookings(normalizedBookings);
    } catch (err) {
      console.error("API fetch error:", err);
      setError("Error fetching booking status. Please try again later.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
        <div className="card-body">
          <h2 className="card-title text-center text-success mb-4">Check Booking Status</h2>

          <label htmlFor="mobileInput" className="form-label visually-hidden">
            Mobile Number
          </label>
          <input
            id="mobileInput"
            type="tel"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter your 10-digit mobile number"
            className="form-control mb-3"
            maxLength={10}
            inputMode="numeric"
            pattern="[0-9]{10}"
            aria-describedby="mobileHelp"
            disabled={loading}
          />

          <button
            onClick={handleCheckStatus}
            className="btn btn-success w-100"
            disabled={loading || mobileNumber.length !== 10}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Checking...
              </>
            ) : (
              "Check Status"
            )}
          </button>

          {error && (
            <div className="alert alert-danger mt-3 text-center" role="alert">
              {error}
            </div>
          )}

          {bookings.length > 0 && (
            <div className="mt-4">
              <h3 className="h5 mb-3">Booking Details:</h3>
              {bookings.map((booking, index) => (
                <div key={index} className="card mb-3 booking-card">
                  <div className="card-body">
                    <p>
                      <strong>Name:</strong> {booking.fullName}
                    </p>
                    <p>
                      <strong>Mobile:</strong> {booking.mobileNumber}
                    </p>
                    <p>
                      <strong>Date:</strong> {booking.date}
                    </p>
                    <p>
                      <strong>Slots:</strong>{" "}
                      {booking.slots.length > 0 ? booking.slots.join(", ") : "No slots available"}
                    </p>
                    <p>
                      <strong>Amount:</strong> ₹{booking.amount}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`fw-bold ${
                          booking.status === "Approved"
                            ? "text-success"
                            : booking.status === "Rejected"
                            ? "text-danger"
                            : "text-warning"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingStatus;
