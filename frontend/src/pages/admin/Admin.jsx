import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Navbar from "./Navbar";
import SideNav from "./SideNav";

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

        // Try to fetch from profiles table
        const { data: userData, error: userError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        // If profiles table doesn't work, try the users table as fallback
        if (userError) {
          console.error("Error fetching from profiles:", userError);

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
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="animate-spin mb-4 mx-auto h-12 w-12 border-t-2 border-b-2 border-indigo-500 rounded-full"></div>
          <p className="text-xl font-semibold mb-2">Loading...</p>
          <p className="text-gray-600">Checking admin credentials</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-500 mb-4">
            <svg
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-xl font-semibold text-red-500 mb-2">{error}</p>
          <p className="text-gray-600">
            Redirecting to home page in 3 seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <SideNav section="dashboard" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                Admin Dashboard
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-indigo-50 p-5 rounded-lg shadow-sm border border-indigo-100">
                  <h2 className="text-lg font-medium text-indigo-700 mb-2">
                    Content Management
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Manage topics and learning materials
                  </p>
                  <a
                    href="/admin/content"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    View Content
                  </a>
                </div>

                <div className="bg-indigo-50 p-5 rounded-lg shadow-sm border border-indigo-100">
                  <h2 className="text-lg font-medium text-indigo-700 mb-2">
                    Quiz Management
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Create and manage quizzes
                  </p>
                  <a
                    href="/admin/quizzes"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    View Quizzes
                  </a>
                </div>

                <div className="bg-indigo-50 p-5 rounded-lg shadow-sm border border-indigo-100">
                  <h2 className="text-lg font-medium text-indigo-700 mb-2">
                    Community Posts
                  </h2>
                  <p className="text-gray-600 mb-4">Moderate user posts</p>
                  <a
                    href="/admin/posts"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    View Posts
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
