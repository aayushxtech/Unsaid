import { supabase } from "../supabaseClient";

/**
 * Updates a user's profile in the profiles table
 * @param {Object} userData - User data to update
 * @returns {Promise} - Result of the profile update
 */
export const updateUserProfile = async (userData) => {
  try {
    const {
      id,
      firstName,
      lastName,
      email,
      dateOfBirth,
      underThirteen,
      parentalConsent,
    } = userData;

    if (!id) {
      throw new Error("User ID is required");
    }

    // Check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is "no rows returned" error
      console.error("Error checking existing profile:", fetchError);
      throw fetchError;
    }

    // If profile exists, update it; otherwise insert new profile
    const operation = existingProfile ? "update" : "insert";

    let query;
    if (operation === "update") {
      query = supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          email: email,
          date_of_birth: dateOfBirth,
          under_thirteen: underThirteen,
          parental_consent: parentalConsent,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
    } else {
      query = supabase.from("profiles").insert([
        {
          id,
          first_name: firstName,
          last_name: lastName,
          email: email,
          date_of_birth: dateOfBirth,
          under_thirteen: underThirteen,
          parental_consent: parentalConsent,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error ${operation}ing profile:`, error);
      throw error;
    }

    console.log(`Profile ${operation}d successfully`);
    return { data, error: null };
  } catch (err) {
    console.error("Error in updateUserProfile:", err);
    return { data: null, error: err };
  }
};
