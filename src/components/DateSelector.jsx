// components/DateSelector.jsx
import React from "react";

const DateSelector = ({ dates = [], selectedDate, onSelectDate }) => {
  return (
    <div className="date-scroll d-flex gap-2 overflow-x-auto pb-2">
      {dates.map((dateStr) => {
        const dateObj = new Date(dateStr);
        const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
        const dayNumber = dateObj.getDate();
        const isSelected = selectedDate === dateStr;

        return (
          <button
            key={dateStr}
            type="button"
            onClick={() => onSelectDate(dateStr)}
            aria-pressed={isSelected}
            className={`border rounded px-3 py-2 text-center flex-shrink-0 min-w-[70px] cursor-pointer ${
              isSelected ? "bg-green-600 text-white" : "bg-white text-gray-800 border-green-600"
            }`}
          >
            <div className="text-xs">{dayName}</div>
            <div className="font-bold">{dayNumber}</div>
          </button>
        );
      })}
      <style jsx="true">{`
        .date-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .date-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .date-scroll::-webkit-scrollbar-thumb {
          background-color: #22c55e; /* Tailwind green-500 */
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default DateSelector;
