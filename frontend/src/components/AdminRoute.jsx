import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../supabaseClient";

const AdminRoute = ({ children }) => {
  const { user, loading, sessionChecked } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        // Check user role in profiles table
        const { data: userData, error: userError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (userError) {
          console.error("Error checking admin status:", userError);
          navigate("/");
          return;
        }

        if (userData?.role !== "admin") {
          console.log("User is not an admin");
          navigate("/");
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error("Error in admin check:", error);
        navigate("/");
      } finally {
        setCheckingRole(false);
      }
    };

    if (sessionChecked && !loading) {
      checkAdminAccess();
    }
  }, [user, loading, sessionChecked, navigate]);

  if (loading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-indigo-600 font-medium">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return isAdmin ? children : null;
};

export default AdminRoute;
