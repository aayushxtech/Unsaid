import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../../supabaseClient";
import SideNav from "../../SideNav";
import Navbar from "../../Navbar";

const SubTopicView = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subtopics, setSubtopics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const [topics, setTopics] = useState([]);

  // Fetch subtopics and topics
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch topics for filter dropdown
        const { data: topicsData, error: topicsError } = await supabase
          .from("topics")
          .select("id, title")
          .order("title");

        if (topicsError) throw topicsError;
        setTopics(topicsData || []);

        // Fetch subtopics with their parent topic information
        const { data: subtopicsData, error: subtopicsError } = await supabase
          .from("subtopics")
          .select(
            `
            *,
            topics:topic_id (
              title
            )
          `
          )
          .order("order_no");

        if (subtopicsError) throw subtopicsError;
        setSubtopics(subtopicsData || []);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteSubtopic = async (id) => {
    if (window.confirm("Are you sure you want to delete this subtopic?")) {
      try {
        const { error } = await supabase
          .from("subtopics")
          .delete()
          .eq("id", id);

        if (error) throw error;

        // Refresh the subtopics list
        setSubtopics(subtopics.filter((st) => st.id !== id));
      } catch (error) {
        console.error("Error deleting subtopic:", error.message);
        alert("Error deleting subtopic");
      }
    }
  };

  // Filter subtopics based on search term and topic filter
  const filteredSubtopics = subtopics.filter((subtopic) => {
    const matchesSearch = subtopic.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTopic =
      topicFilter === "all" || subtopic.topic_id === topicFilter;
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <SideNav section="content" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                  Sub Topic List
                </h1>
                <button
                  onClick={() => navigate("/admin/subtopics/add")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Add New Sub Topic
                </button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search subtopics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />

                <select
                  value={topicFilter}
                  onChange={(e) => setTopicFilter(e.target.value)}
                  className="px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Topics</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-red-600 p-4 bg-red-50 rounded-md mb-4">
                  {error}
                </div>
              )}

              {/* Subtopics List */}
              <div className="space-y-4">
                {filteredSubtopics.map((subtopic) => (
                  <div
                    key={subtopic.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {subtopic.title}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          Parent Topic: {subtopic.topics?.title || "Unknown"}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          Order: {subtopic.order_no}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteSubtopic(subtopic.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {!loading && filteredSubtopics.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No subtopics found matching your criteria
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SubTopicView;
