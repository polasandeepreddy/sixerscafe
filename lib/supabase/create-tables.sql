-- Create slots table if it doesn't exist
CREATE TABLE IF NOT EXISTS slots (
  id TEXT PRIMARY KEY,
  time TEXT NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  price INTEGER NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table if it doesn't exist
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payment_status TEXT DEFAULT 'pending',
  payment_screenshot TEXT,
  total_amount INTEGER NOT NULL
);

-- Create booking_slots table if it doesn't exist
CREATE TABLE IF NOT EXISTS booking_slots (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL,
  slot_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_slots_date ON slots(date);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_booking_slots_booking_id ON booking_slots(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_slots_slot_id ON booking_slots(slot_id);
