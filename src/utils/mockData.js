// src/utils/mockData.js

import { format, addDays } from "./dateUtils";

/**
 * Generate 24 hourly slots starting from 12:00 AM of the selected date
 * to 11:00 PM of the next date.
 *
 * Pricing:
 * - ₹500 from 06:00 to 16:59
 * - ₹600 otherwise
 *
 * @param {string} date - in yyyy-MM-dd format
 * @returns {Array} slots
 */
export const generateSlotsForDate = (date) => {
  const slots = [];
  const baseDate = new Date(date);

  const formatHour = (hour) => `${hour.toString().padStart(2, "0")}:00`;

  for (let i = 0; i < 24; i++) {
    const slotDate = i < 24 ? baseDate : addDays(baseDate, 1);
    const hour = i;
    const actualDate = new Date(slotDate);
    actualDate.setHours(hour);

    const timeString = formatHour(hour);
    const slotDateString = format(actualDate);

    // ₹500 for 06:00 to 16:59, else ₹600
    const price = hour >= 6 && hour < 17 ? 500 : 600;

    slots.push({
      id: `${slotDateString}-${timeString}`,
      time: timeString,
      isAvailable: true,
      price,
      date: slotDateString,
    });
  }

  return slots;
};

/**
 * Generate the next 7 dates starting from today in "yyyy-MM-dd" format.
 * @returns {string[]} List of date strings
 */
export const generateAvailableDates = () => {
  const dates = [];
  for (let i = 0; i < 14; i++) {
    dates.push(format(addDays(new Date(), i)));
  }
  return dates;
};
