import React from "react";
import SideNav from "../../SideNav";
import Navbar from "../../Navbar";

const QuizEdit = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <SideNav section="quizzes" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                Edit Quiz
              </h1>

              {/* Quiz edit form will go here */}
              <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg text-center">
                <p className="text-gray-500">
                  Quiz editing interface will be implemented here
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuizEdit;
