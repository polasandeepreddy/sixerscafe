import { getSupabase } from "./client"

export async function initializeDatabase() {
  const supabase = getSupabase()

  try {
    console.log("Checking if database table exists...")

    // Just check if the table exists
    const { data, error } = await supabase.from("cricket_bookings").select("id").limit(1)

    if (error) {
      console.error("Table check failed:", error)
      throw new Error(`Database table not properly set up. Please create it manually: ${JSON.stringify(error)}`)
    }

    console.log("Database table exists and is accessible")
    return { success: true }
  } catch (error) {
    console.error("Error initializing database:", error)
    return { success: false, error }
  }
}
