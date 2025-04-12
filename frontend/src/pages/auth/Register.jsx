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
        setError("Oops! Your birthday can't be in the future");
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
      setPasswordError(
        "Your secret password needs to be at least 8 characters long"
      );
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Oops! Your passwords don't match");
      return false;
    }

    if (!formData.dateOfBirth) {
      setError("Please tell us your birthday");
      return false;
    }

    const birthDate = new Date(formData.dateOfBirth);
    const age = calculateAge(birthDate);

    if (age < 13 && !formData.parentalConsent) {
      setError("Please ask a grown-up for permission first");
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
        console.log(
          "Attempted to create/update profile for user:",
          data.user.id
        );
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
        "Hooray! Your account is created! Please check your email to verify your account."
      );
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.message.includes("already registered")
          ? "This email is already being used. Maybe try logging in instead?"
          : "Oops! Something went wrong. Can you try again?"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md mx-auto border-4 border-yellow-400">
        <div className="bg-gradient-to-r from-blue-400 to-purple-400 py-6 px-6 relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.floor(Math.random() * 10) + 5}px`,
                  height: `${Math.floor(Math.random() * 10) + 5}px`,
                  top: `${Math.floor(Math.random() * 100)}%`,
                  left: `${Math.floor(Math.random() * 100)}%`,
                }}
              />
            ))}
          </div>
          <h2 className="text-2xl font-bold text-white text-center">
            Join Our Adventure!
          </h2>
          <p className="text-center text-white mt-1">
            Let's create your explorer profile
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm border-2 border-red-200 flex items-center">
              <span className="text-xl mr-2">😕</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="text-base font-medium text-gray-700 flex items-center"
                >
                  <span className="mr-2">👤</span> First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Your first name"
                  required
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="block text-base font-medium text-gray-700 flex items-center"
                >
                  <span className="mr-2">👤</span> Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Your last name"
                  required
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-base font-medium text-gray-700 flex items-center"
              >
                <span className="mr-2">✉️</span> Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email address"
                required
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="dateOfBirth"
                className="block text-base font-medium text-gray-700 flex items-center"
              >
                <span className="mr-2">🎂</span> Your Birthday
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                max={maxDate}
                required
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base"
              />
              <p className="text-xs text-gray-500 ml-6">
                We need to know your real birthday to make sure you get the
                right content!
              </p>
            </div>

            {requiresGuardian && (
              <div className="p-4 border-2 border-blue-200 bg-blue-50 rounded-xl">
                <div className="flex items-start space-x-2">
                  <input
                    id="parentalConsent"
                    name="parentalConsent"
                    type="checkbox"
                    checked={formData.parentalConsent}
                    onChange={handleChange}
                    required={requiresGuardian}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                  />
                  <div>
                    <label
                      htmlFor="parentalConsent"
                      className=" text-base font-medium text-blue-700 flex items-center"
                    >
                      <span className="mr-2">👨‍👩‍👧‍👦</span> Parent Permission
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      I have asked an adult for permission to join, and they
                      said it's okay!
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-base font-medium text-gray-700 flex items-center"
              >
                <span className="mr-2">🔑</span> Secret Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a secret password (8+ characters)"
                required
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-base font-medium text-gray-700 flex items-center"
              >
                <span className="mr-2">🔐</span> Confirm Secret Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Type your password again"
                required
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base"
              />
              {passwordError && (
                <p className="text-sm text-red-500 flex items-center">
                  <span className="text-xl mr-2">😕</span> {passwordError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-start bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I promise to follow the{" "}
                  <a
                    href="/terms"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Explorer Rules
                  </a>{" "}
                  and I understand the{" "}
                  <a
                    href="/privacy"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-800 font-bold py-3 px-6 rounded-xl transition duration-200 shadow-md hover:shadow-lg transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 text-lg mt-4"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-800"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating your profile...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-2">🚀</span> Start My Adventure!
                </span>
              )}
            </button>

            <div className="text-center text-gray-600 mt-4">
              Already an explorer?{" "}
              <a
                href="/login"
                className="text-blue-500 hover:text-blue-400 font-medium"
              >
                Login here!
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
