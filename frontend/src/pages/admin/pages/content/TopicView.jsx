import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../../supabaseClient";
import SideNav from "../../SideNav";
import Navbar from "../../Navbar";

const TopicView = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [ageFilter, setAgeFilter] = useState("all");
  const [publishedFilter, setPublishedFilter] = useState("all");

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("topics")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTopics(data || []);
    } catch (error) {
      console.error("Error fetching topics:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTopic = async (id) => {
    if (window.confirm("Are you sure you want to delete this topic?")) {
      try {
        const { error } = await supabase.from("topics").delete().eq("id", id);

        if (error) throw error;

        // Refresh topics list
        fetchTopics();
      } catch (error) {
        console.error("Error deleting topic:", error.message);
        alert("Error deleting topic");
      }
    }
  };

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAge = ageFilter === "all" || topic.age_group === ageFilter;
    const matchesPublished =
      publishedFilter === "all" ||
      (publishedFilter === "published"
        ? topic.is_published
        : !topic.is_published);

    return matchesSearch && matchesAge && matchesPublished;
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
                  Topic List
                </h1>
                <button
                  onClick={() => navigate("/admin/topics/add")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Add New Topic
                </button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />

                <select
                  value={ageFilter}
                  onChange={(e) => setAgeFilter(e.target.value)}
                  className="px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Age Groups</option>
                  <option value="8-12">8-12 years</option>
                  <option value="13-15">13-15 years</option>
                  <option value="16-18">16-18 years</option>
                </select>

                <select
                  value={publishedFilter}
                  onChange={(e) => setPublishedFilter(e.target.value)}
                  className="px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
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

              {/* Topics List */}
              <div className="space-y-4">
                {filteredTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {topic.title}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {topic.description}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                            {topic.age_group} years
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              topic.is_published
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {topic.is_published ? "Published" : "Draft"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteTopic(topic.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {!loading && filteredTopics.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No topics found matching your criteria
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

export default TopicView;
