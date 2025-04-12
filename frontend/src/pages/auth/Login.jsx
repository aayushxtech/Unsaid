import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const Login = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("is_banned, banned_reason")
          .eq("id", data.user.id)
          .single();

        if (profileError) {
          console.error("Error checking user ban status:", profileError);
          throw new Error(
            "Oops! We couldn't check your account. Please try again."
          );
        }

        if (profileData?.is_banned) {
          await supabase.auth.signOut();

          const banReason = profileData.banned_reason
            ? `Reason: ${profileData.banned_reason}`
            : "Please ask a grown-up to contact support.";

          throw new Error(`Your account is taking a time-out. ${banReason}`);
        }

        onClose?.();
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(
        err.message ||
          "Login didn't work. Double-check your info and try again!"
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
            Welcome Back, Friend!
          </h2>
          <p className="text-center text-white mt-1">
            Let's go on an adventure!
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
            <div>
              <label
                htmlFor="email"
                className="block text-base font-medium text-gray-700 mb-1 flex items-center"
              >
                <span className="mr-2">✉️</span> Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Type your email here"
                required
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-base font-medium text-gray-700 mb-1 flex items-center"
              >
                <span className="mr-2">🔑</span> Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Type your secret password"
                required
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base"
              />
            </div>

            <div className="flex items-center justify-between text-base mt-4">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-5 w-5 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
                />
                <label htmlFor="remember-me" className="ml-2 text-gray-600">
                  Remember me
                </label>
              </div>
              <a
                href="/forgot-password"
                className="text-blue-500 hover:text-blue-400"
              >
                Forgot password?
              </a>
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
                  Magic happening...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-2">🚀</span> Let's Go!
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account yet?{" "}
              <a
                href="/register"
                className="text-blue-500 font-medium hover:underline"
              >
                Join the fun!
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
