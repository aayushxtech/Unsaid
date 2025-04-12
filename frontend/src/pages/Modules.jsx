import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import calculateAge from "../lib/calculateAge";
import getAgeGroup from "../lib/ageGroup";
import {
  Box,
  Typography,
  Container,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Alert,
  useTheme,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Avatar,
  Zoom,
  Tooltip,
} from "@mui/material";
import {
  Close as CloseIcon,
  MenuBook as MenuBookIcon,
  ErrorOutline,
  ZoomIn as ZoomInIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import {
  FaFileAlt,
  FaFilePdf,
  FaFileWord,
  FaVolumeUp,
  FaGamepad,
  FaRocket,
  FaStar,
  FaPuzzlePiece,
  FaTree,
  FaMountain,
  FaWater,
  FaCampground,
  FaCompass,
  FaMapMarkedAlt,
  FaMapSigns,
  FaFlag,
} from "react-icons/fa";

// Keep the same helper functions from the original code
const getSignedUrl = async (path) => {
  try {
    const { data, error } = await supabase.storage
      .from("content-bucket")
      .createSignedUrl(path, 3600);

    if (error) throw error;
    return data.signedUrl;
  } catch (error) {
    console.error("Error getting signed URL:", error);
    return null;
  }
};

const downloadContent = async (url, filename) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
  }
};

