import React from "react";
import Navbar from "../../Navbar";
import SideNav from "../../SideNav";

const Quizzes = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <SideNav section="quizzes" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                Quiz Management
              </h1>

              {/* Quizzes dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-5 rounded-lg shadow-sm border border-indigo-100">
                  <h2 className="text-lg font-medium text-indigo-700 mb-2">
                    Create Quiz
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Add a new quiz to the system
                  </p>
                  <a
                    href="/admin/quizzes/create"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Create New Quiz
                  </a>
                </div>

                <div className="bg-indigo-50 p-5 rounded-lg shadow-sm border border-indigo-100">
                  <h2 className="text-lg font-medium text-indigo-700 mb-2">
                    Edit Quizzes
                  </h2>
                  <p className="text-gray-600 mb-4">Modify existing quizzes</p>
                  <a
                    href="/admin/quizzes/edit"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Manage Quizzes
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

export default Quizzes;
