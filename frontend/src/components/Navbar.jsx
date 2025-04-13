/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../supabaseClient";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const dropdownRef = useRef(null);
  const [profile, setProfile] = useState(null);

  // Handle scrolling effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch profile data when user changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from("profiles")
          .select("first_name")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
        } else {
          setProfile(data);
        }
      }
    };

    fetchProfile();
  }, [user]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleLoginPopup = () => {
    setShowLoginPopup(!showLoginPopup);
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
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

      // Close dropdowns and menus
      setShowUserDropdown(false);
      setMobileMenuOpen(false);

      // Clear any user-related data from local storage
      localStorage.clear();

      // Navigate to home page
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg py-3" : "bg-blue-50 py-4"
      } rounded-b-lg`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo with animation */}
          <a href="/" className="flex items-center group">
            <div className="flex items-center">
              <div className="relative">
                <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text tracking-wide transition-all duration-300 group-hover:scale-110">
                  UNSAID
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 filter blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 rounded-full scale-110"></div>
              </div>
            </div>
          </a>

          {/* Mobile menu button with animation */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-purple-600 hover:text-purple-800 focus:outline-none bg-purple-100 p-2 rounded-full transition-all duration-300 hover:shadow-md hover:bg-purple-200"
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

          {/* Navigation Links - Desktop with improved hover effects and spacing */}
          <ul className="hidden md:flex space-x-4 mx-4">
            {!user ? (
              <>
                <li className="mx-1">
                  <a
                    href="/"
                    className="text-purple-600 hover:text-purple-800 transition-all duration-300 font-medium text-lg rounded-full px-4 py-2 hover:bg-purple-100 inline-block relative group"
                  >
                    <span>Home</span>
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-purple-500 group-hover:w-4/5 group-hover:left-1/2 group-hover:-translate-x-1/2 transition-all duration-300"></span>
                  </a>
                </li>
                <li className="mx-1">
                  <a
                    href="/about"
                    className="text-purple-600 hover:text-purple-800 transition-all duration-300 font-medium text-lg rounded-full px-4 py-2 hover:bg-purple-100 inline-block relative group"
                  >
                    <span>About Us</span>
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-purple-500 group-hover:w-4/5 group-hover:left-1/2 group-hover:-translate-x-1/2 transition-all duration-300"></span>
                  </a>
                </li>
                <li className="mx-1">
                  <a
                    href="/how-it-works"
                    className="text-purple-600 hover:text-purple-800 transition-all duration-300 font-medium text-lg rounded-full px-4 py-2 hover:bg-purple-100 inline-block relative group"
                  >
                    <span>How It Works</span>
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-purple-500 group-hover:w-4/5 group-hover:left-1/2 group-hover:-translate-x-1/2 transition-all duration-300"></span>
                  </a>
                </li>
                <li className="mx-1">
                  <a
                    href="/safety"
                    className="text-purple-600 hover:text-purple-800 transition-all duration-300 font-medium text-lg rounded-full px-4 py-2 hover:bg-purple-100 inline-block relative group"
                  >
                    <span>Safety Zone</span>
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-purple-500 group-hover:w-4/5 group-hover:left-1/2 group-hover:-translate-x-1/2 transition-all duration-300"></span>
                  </a>
                </li>
                <li className="mx-1">
                  <a
                    href="/faqs"
                    className="text-purple-600 hover:text-purple-800 transition-all duration-300 font-medium text-lg rounded-full px-4 py-2 hover:bg-purple-100 inline-block relative group"
                  >
                    <span>Help & FAQs</span>
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-purple-500 group-hover:w-4/5 group-hover:left-1/2 group-hover:-translate-x-1/2 transition-all duration-300"></span>
                  </a>
                </li>
              </>
            ) : (
              <>
                <li className="mx-1">
                  <a
                    href="/modules"
                    className="text-purple-600 hover:text-purple-800 transition-all duration-300 font-medium text-lg rounded-full px-4 py-2 hover:bg-purple-100 inline-block relative group"
                  >
                    <span className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.168 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                      </svg>
                      My Learning
                    </span>
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-purple-500 group-hover:w-4/5 group-hover:left-1/2 group-hover:-translate-x-1/2 transition-all duration-300"></span>
                  </a>
                </li>
                <li className="mx-1">
                  <a
                    href="/dashboard"
                    className="text-purple-600 hover:text-purple-800 transition-all duration-300 font-medium text-lg rounded-full px-4 py-2 hover:bg-purple-100 inline-block relative group"
                  >
                    <span className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                      </svg>
                      My Space
                    </span>
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-purple-500 group-hover:w-4/5 group-hover:left-1/2 group-hover:-translate-x-1/2 transition-all duration-300"></span>
                  </a>
                </li>
                <li className="mx-1">
                  <a
                    href="/ask"
                    className="text-purple-600 hover:text-purple-800 transition-all duration-300 font-medium text-lg rounded-full px-4 py-2 hover:bg-purple-100 inline-block relative group"
                  >
                    <span className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      AI Support
                    </span>
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-purple-500 group-hover:w-4/5 group-hover:left-1/2 group-hover:-translate-x-1/2 transition-all duration-300"></span>
                  </a>
                </li>
                <li className="mx-1">
                  <a
                    href="/posts"
                    className="text-purple-600 hover:text-purple-800 transition-all duration-300 font-medium text-lg rounded-full px-4 py-2 hover:bg-purple-100 inline-block relative group"
                  >
                    <span className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                      </svg>
                      Forum
                    </span>
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-purple-500 group-hover:w-4/5 group-hover:left-1/2 group-hover:-translate-x-1/2 transition-all duration-300"></span>
                  </a>
                </li>
                <li className="mx-1">
                  <a
                    href="/games"
                    className="text-purple-600 hover:text-purple-800 transition-all duration-300 font-medium text-lg rounded-full px-4 py-2 hover:bg-purple-100 inline-block relative group"
                  >
                    <span className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"></path>
                      </svg>
                      Fun Games
                    </span>
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-purple-500 group-hover:w-4/5 group-hover:left-1/2 group-hover:-translate-x-1/2 transition-all duration-300"></span>
                  </a>
                </li>
              </>
            )}
          </ul>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <button
                  onClick={handleLoginClick}
                  className="bg-yellow-400 text-purple-700 font-bold py-2 px-5 rounded-full transition-all duration-300 shadow-md hover:bg-yellow-300 hover:shadow-xl hover:scale-105 text-lg relative overflow-hidden group"
                >
                  <span className="relative z-10">Sign In</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </button>
                <button
                  onClick={handleRegisterClick}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-2 px-5 rounded-full transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 text-lg relative overflow-hidden group"
                >
                  <span className="relative z-10">Join Us</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </button>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center space-x-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-bold py-2 px-5 rounded-full transition-all duration-300 shadow-md hover:shadow-xl hover:from-purple-200 hover:to-pink-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {profile?.first_name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="hidden lg:block">
                    {profile?.first_name || "User"}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${
                      showUserDropdown ? "rotate-180" : ""
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>

                {/* User dropdown menu */}
                {showUserDropdown && (
                  <div
                    className="absolute right-0 mt-3 w-52 bg-white rounded-lg shadow-xl py-2 z-20 border border-purple-100"
                    style={{ animation: "fadeIn 0.2s ease-out" }}
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium text-purple-700 truncate">
                        {profile?.first_name || "User"}
                      </p>
                    </div>
                    <a
                      href="/profile"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Profile
                    </a>
                    <a
                      href="/settings"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Settings
                    </a>
                    <a
                      href="/achievements"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      Badges
                    </a>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 5a1 1 0 01-1-1V3.414L13.586 8H10z"
                          clipRule="evenodd"
                        ></path>
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm3 14a1 1 0 01-1-1v-1h8a1 1 0 110 2H5zm0-4a1 1 0 110-2h8a1 1 0 110 2H5z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu with slide-in animation */}
      <div
        className={`md:hidden fixed inset-0 z-40 transform ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300`}
        style={{ pointerEvents: mobileMenuOpen ? "auto" : "none" }}
      >
        <div
          className="absolute inset-0 bg-black bg-opacity-25"
          onClick={toggleMobileMenu}
        ></div>
        <div className="absolute top-0 right-0 w-3/4 max-w-sm h-full bg-white shadow-xl transform transition-transform duration-300 overflow-y-auto">
          {/* Mobile menu header with close button */}
          <div className="flex justify-between items-center p-5 border-b border-gray-200">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
              UNSAID
            </div>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <svg
                className="h-6 w-6 text-gray-500"
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
          </div>

          {/* Mobile menu content with better spacing and animations */}
          <div className="px-5 py-4">
            {user && (
              <div className="mb-5 p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
                    {profile?.first_name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-medium text-purple-700">
                      {profile?.first_name || "User"}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {profile?.first_name}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!user ? (
              <div className="space-y-3">
                <a
                  href="/"
                  className="flex items-center p-4 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6 mr-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                  </svg>
                  Home
                </a>
                <a
                  href="/about"
                  className="flex items-center p-4 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6 mr-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  About Us
                </a>
                <a
                  href="/how-it-works"
                  className="flex items-center p-4 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6 mr-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  How It Works
                </a>
                <a
                  href="/safety"
                  className="flex items-center p-4 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6 mr-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Safety Zone
                </a>
                <a
                  href="/faqs"
                  className="flex items-center p-4 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6 mr-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Help & FAQs
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                <a
                  href="/modules"
                  className="flex items-center p-4 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6 mr-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.168 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                  </svg>
                  My Learning
                </a>
                <a
                  href="/dashboard"
                  className="flex items-center p-4 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6 mr-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                  </svg>
                  My Space
                </a>
                <a
                  href="/ask"
                  className="flex items-center p-4 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6 mr-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  AI Support
                </a>
                <a
                  href="/posts"
                  className="flex items-center p-4 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6 mr-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                  </svg>
                  Forum
                </a>
                <a
                  href="/games"
                  className="flex items-center p-4 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6 mr-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"></path>
                  </svg>
                  Fun Games
                </a>

                <div className="pt-4 border-t border-gray-100 mt-4">
                  <a
                    href="/profile"
                    className="flex items-center p-4 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors duration-200"
                  >
                    <svg
                      className="w-6 h-6 mr-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Profile
                  </a>
                  <a
                    href="/settings"
                    className="flex items-center p-4 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors duration-200"
                  >
                    <svg
                      className="w-6 h-6 mr-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Settings
                  </a>
                  <button
                    onClick={handleLogout}
                    className="flex items-center p-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 w-full"
                  >
                    <svg
                      className="w-6 h-6 mr-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 011 1v12a1 1 0 01-1 1h12a1 1 0 001-1V7.414l-5-5H4a1 1 0 00-1 1v12zm9.707-5.707L9 3.586V9h5.414l-1.707-1.707z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Log Out
                  </button>
                </div>
              </div>
            )}

            {!user && (
              <div className="mt-8 flex flex-col space-y-4">
                <button
                  onClick={handleLoginClick}
                  className="bg-yellow-400 text-purple-700 font-bold py-3 px-5 rounded-xl transition duration-300 shadow-md hover:bg-yellow-300 hover:shadow-lg text-lg flex justify-center items-center"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 011 1v12a1 1 0 01-1 1h12a1 1 0 001-1V7.414l-5-5H4a1 1 0 00-1 1v12zm9.707-5.707L9 3.586V9h5.414l-1.707-1.707z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Sign In
                </button>
                <button
                  onClick={handleRegisterClick}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 px-5 rounded-xl transition duration-300 shadow-md hover:from-pink-400 hover:to-purple-400 hover:shadow-lg text-lg flex justify-center items-center"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
                  </svg>
                  Join Us
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full relative animate-fadeIn">
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
