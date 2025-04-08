import React from "react";
import Navbar from "../../Navbar";
import SideNav from "../../SideNav";

const Posts = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <SideNav section="posts" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                Posts Management
              </h1>

              {/* Posts dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-indigo-50 p-5 rounded-lg shadow-sm border border-indigo-100">
                  <h2 className="text-lg font-medium text-indigo-700 mb-2">
                    View Posts
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Browse all community posts
                  </p>
                  <a
                    href="/admin/posts/view"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    View All Posts
                  </a>
                </div>

                <div className="bg-indigo-50 p-5 rounded-lg shadow-sm border border-indigo-100">
                  <h2 className="text-lg font-medium text-indigo-700 mb-2">
                    Delete Posts
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Remove inappropriate content
                  </p>
                  <a
                    href="/admin/posts/delete"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Manage Deletions
                  </a>
                </div>

                <div className="bg-indigo-50 p-5 rounded-lg shadow-sm border border-indigo-100">
                  <h2 className="text-lg font-medium text-indigo-700 mb-2">
                    User Management
                  </h2>
                  <p className="text-gray-600 mb-4">Control user access</p>
                  <a
                    href="/admin/posts/users/ban"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Ban Users
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

export default Posts;
