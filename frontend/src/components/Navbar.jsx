import { useState } from "react";
import { Button } from "@mui/material"; // Keep your MUI Button

const Navbar = () => {
  const [user, setUser] = useState(null); // Replace with your actual auth
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle functions
  const handleLogin = () => {
    // Add your login logic here
    setUser({ name: "Demo User" }); // For demo
  };

  const handleLogout = () => {
    // Add your logout logic here
    setUser(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text tracking-wide hover:scale-105 transition-transform duration-300 cursor-pointer">
            UNSAID
          </div>

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
                <Button
                  onClick={handleLogin}
                  className="!bg-blue-500 !text-white !font-medium !py-2 !px-4 !rounded-md !transition !duration-200 !shadow-sm hover:!bg-blue-600 !normal-case"
                >
                  Login
                </Button>
                <Button
                  href="/register"
                  className="!bg-green-50 !text-green-500 !font-medium !py-2 !px-4 !rounded-md !transition-all !duration-300 !border !border-transparent hover:!bg-green-100 hover:!border-green-500 hover:!shadow-sm hover:!scale-105 !normal-case"
                >
                  Register
                </Button>
              </>
            ) : (
              <Button
                onClick={handleLogout}
                className="!bg-red-500 !text-white !font-medium !py-2 !px-4 !rounded-md !transition !duration-200 !shadow-sm hover:!bg-red-600 !normal-case"
              >
                Log Out
              </Button>
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
                  href="#about"
                  className="block py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  About
                </a>
                <a
                  href="#how-it-works"
                  className="block py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  How It Works
                </a>
                <a
                  href="#safety"
                  className="block py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  Safety
                </a>
                <a
                  href="#faqs"
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
                  href="/progress"
                  className="block py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  My Progress
                </a>
                <a
                  href="/profile"
                  className="block py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  Profile
                </a>
              </>
            )}
            <div className="pt-4 flex flex-col space-y-2">
              {!user ? (
                <>
                  <Button
                    onClick={handleLogin}
                    className="!bg-blue-500 !text-white !font-medium !py-2 !normal-case !rounded-md !shadow-sm hover:!bg-blue-600 !w-full"
                  >
                    Login
                  </Button>
                  <Button
                    href="/register"
                    className="!bg-green-50 !text-green-500 !font-medium !py-2 !normal-case !rounded-md !border !border-transparent hover:!bg-green-100 hover:!border-green-500 !w-full"
                  >
                    Register
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleLogout}
                  className="!bg-red-500 !text-white !font-medium !py-2 !normal-case !rounded-md !shadow-sm hover:!bg-red-600 !w-full"
                >
                  Log Out
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