// Keep the ContentRenderer component from the original code
const ContentRenderer = ({ content }) => {
  const theme = useTheme();
  const [mediaError, setMediaError] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleMediaError = async (e) => {
    console.error(
      "Media error:",
      content.content_type,
      content.media_url,
      e.message
    );
    setMediaError(true);
  };

  const getFileIcon = (contentType) => {
    switch (contentType) {
      case "pdf":
        return <FaFilePdf size={24} color={theme.palette.error.main} />;
      case "doc":
      case "docx":
        return <FaFileWord size={24} color={theme.palette.primary.main} />;
      default:
        return <FaFileAlt size={24} color={theme.palette.text.secondary} />;
    }
  };

  const getFileExtension = (url) => {
    return url?.split(".").pop().toLowerCase();
  };

  const getFileName = (url) => {
    const path = url?.split("/").pop();
    return path || `${content.content_type}-${Date.now()}`;
  };

  const handlePreviewOpen = () => setPreviewOpen(true);
  const handlePreviewClose = () => setPreviewOpen(false);

  const PreviewDialog = () => (
    <Dialog
      open={previewOpen}
      onClose={handlePreviewClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: "16px",
          border: "4px solid #FFC107",
        },
      }}
    >
      <DialogContent sx={{ position: "relative", p: 0, bgcolor: "black" }}>
        <IconButton
          onClick={handlePreviewClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
            bgcolor: "rgba(0, 0, 0, 0.5)",
            "&:hover": {
              bgcolor: "rgba(0, 0, 0, 0.7)",
            },
            borderRadius: "12px",
          }}
        >
          <CloseIcon />
        </IconButton>
        {content.content_type === "image" && (
          <img
            src={content.media_url}
            alt={content.body || "Content"}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "90vh",
              objectFit: "contain",
            }}
          />
        )}
        {content.content_type === "video" && (
          <video
            controls
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "90vh",
            }}
            src={content.media_url}
          >
            <source src={content.media_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        {content.content_type === "document" && (
          <iframe
            src={content.media_url}
            style={{
              width: "100%",
              height: "90vh",
              border: "none",
            }}
            title="Document Preview"
          />
        )}
      </DialogContent>
    </Dialog>
  );

  switch (content.content_type) {
    case "text":
      return (
        <Box sx={{ px: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
              backgroundColor: "#f8f9fa",
              p: 2,
              borderRadius: "12px",
              border: "2px dashed #9c27b0",
            }}
          >
            <Typography variant="body1" color="text.secondary">
              {content.body}
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                const blob = new Blob([content.body], { type: "text/plain" });
                const url = window.URL.createObjectURL(blob);
                downloadContent(url, `text-${Date.now()}.txt`);
              }}
              sx={{
                borderRadius: "20px",
                bgcolor: "#9c27b0",
                "&:hover": {
                  bgcolor: "#7b1fa2",
                },
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              }}
              startIcon={<FaFileAlt />}
            >
              Save Note
            </Button>
          </Box>
        </Box>
      );

    case "image":
      return mediaError ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 200,
            bgcolor: "#ffecb3",
            borderRadius: 4,
            border: "2px dashed #ff9800",
          }}
        >
          <Typography color="text.secondary">Image not available</Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ position: "relative" }}>
            <Box
              sx={{
                borderRadius: "16px",
                overflow: "hidden",
                border: "3px solid #4caf50",
                boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
              }}
            >
              <img
                src={content.media_url}
                alt={content.body || "Content"}
                style={{ maxWidth: "100%", height: "auto", display: "block" }}
                onError={handleMediaError}
                loading="lazy"
              />
            </Box>
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                display: "flex",
                gap: 1,
              }}
            >
              <IconButton
                onClick={handlePreviewOpen}
                sx={{
                  bgcolor: "#4caf50",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#2e7d32",
                  },
                  boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                  borderRadius: "12px",
                }}
              >
                <ZoomInIcon />
              </IconButton>
            </Box>
          </Box>
          <PreviewDialog />
        </Box>
      );

    case "video":
      return mediaError ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 200,
            bgcolor: "#ffecb3",
            borderRadius: 4,
            border: "2px dashed #ff9800",
          }}
        >
          <Typography color="text.secondary">Video not available</Typography>
        </Box>
      ) : (
        <Box>
          <Box sx={{ position: "relative" }}>
            <Box
              sx={{
                borderRadius: "16px",
                overflow: "hidden",
                border: "3px solid #2196f3",
                boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
              }}
            >
              <video
                controls
                style={{
                  width: "100%",
                  height: "auto",
                }}
                src={content.media_url}
                onError={handleMediaError}
                poster={content.thumbnail_url}
              >
                <source src={content.media_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Box>
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                display: "flex",
                gap: 1,
              }}
            >
              <IconButton
                onClick={handlePreviewOpen}
                sx={{
                  bgcolor: "#2196f3",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#1565c0",
                  },
                  boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                  borderRadius: "12px",
                }}
              >
                <ZoomInIcon />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() =>
                downloadContent(
                  content.media_url,
                  getFileName(content.media_url)
                )
              }
              sx={{
                borderRadius: "20px",
                bgcolor: "#2196f3",
                "&:hover": {
                  bgcolor: "#1565c0",
                },
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              }}
              startIcon={<FaVolumeUp />}
            >
              Download Video
            </Button>
          </Box>
          <PreviewDialog />
        </Box>
      );

    case "audio":
      return mediaError ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 80,
            bgcolor: "#ffecb3",
            borderRadius: 4,
            border: "2px dashed #ff9800",
          }}
        >
          <Typography color="text.secondary">Audio not available</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            bgcolor: "#e3f2fd",
            borderRadius: 4,
            border: "2px solid #2196f3",
            boxShadow: "0 4px 12px rgba(33,150,243,0.2)",
          }}
        >
          <FaVolumeUp
            size={30}
            color="#2196f3"
            style={{ marginRight: "16px" }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <audio
              controls
              style={{ width: "100%" }}
              onError={handleMediaError}
            >
              <source src={content.media_url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{
              ml: 2,
              borderRadius: "20px",
              bgcolor: "#2196f3",
              "&:hover": {
                bgcolor: "#1565c0",
              },
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
            onClick={() =>
              downloadContent(content.media_url, getFileName(content.media_url))
            }
            startIcon={<FaVolumeUp />}
          >
            Save Sound
          </Button>
        </Box>
      );

    case "document": {
      const fileExt = getFileExtension(content.media_url);
      return mediaError ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 100,
            bgcolor: "#ffecb3",
            borderRadius: 4,
            border: "2px dashed #ff9800",
          }}
        >
          <Typography color="text.secondary">Document not available</Typography>
        </Box>
      ) : (
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 3,
              bgcolor: "#fff3e0",
              borderRadius: 4,
              boxShadow: "0 4px 12px rgba(255,152,0,0.2)",
              border: "2px solid #ff9800",
            }}
          >
            <Box sx={{ mr: 3 }}>{getFileIcon(fileExt)}</Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {content.body || "Document"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Fun reading material!
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={handlePreviewOpen}
                color="primary"
                size="small"
                sx={{
                  bgcolor: "#ff9800",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#f57c00",
                  },
                  borderRadius: "12px",
                }}
              >
                <ZoomInIcon />
              </IconButton>
              <Button
                variant="contained"
                size="small"
                href={content.media_url}
                download
                sx={{
                  borderRadius: "20px",
                  bgcolor: "#ff9800",
                  "&:hover": {
                    bgcolor: "#f57c00",
                  },
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                }}
                startIcon={<FaFileAlt />}
              >
                Save Document
              </Button>
            </Box>
          </Box>
          <PreviewDialog />
        </Box>
      );
    }

    case "game":
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 3,
            bgcolor: "#f3e5f5",
            borderRadius: 4,
            boxShadow: "0 4px 12px rgba(156,39,176,0.2)",
            border: "2px solid #9c27b0",
          }}
        >
          <Box sx={{ mr: 3 }}>
            <FaGamepad size={30} color="#9c27b0" />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {content.body || "Fun Game"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Let's play and learn!
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            href={content.media_url}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<FaGamepad />}
            sx={{
              borderRadius: "20px",
              bgcolor: "#9c27b0",
              "&:hover": {
                bgcolor: "#7b1fa2",
              },
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            Play Now!
          </Button>
        </Box>
      );

    default:
      // Generic file handler for other types
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 3,
            bgcolor: "#e8f5e9",
            borderRadius: 4,
            boxShadow: "0 4px 12px rgba(76,175,80,0.2)",
            border: "2px solid #4caf50",
          }}
        >
          <Box sx={{ mr: 3 }}>{getFileIcon("default")}</Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {content.body || "Super Cool File"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {content.content_type.toUpperCase()} Treasure
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            href={content.media_url}
            target="_blank"
            rel="noopener noreferrer"
            download
            sx={{
              borderRadius: "20px",
              bgcolor: "#4caf50",
              "&:hover": {
                bgcolor: "#388e3c",
              },
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
            startIcon={<FaStar />}
          >
            Get Treasure
          </Button>
        </Box>
      );
  }
};

