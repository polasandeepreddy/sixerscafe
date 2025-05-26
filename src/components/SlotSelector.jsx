"use client";

import React, { useMemo } from "react";
import { useBooking } from "../context/BookingContext";
import "bootstrap/dist/css/bootstrap.min.css";

// Converts "HH:mm" (24-hour) string to 12-hour format string like "5:00 PM"
function formatTimeTo12Hour(time24) {
  const [hourStr, minStr] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minStr} ${ampm}`;
}

// Parses a 12-hour time string "5:00 PM" and a date string into a Date object
function parseSlotTime(time12h, dateStr) {
  const [time, meridiem] = time12h.split(" ");
  const [hourStr, minuteStr] = time.split(":");
  let hour = parseInt(hourStr, 10);
  const minutes = parseInt(minuteStr, 10);
  if (meridiem === "PM" && hour !== 12) hour += 12;
  if (meridiem === "AM" && hour === 12) hour = 0;
  const date = new Date(dateStr);
  date.setHours(hour, minutes, 0, 0);
  return date;
}

// Checks if the slot time is past compared to current time for the selected date
function isPastSlot(slotTime12h, selectedDate) {
  const now = new Date();
  const selectedDateObj = new Date(selectedDate);
  if (selectedDateObj.toDateString() !== now.toDateString()) return false;
  const slotStart = parseSlotTime(slotTime12h, selectedDate);
  const slotEnd = new Date(slotStart);
  slotEnd.setHours(slotEnd.getHours() + 1);
  return now >= slotEnd;
}

// Generate 24 hourly slots with pricing:
// 6 AM (6) to 5 PM (17) inclusive => ₹500
// Others => ₹600
function generateWholeDaySlots() {
  const slots = [];
  for (let i = 0; i < 24; i++) {
    const hourStr = i.toString().padStart(2, "0");
    const price = i >= 6 && i <= 17 ? 500 : 600;
    slots.push({
      id: i.toString(),
      time: `${hourStr}:00`,
      isAvailable: true,
      price,
    });
  }
  return slots;
}

const SlotBooking = () => {
  const { slots: contextSlots, formData, selectSlot, deselectSlot } = useBooking();

  // Use context slots if available, else generate default whole day slots
  // And always recalculate price based on hour to fix any mismatches
  const slots = useMemo(() => {
    const baseSlots = contextSlots && contextSlots.length > 0 ? contextSlots : generateWholeDaySlots();
    return baseSlots.map((slot) => {
      const hour = parseInt(slot.time.split(":")[0], 10);
      const price = hour >= 6 && hour <= 17 ? 500 : 600;
      return { ...slot, price };
    });
  }, [contextSlots]);

  // Filter out slots that are past according to selected date and current time
  const visibleSlots = useMemo(() => {
    return slots.filter((slot) => {
      const slotTime12h = formatTimeTo12Hour(slot.time);
      return !isPastSlot(slotTime12h, formData.date);
    });
  }, [slots, formData.date]);

  // Check if a slot is selected by user
  const isSlotSelected = (slotId) =>
    formData.selectedSlots.some((slot) => slot.id === slotId);

  // Calculate total price of selected slots
  const totalPrice = formData.selectedSlots.reduce(
    (sum, slot) => sum + slot.price,
    0
  );

  return (
    <>
      <style>{`
        .slot-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
          gap: 1rem;
        }
        .slot-card {
          background: #fff;
          border: 2px solid #dee2e6;
          border-radius: 12px;
          padding: 0.75rem;
          text-align: center;
          cursor: pointer;
          font-weight: 600;
          transition: 0.2s ease-in-out;
          box-shadow: 0 1px 6px rgba(0,0,0,0.05);
          user-select: none;
        }
        .slot-card:hover:not(.booked-slot):not(.selected-slot) {
          background: #f1f3f5;
        }
        .selected-slot {
          background: #d4edda;
          border-color: #28a745;
        }
        .booked-slot {
          background: #f8d7da;
          color: #721c24;
          border-color: #f5c6cb;
          cursor: not-allowed;
        }
        .price-tag {
          font-size: 0.75rem;
          margin-top: 0.25rem;
          color: #28a745;
        }
        .slot-status {
          font-size: 0.7rem;
          color: #6c757d;
        }
        .selected-slots-container {
          margin-top: 2rem;
          padding: 1rem;
          background: #fff;
          border: 1px solid #dee2e6;
          border-radius: 10px;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
        }
        .selected-slot-item {
          padding: 0.5rem;
          border-bottom: 1px solid #e9ecef;
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
        }
        .selected-slot-item:last-child {
          border-bottom: none;
        }
        .total-price {
          text-align: right;
          font-weight: bold;
          font-size: 1rem;
          margin-top: 1rem;
        }
      `}</style>

      <div className="slot-grid mt-3">
        {visibleSlots.length === 0 && (
          <div className="text-center w-100">
            No slots available for the selected date.
          </div>
        )}
        {visibleSlots.map((slot) => {
          const selected = isSlotSelected(slot.id);
          return (
            <div
              key={slot.id}
              tabIndex={slot.isAvailable ? 0 : -1}
              role="checkbox"
              aria-checked={selected}
              onClick={() => {
                if (!slot.isAvailable) return;
                selected ? deselectSlot(slot.id) : selectSlot(slot);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (!slot.isAvailable) return;
                  selected ? deselectSlot(slot.id) : selectSlot(slot);
                }
              }}
              className={`slot-card ${
                !slot.isAvailable
                  ? "booked-slot"
                  : selected
                  ? "selected-slot"
                  : ""
              }`}
            >
              <div>{formatTimeTo12Hour(slot.time)}</div>
              <div className="price-tag">₹{slot.price}</div>
              <div className="slot-status">
                {!slot.isAvailable
                  ? "Booked"
                  : selected
                  ? "Selected"
                  : "Available"}
              </div>
            </div>
          );
        })}
      </div>

      {formData.selectedSlots.length > 0 && (
        <div className="selected-slots-container mt-4">
          <h5>Selected Slots</h5>
          {formData.selectedSlots.map((slot) => (
            <div key={slot.id} className="selected-slot-item">
              <span>{formatTimeTo12Hour(slot.time)}</span>
              <span>₹{slot.price}</span>
            </div>
          ))}
          <div className="total-price">Total: ₹{totalPrice}</div>
        </div>
      )}
    </>
  );
};

export default SlotBooking;
