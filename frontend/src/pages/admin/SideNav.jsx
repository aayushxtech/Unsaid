import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChevronDown, FaChevronRight, FaTimes, FaBars } from "react-icons/fa";

const SideNav = ({ section }) => {
  const [expanded, setExpanded] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // Define navigation items based on the current section
  const getNavItems = () => {
    switch (section) {
      case "content":
        return [
          {
            label: "Topics",
            path: "/admin/content/topics",
            subItems: [
              { label: "View Topics", path: "/admin/content/topics/view" },
              { label: "Add Topic", path: "/admin/content/topics/add" },
            ],
          },
          {
            label: "Sub Topics",
            path: "/admin/content/subtopics",
            subItems: [
              {
                label: "View Sub Topics",
                path: "/admin/content/subtopics/view",
              },
              { label: "Add Sub Topic", path: "/admin/content/subtopics/add" },
            ],
          },
          {
            label: "Contents",
            path: "/admin/content/contents",
            subItems: [
              { label: "View Contents", path: "/admin/content/contents/view" },
              { label: "Add Content", path: "/admin/content/contents/add" },
            ],
          },
        ];

      case "quizzes":
        return [
          {
            label: "Quiz Management",
            path: "/admin/quizzes/manage",
            subItems: [
              { label: "Create Quiz", path: "/admin/quizzes/create" },
              { label: "Edit Quiz", path: "/admin/quizzes/edit" },
            ],
          },
        ];

      case "posts":
        return [
          {
            label: "Post Management",
            path: "/admin/posts/manage",
            subItems: [
              { label: "View All Posts", path: "/admin/posts/view" },
              { label: "Delete Posts", path: "/admin/posts/delete" },
            ],
          },
          {
            label: "User Management",
            path: "/admin/posts/users",
            subItems: [{ label: "Ban Users", path: "/admin/posts/users/ban" }],
          },
        ];

      default:
        return [
          {
            label: "Dashboard",
            path: "/admin/dashboard",
            subItems: [],
          },
        ];
    }
  };

  const navItems = getNavItems();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleExpand = (index) => {
    setExpanded({
      ...expanded,
      [index]: !expanded[index],
    });
  };

  const NavItem = ({ item, index }) => {
    const isExpanded = expanded[index];
    const hasSubItems = item.subItems && item.subItems.length > 0;

    return (
      <div className="mb-2">
        <div
          onClick={() => hasSubItems && toggleExpand(index)}
          className={`flex items-center px-4 py-2 rounded-md cursor-pointer transition-colors duration-200 ${
            isActive(item.path)
              ? "bg-white text-indigo-700"
              : "text-gray-300 hover:bg-indigo-600 hover:text-white"
          }`}
        >
          {sidebarOpen && (
            <span className="text-sm font-medium flex-grow">{item.label}</span>
          )}
          {hasSubItems && sidebarOpen && (
            <span className="ml-auto">
              {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
            </span>
          )}
        </div>

        {isExpanded && hasSubItems && (
          <div className="ml-2 mt-1 space-y-1">
            {item.subItems.map((subItem, subIndex) => (
              <Link
                key={subIndex}
                to={subItem.path}
                className={`flex items-center pl-10 pr-4 py-2 text-sm rounded-md transition-colors duration-200 ${
                  isActive(subItem.path)
                    ? "bg-indigo-700 text-white"
                    : "text-gray-300 hover:bg-indigo-600 hover:text-white"
                }`}
              >
                <span className="w-2 h-2 rounded-full mr-2 bg-gray-500"></span>
                {sidebarOpen && <span>{subItem.label}</span>}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  const getSectionTitle = () => {
    switch (section) {
      case "content":
        return "Content Management";
      case "quizzes":
        return "Quiz Administration";
      case "posts":
        return "Post & User Management";
      default:
        return "Admin Dashboard";
    }
  };

  return (
    <div
      className={`h-screen bg-indigo-800 transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-indigo-700">
        {sidebarOpen && (
          <span className="text-white font-semibold">{getSectionTitle()}</span>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-md text-gray-300 hover:bg-indigo-700 hover:text-white"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div className="p-3">
        {navItems.map((item, index) => (
          <NavItem key={index} item={item} index={index} />
        ))}
      </div>
    </div>
  );
};

export default SideNav;
