/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../../supabaseClient";
import SideNav from "../../SideNav";
import Navbar from "../../Navbar";

const ContentAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);

  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const [content, setContent] = useState({
    subtopic_id: "",
    content_type: "text", // Default to text
    body: "",
    order_no: 1,
    media_url: "",
  });

  // Fetch topics and subtopics
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch topics
        const { data: topicsData, error: topicsError } = await supabase
          .from("topics")
          .select("id, title")
          .order("title");

        if (topicsError) throw topicsError;
        setTopics(topicsData || []);

        // Fetch subtopics
        const { data: subtopicsData, error: subtopicsError } = await supabase
          .from("subtopics")
          .select("id, title, topic_id")
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  // Add this function near your other handlers
  const handleFileSelection = (file) => {
    // Maximum file size (50MB)
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds 50MB limit");
      return;
    }

    setSelectedFile(file);
    setError(null); // Clear any previous errors

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!content.subtopic_id) throw new Error("Please select a subtopic");
      if (!content.content_type) throw new Error("Content type is required");

      let mediaUrl = content.media_url;

      // Handle file upload if present
      if (selectedFile && content.content_type !== "game") {
        try {
          const bucket = "content-bucket";

          // Upload file with unique name
          const fileExt = selectedFile.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}.${fileExt}`;
          const filePath = `${content.content_type}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, selectedFile, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) {
            if (uploadError.message.includes("Bucket not found")) {
              // Create bucket if it doesn't exist
              const { error: createError } =
                await supabase.storage.createBucket(bucket, {
                  public: true,
                  fileSizeLimit: 52428800, // 50MB
                });
              if (createError) throw createError;

              // Retry upload after bucket creation
              const { error: retryError } = await supabase.storage
                .from(bucket)
                .upload(filePath, selectedFile, {
                  cacheControl: "3600",
                  upsert: false,
                });
              if (retryError) throw retryError;
            } else {
              throw uploadError;
            }
          }

          // Get public URL
          const {
            data: { publicUrl },
          } = supabase.storage.from(bucket).getPublicUrl(filePath);

          mediaUrl = publicUrl;
        } catch (storageError) {
          console.error("Storage error:", storageError);
          throw new Error(`File upload failed: ${storageError.message}`);
        }
      }

      // Create content record
      const { data, error } = await supabase
        .from("contents")
        .insert([
          {
            subtopic_id: content.subtopic_id,
            content_type: content.content_type,
            body: content.body,
            order_no: content.order_no,
            media_url: mediaUrl,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        navigate("/admin/content");
      }, 2000);
    } catch (error) {
      console.error("Error adding content:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderContentInput = () => {
    switch (content.content_type) {
      case "text":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Body *
            </label>
            <textarea
              name="body"
              value={content.body}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter content body"
            />
          </div>
        );

      case "image":
      case "video":
      case "audio":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload{" "}
              {content.content_type.charAt(0).toUpperCase() +
                content.content_type.slice(1)}{" "}
              *
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept={`.${
                        content.content_type === "image"
                          ? "jpg,jpeg,png,gif"
                          : content.content_type === "video"
                          ? "mp4,webm"
                          : "mp3,wav"
                      }`}
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                  </label>
                </div>
                {filePreview && content.content_type === "image" && (
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="mt-2 max-h-48 mx-auto"
                  />
                )}
                {selectedFile && (
                  <p className="text-sm text-gray-500">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case "document":
        return (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
              dragActive ? "border-indigo-300 bg-indigo-50" : "border-gray-300"
            } border-dashed rounded-md`}
          >
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                  <span>Upload a file</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              {selectedFile && (
                <p className="text-sm text-gray-500">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>
        );

      case "game":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Game URL *
            </label>
            <input
              type="url"
              name="media_url"
              value={content.media_url}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter game URL"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SideNav section="content" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                Add New Content
              </h1>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-600">Content added successfully!</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtopic *
                  </label>
                  <select
                    name="subtopic_id"
                    value={content.subtopic_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a Subtopic</option>
                    {subtopics.map((subtopic) => (
                      <option key={subtopic.id} value={subtopic.id}>
                        {subtopic.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Type *
                  </label>
                  <select
                    name="content_type"
                    value={content.content_type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="document">Document</option>
                    <option value="game">Game</option>
                  </select>
                </div>

                {renderContentInput()}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Number
                  </label>
                  <input
                    type="number"
                    name="order_no"
                    value={content.order_no}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate("/admin/content")}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      loading ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Adding..." : "Add Content"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ContentAdd;
