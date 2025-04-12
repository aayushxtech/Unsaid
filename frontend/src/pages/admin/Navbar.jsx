import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-black font-bold text-xl">Admin Panel</div>
        <div className="flex space-x-4">
          <a href="/admin/content" className="text-black hover:text-gray-500">
            Content
          </a>
          <a href="/admin/quizzes" className="text-black hover:text-gray-500">
            Quizzes
          </a>
          <a href="/admin/posts" className="text-black hover:text-gray-500">
            Posts
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
