import React from "react";
import Navbar from "../../Navbar";
import SideNav from "../../SideNav";

const Content = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <SideNav section="content" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                Content Management
              </h1>

              {/* Content dashboard will go here */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-indigo-50 p-5 rounded-lg shadow-sm border border-indigo-100">
                  <h2 className="text-lg font-medium text-indigo-700 mb-2">
                    Topics
                  </h2>
                  <p className="text-gray-600 mb-4">Manage content topics</p>
                  <div className="flex gap-2">
                    <a
                      href="/admin/content/topics/view"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      View
                    </a>
                    <a
                      href="/admin/content/topics/add"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Add New
                    </a>
                  </div>
                </div>

                <div className="bg-indigo-50 p-5 rounded-lg shadow-sm border border-indigo-100">
                  <h2 className="text-lg font-medium text-indigo-700 mb-2">
                    Sub Topics
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Manage content sub-topics
                  </p>
                  <div className="flex gap-2">
                    <a
                      href="/admin/content/subtopics/view"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      View
                    </a>
                    <a
                      href="/admin/content/subtopics/add"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Add New
                    </a>
                  </div>
                </div>

                <div className="bg-indigo-50 p-5 rounded-lg shadow-sm border border-indigo-100">
                  <h2 className="text-lg font-medium text-indigo-700 mb-2">
                    Content
                  </h2>
                  <p className="text-gray-600 mb-4">Manage learning content</p>
                  <div className="flex gap-2">
                    <a
                      href="/admin/content/contents/view"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      View
                    </a>
                    <a
                      href="/admin/content/contents/add"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Add New
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Content;
