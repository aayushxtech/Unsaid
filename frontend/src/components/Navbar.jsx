import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../supabaseClient";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  // eslint-disable-next-line no-unused-vars
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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text tracking-wide hover:scale-105 transition-transform duration-300 cursor-pointer">
              UNSAID
            </div>
          </a>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
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
                    className="text-gray-600 hover:text-gray-900 transition duration-200 font-medium"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="text-gray-600 hover:text-gray-900 transition duration-200 font-medium"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="/how-it-works"
                    className="text-gray-600 hover:text-gray-900 transition duration-200 font-medium"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="/safety"
                    className="text-gray-600 hover:text-gray-900 transition duration-200 font-medium"
                  >
                    Safety
                  </a>
                </li>
                <li>
                  <a
                    href="/faqs"
                    className="text-gray-600 hover:text-gray-900 transition duration-200 font-medium"
                  >
                    FAQs
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a
                    href="/dashboard"
                    className="text-gray-600 hover:text-gray-900 transition duration-200 font-medium"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/modules"
                    className="text-gray-600 hover:text-gray-900 transition duration-200 font-medium"
                  >
                    My Modules
                  </a>
                </li>
                <li>
                  <a
                    href="/ask"
                    className="text-gray-600 hover:text-gray-900 transition duration-200 font-medium"
                  >
                    Ask an Expert
                  </a>
                </li>
                <li>
                  <a
                    href="/posts"
                    className="text-gray-600 hover:text-gray-900 transition duration-200 font-medium"
                  >
                    Posts
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
                  className="bg-blue-500 text-white font-medium py-2 px-4 rounded-md transition duration-200 shadow-sm hover:bg-blue-600 normal-case"
                >
                  Login
                </button>
                <button
                  onClick={handleRegisterClick}
                  className="bg-green-50 text-green-500 font-medium py-2 px-4 rounded-md transition-all duration-300 border border-transparent hover:bg-green-100 hover:border-green-500 hover:shadow-sm hover:scale-105 normal-case"
                >
                  Register
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white font-medium py-2 px-4 rounded-md transition duration-200 shadow-sm hover:bg-red-600 normal-case"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {!user ? (
              <>
                <a
                  href="/"
                  className="block py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  Home
                </a>
                <a
                  href="/about"
                  className="block py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  About
                </a>
                <a
                  href="/how-it-works"
                  className="block py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  How It Works
                </a>
                <a
                  href="/safety"
                  className="block py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  Safety
                </a>
                <a
                  href="/faqs"
                  className="block py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  FAQs
                </a>
              </>
            ) : (
              <>
                <a
                  href="/dashboard"
                  className="block py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  Dashboard
                </a>
                <a
                  href="/modules"
                  className="block py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  My Modules
                </a>
                <a
                  href="/ask"
                  className="block py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  Ask an Expert
                </a>
                <a
                  href="/posts"
                  className="block py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  Posts
                </a>
              </>
            )}
            <div className="pt-4 flex flex-col space-y-2">
              {!user ? (
                <>
                  <button
                    onClick={handleLoginClick}
                    className="bg-blue-500 text-white font-medium py-2 normal-case rounded-md shadow-sm hover:bg-blue-600 w-full"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleRegisterClick}
                    className="bg-green-50 text-green-500 font-medium py-2 normal-case rounded-md border border-transparent hover:bg-green-100 hover:border-green-500 w-full text-center"
                  >
                    Register
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white font-medium py-2 normal-case rounded-md shadow-sm hover:bg-red-600 w-full"
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
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
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
