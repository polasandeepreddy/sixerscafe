import { useBooking } from "../context/BookingContext";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Confirmation({ bookingId }) {
  const { bookings } = useBooking();
  const [booking, setBooking] = useState(null);

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    let day = String(d.getDate()).padStart(2, "0");
    let month = String(d.getMonth() + 1).padStart(2, "0");
    let year = String(d.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  }

  function formatTime(timeStr) {
    let date;
    if (timeStr.includes("T")) {
      date = new Date(timeStr);
    } else {
      date = new Date(`1970-01-01T${timeStr}`);
    }
    if (isNaN(date)) return timeStr;

    let hours = date.getHours();
    let minutes = String(date.getMinutes()).padStart(2, "0");
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  useEffect(() => {
    if (bookingId) {
      const found = bookings.find((b) => b.id === bookingId);
      setBooking(found);
    }
  }, [bookingId, bookings]);

  if (!booking)
    return (
      <div className="loading-container d-flex justify-content-center align-items-center vh-100">
        <div className="spinner"></div>
        <p className="loading-text">Fetching Booking Details...</p>
      </div>
    );

  return (
    <>
      <style>{`
        body {
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
          font-family: "Poppins", sans-serif;
        }

        .loading-container {
          text-align: center;
        }

        .spinner {
          width: 60px;
          height: 60px;
          border: 6px solid #3498db;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-text {
          font-size: 1.5rem;
          color: #3498db;
          margin-top: 10px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .confirmation-card {
          background: #fff;
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          text-align: center;
          animation: fadeIn 1s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .checkmark-circle {
          width: 80px;
          height: 80px;
          background: #27ae60;
          color: white;
          font-size: 2rem;
          font-weight: bold;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: auto;
          box-shadow: 0 0 10px #27ae60;
          animation: bounce 1s infinite alternate;
        }

        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-10px); }
        }

        .info-box {
          background: #f2f2f2;
          padding: 10px;
          border-radius: 10px;
          margin: 10px 0;
          font-size: 1.2rem;
          text-align: left;
        }

        .slots-list {
          list-style: none;
          padding: 0;
          margin-top: 10px;
        }

        .slots-list li {
          background: #3498db;
          color: white;
          padding: 10px;
          border-radius: 10px;
          display: flex;
          justify-content: space-between;
          margin: 5px 0;
          transition: all 0.3s ease-in-out;
        }

        .slots-list li:hover {
          background: #2980b9;
        }

        .badge {
          background: #2ecc71;
          padding: 5px 10px;
          border-radius: 5px;
          font-weight: bold;
          align-self: center;
        }

        .total-amount {
          font-size: 1.5rem;
          color: #e74c3c;
          font-weight: bold;
          margin-top: 15px;
          text-align: center; /* Centered */
        }
      `}</style>

      <div className="confirmation-card">
        <div className="checkmark-circle">✔</div>
        <h1 className="title">Booking Confirmed!</h1>

        <div className="info-box">
          <strong>Name:</strong> <span>{booking.fullName || "Not Provided"}</span>
        </div>
        <div className="info-box">
          <strong>Mobile:</strong> <span>{booking.mobileNumber || "Not Provided"}</span>
        </div>
        <div className="info-box">
          <strong>Date:</strong> <span>{booking.date ? formatDate(booking.date) : "No Date Selected"}</span>
        </div>

        <div className="info-box">
          <strong>Selected Slots:</strong>
          {booking.slots && booking.slots.length > 0 ? (
            <ul className="slots-list">
              {booking.slots.map((slot, index) => (
                <li key={index}>
                  {slot.label || `Slot ${index + 1}`} - {slot.time ? formatTime(slot.time) : "00:00 AM"}
                  <span className="badge">Booked</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No slots selected</p>
          )}
        </div>

        <div className="total-amount">
          <strong>Total Amount:</strong> ₹{booking.totalAmount || "0"}
        </div>
      </div>
    </>
  );
}
