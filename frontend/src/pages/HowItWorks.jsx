import React from "react";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How UNSAID Works
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            A safe space for anonymous journaling and mental wellness
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Getting Started
            </h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <span className="text-xl font-bold">1</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Create an Account
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Sign up with your email. We'll ask for your age to provide
                    appropriate content. For users under 13, we require parental
                    consent to comply with privacy laws.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <span className="text-xl font-bold">2</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Start Journaling
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Write about your thoughts and feelings in our secure,
                    private journaling space. Your entries are encrypted and
                    only visible to you.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <span className="text-xl font-bold">3</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Explore Resources
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Access age-appropriate mental health resources, guided
                    exercises, and educational content to help manage emotions
                    and build resilience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Our Privacy Promise
            </h2>
            <p className="text-gray-600 mb-4">
              At UNSAID, your privacy is our priority. We design our platform
              with security and confidentiality in mind:
            </p>
            <ul className="space-y-2 text-gray-600 list-disc pl-5">
              <li>End-to-end encryption for all journal entries</li>
              <li>Age-appropriate content filtering</li>
              <li>No data sharing with third parties</li>
              <li>Compliance with COPPA, GDPR and other privacy regulations</li>
              <li>Transparent data policies</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Ready to start your journey with UNSAID?
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 border border-gray-300 bg-white text-base font-medium rounded-md text-gray-700 hover:bg-gray-50"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
