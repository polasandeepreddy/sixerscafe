import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { formatDisplayDate } from '../utils/dateUtils';
import { QRCodeSVG } from 'qrcode.react';

const PaymentSummary = ({ className = '', onPaymentComplete }) => {
  const { formData } = useBooking();
  const { selectedSlots, date } = formData;
  const [screenshot, setScreenshot] = useState(null);

  // Calculate price per slot based on time
  const getSlotPrice = (time) => {
    const [startTime] = time.split(' - ');
    const [hourStr, meridian] = startTime.split(' ');
    const [hour] = hourStr.split(':');
    let hour24 = parseInt(hour, 10);
    if (meridian === 'PM' && hour24 !== 12) hour24 += 12;
    if (meridian === 'AM' && hour24 === 12) hour24 = 0;

    if (hour24 >= 6 && hour24 <= 17) return 500;
    return 600;
  };

  // Calculate totalAmount based on selectedSlots
  const totalAmount = selectedSlots.reduce(
    (acc, slot) => acc + getSlotPrice(slot.time),
    0
  );

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setScreenshot(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!screenshot) {
      alert('Please upload payment screenshot');
      return;
    }
    onPaymentComplete(screenshot);
  };

  const upiDetails = {
    payeeName: "Sixers Cafe",
    upiId: "Q381279615@ybl",
    amount: totalAmount,
    note: `Booking for ${formatDisplayDate(date)}`
  };

  const upiUri = `upi://pay?pa=${upiDetails.upiId}&pn=${encodeURIComponent(
    upiDetails.payeeName
  )}&am=${upiDetails.amount}&tn=${encodeURIComponent(upiDetails.note)}`;

  const openUpiApp = () => {
    window.location.href = upiUri;
  };

  if (selectedSlots.length === 0) {
    return (
      <div className={`max-w-md mx-4 my-6 p-4 bg-gray-50 rounded-xl shadow-md text-center ${className}`}>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Payment Summary</h2>
        <p className="text-gray-500 text-sm">Please select at least one slot to view payment details.</p>
      </div>
    );
  }

  return (
    <>
      {/* Left side - Booking details */}
      <section className={`space-y-3 ${className}`}>
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-2">Booking Details</h2>

        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase">Date</h3>
          <p className="text-sm font-medium text-gray-900">{formatDisplayDate(date)}</p>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase">Selected Slots</h3>
          <div className="flex flex-wrap gap-2">
            {selectedSlots.map(slot => (
              <span
                key={slot.id}
                className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full text-xs font-semibold"
              >
                {slot.time} - ₹{getSlotPrice(slot.time)}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-3 space-y-1 text-gray-700 text-sm">
          <div className="flex justify-between">
            <span>Number of Slots</span>
            <span>{selectedSlots.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="italic text-gray-500 text-xs">Price per Slot</span>
            <span className="italic text-gray-500 text-xs">₹500 or ₹600</span>
          </div>
          <div className="flex justify-between font-bold text-indigo-700 border-t pt-2">
            <span>Total Amount</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>
      </section>

      {/* Right side - Payment and Upload */}
      <section className="space-y-3 flex flex-col items-center mt-6">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2 w-full text-center">
          Payment
        </h2>

        <p className="text-gray-600 text-sm font-semibold text-center">Scan to Pay</p>

        <div className="bg-indigo-50 rounded-lg p-2 shadow">
          <QRCodeSVG value={upiUri} size={180} />
        </div>

        <button
          onClick={openUpiApp}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 px-4 rounded-md text-sm"
        >
          Pay Using UPI App
        </button>

        <div className="text-center text-gray-700 text-sm">
          <p><strong>UPI ID:</strong> {upiDetails.upiId}</p>
          <p><strong>Amount:</strong> ₹{upiDetails.amount}</p>
        </div>

        {/* Tightly styled upload input */}
        <div className="w-full">
          <label
            htmlFor="payment-screenshot"
            className="block text-gray-700 font-semibold text-sm mb-1"
          >
            Upload Screenshot
          </label>
          <input
            id="payment-screenshot"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-gray-600 text-sm
              file:mr-3 file:py-1 file:px-2
              file:border file:border-gray-300
              file:rounded file:text-sm file:font-semibold
              file:bg-indigo-100 file:text-indigo-700
              hover:file:bg-indigo-200
              cursor-pointer
            "
          />
        </div>

        {screenshot && (
          <div className="w-full text-center">
            <p className="text-green-600 text-sm font-semibold">Uploaded Successfully!</p>
            <img
              src={screenshot}
              alt="Payment Screenshot"
              className="mx-auto max-h-32 rounded-md mt-1 object-contain"
            />
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!screenshot}
          className={`w-full py-2 text-white font-semibold text-sm rounded-lg
            ${screenshot ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'}
          `}
        >
          Confirm Payment
        </button>

        <p className="text-xs text-gray-400 text-center">
          Upload a clear screenshot of the payment. Admin will verify and confirm your slot.
        </p>
      </section>
    </>
  );
};

export default PaymentSummary;