// New map component
const MapNode = ({ topic, index, onClick, isActive, completed }) => {
  const theme = useTheme();

  // Map markers/points based on index
  const getMapIcon = (index) => {
    const icons = [
      <FaCampground size={24} />,
      <FaMountain size={24} />,
      <FaTree size={24} />,
      <FaWater size={24} />,
    ];
    return icons[index % icons.length];
  };

  // Colors for different nodes
  const getNodeColor = (index) => {
    const colors = [
      "#4caf50", // Green
      "#2196f3", // Blue
      "#ff9800", // Orange
      "#9c27b0", // Purple
      "#e91e63", // Pink
    ];
    return colors[index % colors.length];
  };

  return (
    <Tooltip title={topic.title} arrow placement="top">
      <Box
        onClick={() => onClick(topic.id)}
        sx={{
          position: "relative",
          width: 80,
          height: 80,
          cursor: "pointer",
          transition: "all 0.3s ease",
          transform: isActive ? "scale(1.15)" : "scale(1)",
          zIndex: isActive ? 10 : 1,
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: getNodeColor(index),
            boxShadow: isActive
              ? `0 0 0 4px ${
                  theme.palette.background.paper
                }, 0 0 0 8px ${getNodeColor(index)}, 0 5px 20px rgba(0,0,0,0.5)`
              : `0 4px 12px rgba(0,0,0,0.2)`,
            border: completed ? "3px solid gold" : "none",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: `0 0 0 2px ${
                theme.palette.background.paper
              }, 0 0 0 4px ${getNodeColor(index)}, 0 8px 16px rgba(0,0,0,0.3)`,
            },
          }}
        >
          {getMapIcon(index)}
        </Avatar>
        {completed && (
          <Box
            sx={{
              position: "absolute",
              top: -8,
              right: -8,
              bgcolor: "gold",
              borderRadius: "50%",
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            }}
          >
            <FaStar size={14} color="#fff" />
          </Box>
        )}
      </Box>
    </Tooltip>
  );
};

