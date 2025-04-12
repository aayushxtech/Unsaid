import React, { useState, useEffect } from "react";
import SideNav from "../../SideNav";
import Navbar from "../../Navbar";
import { supabase } from "../../../../supabaseClient";

const PostsDelete = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
    try {
      setDeleteLoading(true);

      // Delete post from Supabase
      const { error } = await supabase.from("posts").delete().eq("id", postId);

      if (error) {
        throw error;
      }

      // Remove post from state
      setPosts(posts.filter((post) => post.id !== postId));
      setConfirmDelete(null);

      // Success feedback
      alert("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post: " + error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleBulkDelete = async (ids) => {
    try {
      setDeleteLoading(true);

      // Delete multiple posts from Supabase
      const { error } = await supabase.from("posts").delete().in("id", ids);

      if (error) {
        throw error;
      }

      // Remove posts from state
      setPosts(posts.filter((post) => !ids.includes(post.id)));

      // Success feedback
      alert(`Successfully deleted ${ids.length} posts`);
    } catch (error) {
      console.error("Error bulk deleting posts:", error);
      alert("Failed to delete posts: " + error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    // Search by content or user name
    const postContent = post.content?.toLowerCase() || "";
    const userName = post.profiles
      ? `${post.profiles.first_name || ""} ${post.profiles.last_name || ""}`
          .trim()
          .toLowerCase()
      : "";

    const matchesSearch =
      postContent.includes(searchTerm.toLowerCase()) ||
      userName.includes(searchTerm.toLowerCase());

    // Apply additional filters
    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "reported" && post.reported) return matchesSearch;
    if (selectedFilter === "flagged" && post.flagged) return matchesSearch;
    if (
      selectedFilter === "recent" &&
      new Date(post.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    )
      return matchesSearch;

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
                  Delete Posts
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
                    <option value="reported">Reported Posts</option>
                    <option value="flagged">Flagged Posts</option>
                    <option value="recent">Last 7 Days</option>
                  </select>
                </div>
              </div>

              {/* Bulk Action */}
              {filteredPosts.length > 0 && (
                <div className="mb-4">
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete all ${filteredPosts.length} filtered posts? This action cannot be undone.`
                        )
                      ) {
                        handleBulkDelete(filteredPosts.map((post) => post.id));
                      }
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete All Filtered Posts ({filteredPosts.length})
                  </button>
                </div>
              )}

              {/* Posts list for deletion */}
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

                      <div className="flex justify-end">
                        <button
                          onClick={() => setConfirmDelete(post)}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                          Delete This Post
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

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Post Deletion
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>

            <div className="border border-gray-200 rounded p-3 mb-4 bg-gray-50">
              <p className="text-sm line-clamp-3">{confirmDelete.content}</p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePost(confirmDelete.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-75"
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsDelete;
