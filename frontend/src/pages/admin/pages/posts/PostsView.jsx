import React, { useState, useEffect } from "react";
import SideNav from "../../SideNav";
import Navbar from "../../Navbar";
import { supabase } from "../../../../supabaseClient";

const PostsView = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      // Fetch posts from Supabase
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (postsError) {
        throw postsError;
      }

      // If we have posts, fetch the associated profiles separately
      if (postsData && postsData.length > 0) {
        // Extract unique user_ids from posts
        const userIds = [
          ...new Set(
            postsData.filter((post) => post.user_id).map((post) => post.user_id)
          ),
        ];

        // Fetch profile data for these users
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, avatar_url")
          .in("id", userIds);

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
        }

        // Combine the posts with their profile data
        const postsWithProfiles = postsData.map((post) => {
          const profile = profilesData?.find((p) => p.id === post.user_id);
          return {
            ...post,
            profiles: profile || null,
          };
        });

        setPosts(postsWithProfiles);
      } else {
        setPosts(postsData || []);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.from("posts").delete().eq("id", postId);

      if (error) {
        throw error;
      }

      // Remove post from state
      setPosts(posts.filter((post) => post.id !== postId));

      alert("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const userName = post.profiles
      ? `${post.profiles.first_name || ""} ${
          post.profiles.last_name || ""
        }`.trim()
      : "";

    const matchesSearch =
      post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "reported" && post.reported) return matchesSearch;
    if (selectedFilter === "flagged" && post.flagged) return matchesSearch;

    return false;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <SideNav section="posts" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                  View Posts
                </h1>
                <button
                  onClick={fetchPosts}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Refresh
                </button>
              </div>

              {/* Search and filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search posts or users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="w-full md:w-auto">
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Posts</option>
                    <option value="reported">Reported</option>
                    <option value="flagged">Flagged</option>
                  </select>
                </div>
              </div>

              {/* Posts list */}
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : error ? (
                <div className="text-center p-6 bg-red-50 text-red-600 rounded-lg">
                  {error}
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center p-6 bg-gray-50 text-gray-500 rounded-lg">
                  No posts found.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 overflow-hidden">
                            {post.profiles?.avatar_url ? (
                              <img
                                src={post.profiles.avatar_url}
                                alt="User avatar"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-500">
                                {post.profiles?.first_name
                                  ?.charAt(0)
                                  ?.toUpperCase() || "?"}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">
                              {post.profiles
                                ? `${post.profiles.first_name || ""} ${
                                    post.profiles.last_name || ""
                                  }`.trim() || "Anonymous"
                                : "Anonymous"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(post.created_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {post.reported && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              Reported
                            </span>
                          )}
                          {post.flagged && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                              Flagged
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mb-3 whitespace-pre-wrap">
                        {post.content}
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                        <button className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors">
                          Flag
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PostsView;
