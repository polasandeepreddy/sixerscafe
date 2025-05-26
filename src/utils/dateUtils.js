/**
 * Formats a Date object into "YYYY-MM-DD" string (ISO date).
 * @param {Date} date
 * @returns {string}
 */
export const format = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

/**
 * Adds a given number of days to a Date and returns a new Date.
 * @param {Date} date - Original date
 * @param {number} days - Days to add
 * @returns {Date}
 */
export const addDays = (date, days) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) return new Date();
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Formats a date string like "2025-05-22" to "DD-MM-YY".
 * Example input: "2025-05-22" → "22-05-25"
 * @param {string} isoDate
 * @returns {string}
 */
export const formatDisplayDate = (isoDate) => {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}-${month}-${year.slice(2)}`;
};

/**
 * Converts 24-hour time (e.g., "17:00") to 12-hour format with AM/PM.
 * Example output: "5:00 PM"
 * @param {string} time - Time string in "HH:MM" format
 * @returns {string}
 */
export const formatTime12Hour = (time) => {
  if (typeof time !== "string") return "";
  const [hourStr, minuteStr] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (isNaN(hour) || isNaN(minute)) return time;

  const date = new Date();
  date.setHours(hour, minute, 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Formats an ISO date-time string (e.g., "2025-05-26T08:15:00.000Z")
 * to "Monday, 26 May 2025 1:45 PM"
 * @param {string} isoString
 * @returns {string}
 */
export const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  const datePart = date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${datePart} ${timePart}`;
};
