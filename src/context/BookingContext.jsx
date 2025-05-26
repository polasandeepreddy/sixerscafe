"use client";

import { createContext, useState, useContext, useEffect, useCallback, useMemo } from "react";
import { generateSlotsForDate, generateAvailableDates } from "../utils/mockData";
import { format } from "../utils/dateUtils";
import { getSupabase } from "../lib/supabase/client";
import { v4 as uuidv4 } from "uuid";

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  // Available dates (e.g. next 7 days)
  const [availableDates] = useState(generateAvailableDates());

  // Consistent initial date for form and resetting
  const initialDate = availableDates[0] || format(new Date());

  // Raw slot data (all slots generated for selected date)
  const [rawSlots, setRawSlots] = useState([]);

  // All bookings fetched from DB or empty if mock mode
  const [bookings, setBookings] = useState([]);

  // Loading state for fetching data
  const [isLoading, setIsLoading] = useState(true);

  // Flag to know if DB has any data, else use mock data
  const [databaseInitialized, setDatabaseInitialized] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    date: initialDate,
    selectedSlots: [],
  });

  // Function to determine price per slot by time string (e.g. "6:00 PM")
  const getSlotPrice = (slotTimeStr) => {
    if (!slotTimeStr) return 600;
    const [time, meridian] = slotTimeStr.split(" ");
    let [hours] = time.split(":").map(Number);
    if (meridian === "PM" && hours !== 12) hours += 12;
    if (meridian === "AM" && hours === 12) hours = 0;
    // Price: 6AM-5PM => 500, else 600
    return hours >= 6 && hours < 17 ? 500 : 600;
  };

  // Calculate total amount based on selected slots
  const totalAmount = useMemo(() => {
    return formData.selectedSlots.reduce((sum, slot) => sum + getSlotPrice(slot.time), 0);
  }, [formData.selectedSlots]);

  // Check if database is initialized (has any booking rows)
  const checkDatabaseInitialized = useCallback(async () => {
    try {
      const { data, error } = await getSupabase().from("cricket_bookings").select("id").limit(1);
      const initialized = !error && data && data.length > 0;
      setDatabaseInitialized(initialized);

      if (!initialized) {
        console.log("Database not initialized. Using mock data.");
        const mockSlots = generateSlotsForDate(initialDate);
        setRawSlots(mockSlots);
        setBookings([]);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Database check failed:", err);
      setDatabaseInitialized(false);
      const mockSlots = generateSlotsForDate(initialDate);
      setRawSlots(mockSlots);
      setBookings([]);
      setIsLoading(false);
    }
  }, [initialDate]);

  // Fetch slots for a given date and mark availability based on bookings
  const fetchSlotsForDate = useCallback(
    async (date) => {
      if (!databaseInitialized) {
        setRawSlots(generateSlotsForDate(date));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data: bookingsData, error } = await getSupabase()
          .from("cricket_bookings")
          .select("slots")
          .eq("date", date)
          .neq("payment_status", "rejected");

        const generatedSlots = generateSlotsForDate(date);

        if (error || !bookingsData) {
          setRawSlots(generatedSlots);
          return;
        }

        // Just set rawSlots as generated, availability will be handled later in memo
        setRawSlots(generatedSlots);
      } catch (err) {
        console.error("Error fetching slots:", err);
        setRawSlots(generateSlotsForDate(date));
      } finally {
        setIsLoading(false);
      }
    },
    [databaseInitialized]
  );

  // Fetch all bookings from DB
  const fetchBookings = useCallback(async () => {
    if (!databaseInitialized) {
      setBookings([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await getSupabase()
        .from("cricket_bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mapped = data.map((booking) => ({
        id: booking.id,
        fullName: booking.full_name,
        mobileNumber: booking.mobile_number,
        date: booking.date,
        slots: Array.isArray(booking.slots) ? booking.slots : [],
        createdAt: booking.created_at,
        paymentStatus: booking.payment_status,
        paymentScreenshot: booking.payment_screenshot,
        totalAmount: booking.total_amount,
      }));

      setBookings(mapped);
      console.log("Fetched bookings:", mapped);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setIsLoading(false);
    }
  }, [databaseInitialized]);

  // Update form data, reset selectedSlots if date changes
  const updateFormData = useCallback((data) => {
    setFormData((prev) => {
      const updated = { ...prev, ...data };
      if (data.date && data.date !== prev.date) {
        updated.selectedSlots = [];
      }
      return updated;
    });
  }, []);

  // Combine rawSlots + bookings to finalize availability for selected date
  const slots = useMemo(() => {
    if (!databaseInitialized) return rawSlots;

    const bookedSlotIds = new Set();
    bookings.forEach((booking) => {
      if (booking.date === formData.date && booking.paymentStatus !== "rejected") {
        booking.slots.forEach((slot) => bookedSlotIds.add(slot.id));
      }
    });

    return rawSlots.map((slot) => ({
      ...slot,
      isAvailable: !bookedSlotIds.has(slot.id),
    }));
  }, [rawSlots, bookings, formData.date, databaseInitialized]);

  // Select a slot (if available)
  const selectSlot = useCallback((slot) => {
    if (!slot.isAvailable) return;
    setFormData((prev) => {
      const exists = prev.selectedSlots.some((s) => s.id === slot.id);
      if (exists) return prev;
      return { ...prev, selectedSlots: [...prev.selectedSlots, slot] };
    });
  }, []);

  // Deselect a slot by id
  const deselectSlot = useCallback((slotId) => {
    setFormData((prev) => ({
      ...prev,
      selectedSlots: prev.selectedSlots.filter((slot) => slot.id !== slotId),
    }));
  }, []);

  // Reset booking form (resets date to initialDate for consistency)
  const resetBooking = useCallback(() => {
    setFormData({
      fullName: "",
      mobileNumber: "",
      date: initialDate,
      selectedSlots: [],
    });
  }, [initialDate]);

  // Add booking to DB with optional payment screenshot
  const addBooking = useCallback(
    async ({ paymentScreenshot }) => {
      if (formData.selectedSlots.length === 0) {
        console.warn("No slots selected. Cannot add booking.");
        return;
      }

      const bookingId = uuidv4();
      const newBooking = {
        id: bookingId,
        full_name: formData.fullName,
        mobile_number: formData.mobileNumber,
        date: formData.date,
        slots: formData.selectedSlots,
        created_at: new Date().toISOString(),
        payment_status: "pending",
        payment_screenshot: paymentScreenshot || null,
        total_amount: totalAmount,
      };

      try {
        const { error } = await getSupabase().from("cricket_bookings").insert(newBooking);
        if (error) throw error;

        console.log("Booking added:", newBooking);
        await fetchBookings();
        return bookingId; // Return booking ID for confirmation screen
      } catch (err) {
        console.error("Error adding booking:", err);
        throw err;
      }
    },
    [formData, totalAmount, fetchBookings]
  );

  // Update payment status for a booking by id
  const updateBookingStatus = useCallback(
    async (id, status) => {
      try {
        const { error } = await getSupabase()
          .from("cricket_bookings")
          .update({ payment_status: status })
          .eq("id", id);
        if (error) throw error;
        await fetchBookings();
      } catch (err) {
        console.error("Error updating booking status:", err);
      }
    },
    [fetchBookings]
  );

  // Approve booking (wrapper for updateBookingStatus with "approved")
  const approveBooking = useCallback(
    async (bookingId) => {
      try {
        const { error } = await getSupabase()
          .from("cricket_bookings")
          .update({ payment_status: "approved" })
          .eq("id", bookingId);
        if (error) throw error;
        await fetchBookings();
      } catch (err) {
        console.error("Error approving booking:", err);
      }
    },
    [fetchBookings]
  );

  // *** NEW FUNCTION TO REMOVE BOOKING BY ID ***
  const removeBooking = useCallback(
    async (id) => {
      try {
        const { error } = await getSupabase()
          .from("cricket_bookings")
          .delete()
          .eq("id", id);

        if (error) throw error;

        console.log("Booking removed:", id);
        await fetchBookings();
      } catch (err) {
        console.error("Error removing booking:", err);
        throw err;
      }
    },
    [fetchBookings]
  );

  // Initialization: check DB on mount
  useEffect(() => {
    checkDatabaseInitialized();
  }, [checkDatabaseInitialized]);

  // Fetch slots and bookings when DB initialized or date changes
  useEffect(() => {
    if (databaseInitialized) {
      fetchSlotsForDate(formData.date);
      fetchBookings();
    }
  }, [databaseInitialized, formData.date, fetchSlotsForDate, fetchBookings]);

  // Setup real-time subscription to booking inserts and updates
  useEffect(() => {
    if (!databaseInitialized) return;

    const supabase = getSupabase();
    const channel = supabase
      .channel("booking_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cricket_bookings" },
        (payload) => {
          console.log("Real-time booking change detected:", payload);
          fetchBookings();
          fetchSlotsForDate(formData.date);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [databaseInitialized, fetchBookings, fetchSlotsForDate, formData.date]);

  return (
    <BookingContext.Provider
      value={{
        availableDates,
        formData,
        updateFormData,
        slots,
        selectSlot,
        deselectSlot,
        resetBooking,
        addBooking,
        isLoading,
        bookings,
        fetchBookings,
        databaseInitialized,
        initializeDatabase: checkDatabaseInitialized,
        updateBookingStatus,
        approveBooking,
        removeBooking, // <-- PROVIDE THE NEW FUNCTION HERE
        totalAmount,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within BookingProvider");
  }
  return context;
};
