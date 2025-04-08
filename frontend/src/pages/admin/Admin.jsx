import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

import Navbar from "./Navbar";

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        // Check if user is authenticated
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          throw new Error("Authentication error. Please log in again.");
        }

        if (!session) {
          navigate("/login");
          return;
        }

        console.log("User authenticated:", session.user.id);

        // Try to fetch from profiles table instead of users
        // Many Supabase applications use 'profiles' as the table name
        const { data: userData, error: userError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        // If profiles table doesn't work, try the original users table with better error logging
        if (userError) {
          console.error("Error fetching from profiles:", userError);

          // Attempt with users table as fallback
          const { data: fallbackData, error: fallbackError } = await supabase
            .from("users")
            .select("role")
            .eq("id", session.user.id)
            .single();

          if (fallbackError) {
            console.error("Error fetching from users:", fallbackError);
            throw new Error(
              "Failed to fetch user data. Please contact support."
            );
          }

          if (!fallbackData) {
            throw new Error("User profile not found.");
          }

          if (fallbackData.role !== "admin") {
            throw new Error("You do not have admin access.");
          }
        } else {
          // If profiles table worked
          if (!userData) {
            throw new Error("User profile not found.");
          }

          if (userData.role !== "admin") {
            throw new Error("You do not have admin access.");
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Admin access check failed:", error);
        setError(error.message);
        setLoading(false);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    };
    checkAdminAccess();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-xl mb-2">Loading...</p>
          <p>Checking admin credentials</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-2">{error}</p>
          <p>Redirecting to home page in 3 seconds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-4 rounded shadow">
        <Navbar />
        {/* Admin content goes here */}
      </div>
    </div>
  );
};

export default Admin;
