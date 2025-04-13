/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../supabaseClient";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { user, signOut } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleLoginPopup = () => {
    setShowLoginPopup(!showLoginPopup);
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLogout = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // Clear any user-related data from local storage
      localStorage.clear();

      // Close mobile menu if open
      setMobileMenuOpen(false);

      // Reset any user-specific state
      if (toggleLoginPopup) {
        setShowLoginPopup(false);
      }

      // Navigate to home page
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error.message);
      // Optionally show error to user via toast/alert
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-blue-50 shadow-lg rounded-b-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <div className="flex items-center">
              {/* Cartoon character icon/mascot could be added here */}
              <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text tracking-wide hover:scale-105 transition-transform duration-300 cursor-pointer">
                UNSAID
              </div>
            </div>
          </a>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-purple-600 hover:text-purple-800 focus:outline-none bg-purple-100 p-2 rounded-full"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    mobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>

          {/* Navigation Links - Desktop */}
          <ul className="hidden md:flex space-x-6">
            {!user ? (
              <>
                <li>
                  <a
                    href="/"
                    className="text-purple-600 hover:text-purple-800 transition duration-200 font-medium text-lg rounded-full px-3 py-1 hover:bg-purple-100"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="text-purple-600 hover:text-purple-800 transition duration-200 font-medium text-lg rounded-full px-3 py-1 hover:bg-purple-100"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/how-it-works"
                    className="text-purple-600 hover:text-purple-800 transition duration-200 font-medium text-lg rounded-full px-3 py-1 hover:bg-purple-100"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="/safety"
                    className="text-purple-600 hover:text-purple-800 transition duration-200 font-medium text-lg rounded-full px-3 py-1 hover:bg-purple-100"
                  >
                    Safety Zone
                  </a>
                </li>
                <li>
                  <a
                    href="/faqs"
                    className="text-purple-600 hover:text-purple-800 transition duration-200 font-medium text-lg rounded-full px-3 py-1 hover:bg-purple-100"
                  >
                    Help & FAQs
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a
                    href="/modules"
                    className="text-purple-600 hover:text-purple-800 transition duration-200 font-medium text-lg rounded-full px-3 py-1 hover:bg-purple-100"
                  >
                    My Learning
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard"
                    className="text-purple-600 hover:text-purple-800 transition duration-200 font-medium text-lg rounded-full px-3 py-1 hover:bg-purple-100"
                  >
                    My Space
                  </a>
                </li>
                <li>
                  <a
                    href="/ask"
                    className="text-purple-600 hover:text-purple-800 transition duration-200 font-medium text-lg rounded-full px-3 py-1 hover:bg-purple-100"
                  >
                    Ask a Grown-up
                  </a>
                </li>
                <li>
                  <a
                    href="/posts"
                    className="text-purple-600 hover:text-purple-800 transition duration-200 font-medium text-lg rounded-full px-3 py-1 hover:bg-purple-100"
                  >
                    Share & Learn
                  </a>
                </li>
                <li>
                  <a
                    href="/games"
                    className="text-purple-600 hover:text-purple-800 transition duration-200 font-medium text-lg rounded-full px-3 py-1 hover:bg-purple-100"
                  >
                    Fun Games
                  </a>
                </li>
              </>
            )}
          </ul>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {!user ? (
              <>
                <button
                  onClick={handleLoginClick}
                  className="bg-yellow-400 text-purple-700 font-bold py-2 px-4 rounded-full transition duration-200 shadow-md hover:bg-yellow-300 hover:shadow-lg hover:scale-105 text-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={handleRegisterClick}
                  className="bg-pink-500 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:bg-pink-400 hover:shadow-lg hover:scale-105 text-lg"
                >
                  Join Us
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-orange-400 text-white font-bold py-2 px-4 rounded-full transition duration-200 shadow-md hover:bg-orange-300 hover:shadow-lg text-lg"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-50 border-t border-purple-100 shadow-lg rounded-b-xl">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {!user ? (
              <>
                <a
                  href="/"
                  className="block py-3 px-4 text-purple-600 hover:text-purple-800 font-medium text-lg rounded-xl hover:bg-purple-100"
                >
                  Home
                </a>
                <a
                  href="/about"
                  className="block py-3 px-4 text-purple-600 hover:text-purple-800 font-medium text-lg rounded-xl hover:bg-purple-100"
                >
                  About Us
                </a>
                <a
                  href="/how-it-works"
                  className="block py-3 px-4 text-purple-600 hover:text-purple-800 font-medium text-lg rounded-xl hover:bg-purple-100"
                >
                  How It Works
                </a>
                <a
                  href="/safety"
                  className="block py-3 px-4 text-purple-600 hover:text-purple-800 font-medium text-lg rounded-xl hover:bg-purple-100"
                >
                  Safety Zone
                </a>
                <a
                  href="/faqs"
                  className="block py-3 px-4 text-purple-600 hover:text-purple-800 font-medium text-lg rounded-xl hover:bg-purple-100"
                >
                  Help & FAQs
                </a>
              </>
            ) : (
              <>
                <a
                  href="/dashboard"
                  className="block py-3 px-4 text-purple-600 hover:text-purple-800 font-medium text-lg rounded-xl hover:bg-purple-100"
                >
                  My Space
                </a>
                <a
                  href="/modules"
                  className="block py-3 px-4 text-purple-600 hover:text-purple-800 font-medium text-lg rounded-xl hover:bg-purple-100"
                >
                  My Learning
                </a>
                <a
                  href="/ask"
                  className="block py-3 px-4 text-purple-600 hover:text-purple-800 font-medium text-lg rounded-xl hover:bg-purple-100"
                >
                  Ask a Grown-up
                </a>
                <a
                  href="/posts"
                  className="block py-3 px-4 text-purple-600 hover:text-purple-800 font-medium text-lg rounded-xl hover:bg-purple-100"
                >
                  Share & Learn
                </a>
                <a
                  href="/games"
                  className="block py-3 px-4 text-purple-600 hover:text-purple-800 font-medium text-lg rounded-xl hover:bg-purple-100"
                >
                  Fun Games
                </a>
              </>
            )}
            <div className="pt-4 flex flex-col space-y-3">
              {!user ? (
                <>
                  <button
                    onClick={handleLoginClick}
                    className="bg-yellow-400 text-purple-700 font-bold py-3 rounded-xl shadow-md hover:bg-yellow-300 hover:shadow-lg text-lg"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleRegisterClick}
                    className="bg-pink-500 text-white font-bold py-3 rounded-xl shadow-md hover:bg-pink-400 hover:shadow-lg text-lg"
                  >
                    Join Us
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="bg-orange-400 text-white font-bold py-3 rounded-xl shadow-md hover:bg-orange-300 hover:shadow-lg text-lg"
                >
                  Log Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full relative">
            <button
              onClick={toggleLoginPopup}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <Login onClose={toggleLoginPopup} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
