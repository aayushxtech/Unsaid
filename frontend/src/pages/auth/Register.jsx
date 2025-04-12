import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    parentalConsent: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [requiresGuardian, setRequiresGuardian] = useState(false);

  useEffect(() => {
    const today = new Date();
    setMaxDate(today.toISOString().split("T")[0]);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    if (name === "dateOfBirth") {
      const selectedDate = new Date(value);
      const today = new Date();

      if (selectedDate > today) {
        setError("Date of birth cannot be in the future");
        return;
      }

      const age = calculateAge(selectedDate);

      if (age < 13) {
        setRequiresGuardian(true);
        setError("");
      } else {
        setRequiresGuardian(false);
        setError("");
      }
    }

    setFormData({ ...formData, [name]: newValue });

    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const validateForm = () => {
    if (formData.password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }

    if (!formData.dateOfBirth) {
      setError("Date of birth is required");
      return false;
    }

    const birthDate = new Date(formData.dateOfBirth);
    const age = calculateAge(birthDate);

    if (age < 13 && !formData.parentalConsent) {
      setError("Parental consent is required for users under 13");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPasswordError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log("Starting registration process for:", formData.email);

      // 1. Register with Supabase Auth - only email and password initially
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (signUpError) {
        console.error("Sign up error:", signUpError);
        throw signUpError;
      }

      if (!data?.user?.id) {
        throw new Error("No user data returned from signup");
      }

      console.log("User created successfully:", data.user.id);

      // 2. Wait a moment before trying to create the profile
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 3. Try to create or update profile using upsert
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: data.user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          date_of_birth: formData.dateOfBirth,
          under_thirteen: requiresGuardian,
          parental_consent: requiresGuardian ? formData.parentalConsent : false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "id",
          ignoreDuplicates: false,
        }
      );

      if (profileError) {
        console.warn("Profile creation/update error:", profileError);
        // Log more details for debugging
        console.log(
          "Attempted to create/update profile for user:",
          data.user.id
        );
        // Don't throw, continue with registration
      }

      // 4. Store minimal user data in localStorage
      const userProfile = {
        id: data.user.id,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
      };

      localStorage.setItem("user", JSON.stringify(userProfile));

      // 5. Show success message and navigate
      alert(
        "Registration successful! Please check your email to verify your account."
      );
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.message.includes("already registered")
          ? "This email is already registered. Please try logging in."
          : "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-2">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-4 px-6">
          <h2 className="text-xl font-bold text-white text-center">
            Create Your Account
          </h2>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                max={maxDate}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <p className="text-xs text-gray-500">
                Providing your actual date of birth helps us provide appropriate
                content.
              </p>
            </div>

            {requiresGuardian && (
              <div className="p-4 border border-blue-200 bg-blue-50 rounded-md">
                <div className="flex items-start space-x-2">
                  <input
                    id="parentalConsent"
                    name="parentalConsent"
                    type="checkbox"
                    checked={formData.parentalConsent}
                    onChange={handleChange}
                    required={requiresGuardian}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                  />
                  <div>
                    <label
                      htmlFor="parentalConsent"
                      className="block text-sm font-medium text-blue-700"
                    >
                      Parental Consent Required
                    </label>
                    <p className="text-xs text-gray-600 mt-1">
                      I confirm that I have my parent or guardian's permission
                      to use this platform, and they are aware of and consent to
                      my registration and use of UNSAID.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password (min. 8 characters)"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              {passwordError && (
                <p className="text-xs text-red-500">{passwordError}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-600"
                >
                  I agree to the{" "}
                  <a
                    href="/terms"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-md transition duration-200 shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <div className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