// Main component
const LearningAdventureMap = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAgeGroup, setUserAgeGroup] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [completedTopics, setCompletedTopics] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);

        // Get user's profile including ban status
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("date_of_birth, is_banned, banned_at, banned_reason")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        // Check if user is banned
        if (profile?.is_banned) {
          setError({
            type: "banned",
            message:
              profile.banned_reason || "Your account has been suspended.",
            bannedAt: profile.banned_at,
          });
          setLoading(false);
          return;
        }

        if (profile?.date_of_birth) {
          const age = calculateAge(profile.date_of_birth);
          const ageGroup = getAgeGroup(age);
          setUserAgeGroup(ageGroup);

          // Fetch topics for user's age group with proper ordering
          if (ageGroup) {
            const { data: topicsData, error: topicsError } = await supabase
              .from("topics")
              .select(
                `
              id,
              title,
              description,
              age_group,
              is_published,
              created_at,
              subtopics (
                id,
                title,
                order_no,
                contents (
                  id,
                  content_type,
                  body,
                  media_url,
                  order_no
                )
              )
            `
              )
              .eq("age_group", ageGroup)
              .eq("is_published", true)
              .order("created_at", { ascending: true });

            if (topicsError) throw topicsError;

            // Process the topics data to get signed URLs for media content
            const processedTopicsData = await Promise.all(
              topicsData?.map(async (topic) => ({
                ...topic,
                subtopics: await Promise.all(
                  (topic.subtopics || [])
                    .sort((a, b) => a.order_no - b.order_no)
                    .map(async (subtopic) => ({
                      ...subtopic,
                      contents: await Promise.all(
                        (subtopic.contents || [])
                          .sort((a, b) => a.order_no - b.order_no)
                          .map(async (content) => {
                            if (
                              content.media_url &&
                              content.content_type !== "text"
                            ) {
                              // Extract path from media_url if it's a storage URL
                              const path =
                                content.media_url.split("content-bucket/")[1];
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
                      ),
                    }))
                ),
              }))
            );

            setTopics(processedTopicsData || []);

            // Generate some sample completed topics
            if (processedTopicsData?.length > 0) {
              // For demo purposes, mark some topics as completed
              const sampleCompleted = [];
              if (processedTopicsData.length > 2) {
                sampleCompleted.push(processedTopicsData[0].id);
              }
              setCompletedTopics(sampleCompleted);
            }
          }
        }
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  // Handle topic selection
  const handleSelectTopic = (topicId) => {
    const topic = topics.find((t) => t.id === topicId);
    setSelectedTopic(topic);
    setContentDialogOpen(true);
  };

  // Handle subtopic selection
  const handleSelectSubtopic = (subtopicId) => {
    if (selectedTopic) {
      const subtopic = selectedTopic.subtopics.find((s) => s.id === subtopicId);
      setSelectedSubtopic(subtopic);
    }
  };

  const handleCloseContentDialog = () => {
    setContentDialogOpen(false);
    setSelectedSubtopic(null);
  };

  // Colors for map paths
  const getTopicColor = (index) => {
    const colors = [
      "#4caf50", // Green
      "#2196f3", // Blue
      "#ff9800", // Orange
      "#9c27b0", // Purple
      "#e91e63", // Pink
    ];
    return colors[index % colors.length];
  };

  // Map Layout Settings
  const generateMapCoordinates = (count) => {
    const coordinates = [];

    // Create a winding path
    if (count <= 0) return coordinates;

    // Start point
    coordinates.push({ x: 100, y: 400 });

    if (count === 1) return coordinates;

    // First bend
    coordinates.push({ x: 250, y: 300 });

    if (count === 2) return coordinates;

    // Second bend
    coordinates.push({ x: 400, y: 400 });

    if (count === 3) return coordinates;

    // Third bend
    coordinates.push({ x: 550, y: 250 });

    if (count === 4) return coordinates;

    // Fourth bend
    coordinates.push({ x: 700, y: 350 });

    // Add more points if needed
    for (let i = 5; i < count; i++) {
      coordinates.push({
        x: 100 + ((i * 120) % 800),
        y: 200 + Math.sin(i * 0.8) * 150,
      });
    }

    return coordinates;
  };

  // ... Previous code remains the same ...

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#e8f5e9",
          backgroundImage:
            'url(\'data:image/svg+xml,%3Csvg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z" fill="%234caf50" fill-opacity="0.1" fill-rule="evenodd"/%3E%3C/svg%3E\')',
        }}
      >
        <Typography variant="h4" color="primary" gutterBottom>
          Loading Your Adventure Map
        </Typography>
        <CircularProgress color="primary" size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert
          severity="error"
          icon={<ErrorOutline fontSize="large" />}
          sx={{ p: 3, borderRadius: 4, mb: 4 }}
        >
          <Typography variant="h5" gutterBottom>
            {error.type === "banned" ? "Account Suspended" : "Error"}
          </Typography>
          <Typography variant="body1">{error.message || error}</Typography>
          {error.type === "banned" && error.bannedAt && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Account suspended on:{" "}
              {new Date(error.bannedAt).toLocaleDateString()}
            </Typography>
          )}
        </Alert>
      </Container>
    );
  }

  if (!userAgeGroup || topics.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            textAlign: "center",
            bgcolor: "#f5f5f5",
          }}
        >
          <MenuBookIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            No Adventures Available
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We're preparing exciting learning adventures for you! Check back
            soon.
          </Typography>
        </Paper>
      </Container>
    );
  }

  // Content Dialog for selected topic
  const ContentDialog = () => (
    <Dialog
      open={contentDialogOpen}
      onClose={handleCloseContentDialog}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          border: "3px solid",
          borderColor: selectedTopic
            ? getTopicColor(topics.indexOf(selectedTopic))
            : "primary.main",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: selectedTopic
            ? getTopicColor(topics.indexOf(selectedTopic))
            : "primary.main",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {selectedTopic?.title || "Topic"}
        </Typography>
        <IconButton onClick={handleCloseContentDialog} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            display: "flex",
            height: "70vh",
            overflow: "hidden",
          }}
        >
          {/* Subtopics sidebar */}
          <Box
            sx={{
              width: 250,
              bgcolor: "#f5f5f5",
              borderRight: "1px solid",
              borderColor: "divider",
              overflow: "auto",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                p: 2,
                fontWeight: "bold",
                bgcolor: "rgba(0,0,0,0.05)",
              }}
            >
              Learning Path
            </Typography>
            {selectedTopic?.subtopics.map((subtopic, index) => (
              <Box
                key={subtopic.id}
                onClick={() => handleSelectSubtopic(subtopic.id)}
                sx={{
                  p: 2,
                  cursor: "pointer",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  bgcolor:
                    selectedSubtopic?.id === subtopic.id
                      ? "rgba(0,0,0,0.08)"
                      : "transparent",
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.05)",
                  },
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    mr: 2,
                    bgcolor: selectedTopic
                      ? getTopicColor(topics.indexOf(selectedTopic))
                      : "primary.main",
                  }}
                >
                  {index + 1}
                </Avatar>
                <Typography variant="body1">{subtopic.title}</Typography>
                {selectedSubtopic?.id === subtopic.id && (
                  <ChevronRightIcon sx={{ ml: "auto" }} />
                )}
              </Box>
            ))}
          </Box>

          {/* Content display area */}
          <Box
            sx={{
              flexGrow: 1,
              p: 3,
              overflow: "auto",
              bgcolor: "white",
            }}
          >
            {selectedSubtopic ? (
              <>
                <Typography
                  variant="h6"
                  component="div" // Changed from default h6 element to div
                  gutterBottom
                  sx={{
                    pb: 2,
                    borderBottom: "2px solid",
                    borderColor: selectedTopic
                      ? getTopicColor(topics.indexOf(selectedTopic))
                      : "primary.main",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FaMapSigns
                    size={24}
                    color={
                      selectedTopic
                        ? getTopicColor(topics.indexOf(selectedTopic))
                        : "#1976d2"
                    }
                    style={{ marginRight: 12 }}
                  />
                  {selectedSubtopic.title}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    mt: 2,
                  }}
                >
                  {selectedSubtopic.contents?.length > 0 ? (
                    selectedSubtopic.contents.map((content) => (
                      <ContentRenderer key={content.id} content={content} />
                    ))
                  ) : (
                    <Typography
                      color="text.secondary"
                      sx={{ py: 4, textAlign: "center" }}
                    >
                      No content available yet for this section.
                    </Typography>
                  )}
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaCompass size={80} color="#bdbdbd" />
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ mt: 3, textAlign: "center" }}
                >
                  Select a section from the learning path to start your
                  adventure!
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );

  // Generate coordinates for map nodes
  const coordinates = generateMapCoordinates(topics.length);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            bgcolor: "#e8f5e9",
            backgroundImage:
              'url(\'data:image/svg+xml,%3Csvg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z" fill="%234caf50" fill-opacity="0.1" fill-rule="evenodd"/%3E%3C/svg%3E\')',
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 4,
              alignItems: "center",
            }}
          >
            <Typography variant="h4" color="primary" fontWeight="bold">
              Learning Adventure Map
            </Typography>
            <Chip
              label={`Age Group: ${userAgeGroup}`}
              color="secondary"
              sx={{ fontWeight: "bold", px: 1 }}
            />
          </Box>

          <Paper
            elevation={2}
            sx={{
              p: 4,
              borderRadius: 4,
              bgcolor: "#fff",
              height: "500px",
              position: "relative",
              overflow: "hidden",
              mb: 4,
              backgroundImage:
                'url(\'data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%234caf50" fill-opacity="0.05" fill-rule="evenodd"/%3E%3C/svg%3E\')',
            }}
          >
            {/* Draw connections between points */}
            {coordinates.length > 1 &&
              coordinates.slice(0, -1).map((start, index) => {
                const end = coordinates[index + 1];
                const color = getTopicColor(index);

                // Calculate angle for the line
                const dx = end.x - start.x;
                const dy = end.y - start.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);

                return (
                  <Box
                    key={`path-${index}`}
                    sx={{
                      position: "absolute",
                      top: start.y + 40,
                      left: start.x + 40,
                      height: 6,
                      width: distance,
                      bgcolor: completedTopics.includes(topics[index]?.id)
                        ? "gold"
                        : color,
                      borderRadius: 3,
                      transform: `rotate(${angle}deg)`,
                      transformOrigin: "left center",
                      zIndex: 0,
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  />
                );
              })}

            {/* Place map nodes */}
            {topics.map((topic, index) => {
              if (index >= coordinates.length) return null;
              const coord = coordinates[index];
              return (
                <Box
                  key={topic.id}
                  sx={{
                    position: "absolute",
                    top: coord.y,
                    left: coord.x,
                  }}
                >
                  <Zoom
                    in={true}
                    style={{
                      transitionDelay: `${index * 150}ms`,
                    }}
                  >
                    <Box>
                      <MapNode
                        topic={topic}
                        index={index}
                        onClick={handleSelectTopic}
                        isActive={selectedTopic?.id === topic.id}
                        completed={completedTopics.includes(topic.id)}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "0.85rem",
                          maxWidth: 100,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {topic.title}
                      </Typography>
                    </Box>
                  </Zoom>
                </Box>
              );
            })}

            {/* Flag for start/finish */}
            {coordinates.length > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: coordinates[0].y - 20,
                  left: coordinates[0].x - 20,
                }}
              >
                <Tooltip
                  title="Start your adventure here!"
                  arrow
                  placement="top"
                >
                  <Box sx={{ color: "#4caf50" }}>
                    <FaFlag size={32} />
                  </Box>
                </Tooltip>
              </Box>
            )}

            {coordinates.length > 1 && (
              <Box
                sx={{
                  position: "absolute",
                  top: coordinates[coordinates.length - 1].y - 20,
                  left: coordinates[coordinates.length - 1].x + 80,
                }}
              >
                <Tooltip
                  title="Complete all adventures to reach the finish!"
                  arrow
                  placement="top"
                >
                  <Box sx={{ color: "#f44336" }}>
                    <FaFlag size={32} />
                  </Box>
                </Tooltip>
              </Box>
            )}
          </Paper>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Click on any adventure point to start exploring!
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Topic content dialog */}
      <ContentDialog />
    </Container>
  );
};

export default LearningAdventureMap;
