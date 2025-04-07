import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://simgrolveqxfxxffwqvt.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpbWdyb2x2ZXF4Znh4ZmZ3cXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMTI5NzgsImV4cCI6MjA1OTU4ODk3OH0.PpxYnAqhqLr7Yxx7S5N9GVR-XPHZf19UkZQccpvFTVc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: "public",
  },
});
