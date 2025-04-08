import React from "react";
import Navbar from "../Navbar";
import SideNav from "../SideNav";

const Posts = () => {
  return (
    <>
      <div className="container mx-auto p-4">
        <div className="bg-white p-4 rounded shadow">
          <Navbar />
          {/* Admin content goes here */}
          <SideNav section="posts" />
        </div>
      </div>
    </>
  );
};

export default Posts;
