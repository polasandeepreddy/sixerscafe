"use client";

import { useState } from "react";
import BookingForm from "../components/BookingForm";
import BookingConfirmation from "./BookingConfirmation";
import PaymentSummary from "../components/PaymentSummary";
import { useBooking } from "../context/BookingContext"; // Correct context import
import LoadingSpinner from "../components/LoadingSpinner";

export default function BookingPage() {
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const { formData, addBooking, databaseInitialized, initializeDatabase } = useBooking(); // Ensure correct function usage

  const handleBookingSubmit = () => {
    setShowPayment(true);
  };

  const handlePaymentComplete = async (screenshot) => {
    setError(null);
    setIsProcessing(true);
    try {
      if (!databaseInitialized) {
        await initializeDatabase(); // Ensure correct function call
      }
      const newBookingId = await addBooking({
        paymentScreenshot: screenshot,
      });

      setBookingId(newBookingId);
      setBookingConfirmed(true);
    } catch (error) {
      console.error("Error completing payment:", error);
      setError("There was an error processing your booking. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
        <div className="text-center p-4 bg-white rounded shadow-sm">
          <LoadingSpinner size="lg" className="mb-4" />
          <h2 className="h4 fw-semibold mb-3">Processing Your Booking</h2>
          <p className="text-muted">Please wait while we process your booking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        {!bookingConfirmed ? (
          <>
            <h2 className="h3 fw-bold text-center mb-5 text-primary">Book Your Cricket Slot</h2>
            {error && (
              <div className="alert alert-danger mx-auto" style={{ maxWidth: "600px" }}>
                <strong>Error:</strong> {error}
              </div>
            )}
            <div className="mx-auto" style={{ maxWidth: "600px" }}>
              {!showPayment ? (
                <div className="card shadow-sm p-4">
                  <BookingForm onSubmit={handleBookingSubmit} />
                </div>
              ) : (
                <div className="card shadow-sm p-4">
                  <PaymentSummary onPaymentComplete={handlePaymentComplete} />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="card mx-auto shadow-sm p-4" style={{ maxWidth: "600px" }}>
            <BookingConfirmation bookingId={bookingId} />
          </div>
        )}
      </div>
    </div>
  );
}
