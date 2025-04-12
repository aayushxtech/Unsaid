import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../../supabaseClient";
import SideNav from "../../SideNav";
import Navbar from "../../Navbar";

const getSignedUrl = async (path) => {
  try {
    const { data, error } = await supabase.storage
      .from("content-bucket")
      .createSignedUrl(path, 3600); // URL valid for 1 hour

    if (error) throw error;
    return data.signedUrl;
  } catch (error) {
    console.error("Error getting signed URL:", error);
    return null;
  }
};

const MediaPreview = ({ content, mediaUrl, refreshSignedUrl }) => {
  switch (content.content_type) {
    case "image":
      return mediaUrl ? (
        <div className="relative h-48 w-full md:w-64 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={mediaUrl}
            alt="Content preview"
            className="h-full w-full object-cover"
            onError={async (e) => {
              await refreshSignedUrl();
              if (!mediaUrl) {
                e.target.src = `data:image/svg+xml,${encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">
                    <rect width="150" height="150" fill="#f3f4f6"/>
                    <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">
                      Image Not Found
                    </text>
                  </svg>
                `)}`;
              }
            }}
          />
        </div>
      ) : (
        <div className="h-48 w-full md:w-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-gray-400">No image available</span>
        </div>
      );

    case "video":
      return mediaUrl ? (
        <div className="relative h-48 w-full md:w-64 bg-black rounded-lg overflow-hidden">
          <video
            src={mediaUrl}
            controls
            className="h-full w-full object-contain"
            onError={async (e) => {
              await refreshSignedUrl();
              if (!mediaUrl) {
                e.target.parentElement.innerHTML = "Video format not supported";
              }
            }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <div className="h-48 w-full md:w-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-gray-400">No video available</span>
        </div>
      );

    // ... rest of the cases remain the same ...
  }
};

const ContentView = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contents, setContents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [subtopicFilter, setSubtopicFilter] = useState("all");
  const [subtopics, setSubtopics] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch contents with their subtopic information
      const { data: contentsData, error: contentsError } = await supabase
        .from("contents")
        .select(
          `
          *,
          subtopics:subtopic_id (
            id,
            title,
            topics:topic_id (
              title
            )
          )
        `
        )
        .order("created_at", { ascending: false });

      if (contentsError) throw contentsError;

      // Fetch subtopics for filter dropdown
      const { data: subtopicsData, error: subtopicsError } = await supabase
        .from("subtopics")
        .select(
          `
          id,
          title,
          topics:topic_id (
            title
          )
        `
        )
        .order("title");

      if (subtopicsError) throw subtopicsError;

      // Get signed URLs for media content
      if (contentsData) {
        const contentsWithSignedUrls = await Promise.all(
          contentsData.map(async (content) => {
            if (content.media_url && content.content_type !== "game") {
              // Extract path from media_url
              const path = content.media_url.split("content-bucket/")[1];
              if (path) {
                const signedUrl = await getSignedUrl(path);
                return {
                  ...content,
                  media_url: signedUrl || content.media_url,
                };
              }
            }
            return content;
          })
        );
        setContents(contentsWithSignedUrls);
      }

      setSubtopics(subtopicsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteContent = async (id) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      try {
        const { error } = await supabase.from("contents").delete().eq("id", id);

        if (error) throw error;

        // Refresh content list
        fetchData();
      } catch (error) {
        console.error("Error deleting content:", error);
        alert("Error deleting content");
      }
    }
  };

  const filteredContents = contents.filter((content) => {
    const matchesSearch =
      content.body?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.subtopics?.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      typeFilter === "all" || content.content_type === typeFilter;
    const matchesSubtopic =
      subtopicFilter === "all" || content.subtopic_id === subtopicFilter;

    return matchesSearch && matchesType && matchesSubtopic;
  });

  const renderContentPreview = (content) => {
    const getNewSignedUrl = async () => {
      if (content.media_url && content.content_type !== "game") {
        const path = content.media_url.split("content-bucket/")[1];
        if (path) {
          const newSignedUrl = await getSignedUrl(path);
          return newSignedUrl;
        }
      }
      return null;
    };

    return (
      <MediaPreview
        content={content}
        mediaUrl={content.media_url}
        refreshSignedUrl={getNewSignedUrl}
      />
    );
  };

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
                  Content List
                </h1>
                <button
                  onClick={() => navigate("/admin/content/contents/add")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Add New Content
                </button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Types</option>
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="document">Document</option>
                  <option value="game">Game</option>
                </select>

                <select
                  value={subtopicFilter}
                  onChange={(e) => setSubtopicFilter(e.target.value)}
                  className="px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Subtopics</option>
                  {subtopics.map((subtopic) => (
                    <option key={subtopic.id} value={subtopic.id}>
                      {subtopic.title} ({subtopic.topics?.title})
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

              {/* Content List */}
              <div className="space-y-4">
                {filteredContents.map((content) => (
                  <div
                    key={content.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              content.content_type === "text"
                                ? "bg-blue-100 text-blue-800"
                                : content.content_type === "image"
                                ? "bg-green-100 text-green-800"
                                : content.content_type === "video"
                                ? "bg-purple-100 text-purple-800"
                                : content.content_type === "audio"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {content.content_type}
                          </span>
                          <span className="text-sm text-gray-500">
                            Order: {content.order_no}
                          </span>
                        </div>

                        <h3 className="text-sm font-medium text-gray-600 mb-1">
                          {content.subtopics?.topics?.title} →{" "}
                          {content.subtopics?.title}
                        </h3>

                        <div className="mt-2">
                          {renderContentPreview(content)}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleDeleteContent(content.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {!loading && filteredContents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No content found matching your criteria
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

export default ContentView;
