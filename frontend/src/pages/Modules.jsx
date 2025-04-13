/* eslint-disable no-unused-vars */
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
  FaStar,
  FaCheck,
  FaHome,
  FaTree,
  FaMountain,
  FaLock,
  FaMapMarkedAlt,
  FaTrophy,
  FaFlagCheckered,
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

// ContentRenderer component remains unchanged
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

// Main component
const AdventureMapUI = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAgeGroup, setUserAgeGroup] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [completedLocations, setCompletedLocations] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  // Pre-defined adventure locations
  const adventureLocations = [
    {
      id: "village",
      title: "The Village",
      difficulty: "Easy",
      icon: <FaHome size={24} />,
      color: "#3498db",
      completed: true,
      description: "Start your journey in the friendly village. Perfect for beginners!",
      subtopics: []
    },
    {
      id: "forest",
      title: "The Forest",
      difficulty: "Medium",
      icon: <FaTree size={24} />,
      color: "#e67e22",
      completed: true,
      description: "Explore the mysterious forest and discover new knowledge.",
      subtopics: []
    },
    {
      id: "peak",
      title: "The Peak",
      difficulty: "Hard",
      icon: <FaMountain size={24} />,
      color: "#9b59b6",
      completed: false,
      description: "Reach the summit and become a master of this subject!",
      subtopics: []
    }
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);

        // Get user's profile - removed username from query
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, avatar_url, date_of_birth, is_banned, banned_at, banned_reason")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        // Check if user is banned
        if (profile?.is_banned) {
          setError({
            type: "banned",
            message: profile.banned_reason || "Your account has been suspended.",
            bannedAt: profile.banned_at,
          });
          setLoading(false);
          return;
        }

        setUserProfile(profile);

        if (profile?.date_of_birth) {
          const age = calculateAge(profile.date_of_birth);
          const ageGroup = getAgeGroup(age);
          setUserAgeGroup(ageGroup);

          // Fetch topics for user's age group
          if (ageGroup) {
            const { data: topicsData, error: topicsError } = await supabase
              .from("topics")
              .select(`
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
              `)
              .eq("age_group", ageGroup)
              .eq("is_published", true)
              .order("created_at", { ascending: true });

            if (topicsError) throw topicsError;

            // Process topics data and distribute to adventure locations
            if (topicsData?.length > 0) {
              const processedData = await Promise.all(
                topicsData.map(async (topic) => ({
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
                              if (content.media_url && content.content_type !== "text") {
                                const path = content.media_url.split("content-bucket/")[1];
                                if (path) {
                                  const signedUrl = await getSignedUrl(path);
                                  return { ...content, media_url: signedUrl || content.media_url };
                                }
                              }
                              return content;
                            })
                        ),
                      }))
                  ),
                }))
              );
              
              // Distribute topics to adventure locations
              const updatedLocations = [...adventureLocations];
              processedData.forEach((topic, index) => {
                const locationIndex = index % updatedLocations.length;
                updatedLocations[locationIndex].subtopics.push(topic);
              });
              
              setTopics(updatedLocations);
              
              // For demonstration, mark some locations as completed
              setCompletedLocations(["village", "forest"]);
            } else {
              setTopics(adventureLocations);
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

  const handleSelectLocation = (locationId) => {
    const location = topics.find((t) => t.id === locationId);
    if (location) {
      setSelectedLocation(location);
      setContentDialogOpen(true);
    }
  };

  const handleSelectSubtopic = (subtopicId) => {
    if (selectedLocation) {
      const foundSubtopic = selectedLocation.subtopics.flatMap(topic => 
        topic.subtopics.find(s => s.id === subtopicId)
      ).filter(Boolean)[0];
      setSelectedSubtopic(foundSubtopic);
    }
  };

  const handleCloseContentDialog = () => {
    setContentDialogOpen(false);
    setSelectedSubtopic(null);
  };

  // Rendering the adventure map UI
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f5f5",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert
          severity="error"
          sx={{ borderRadius: 2 }}
        >
          <Typography variant="h6">{error.type === "banned" ? "Account Suspended" : "Error"}</Typography>
          <Typography>{error.message || error}</Typography>
        </Alert>
      </Container>
    );
  }

  const LocationButton = ({ location }) => {
    const isCompleted = completedLocations.includes(location.id);
    const isLocked = location.id === "peak" && !completedLocations.includes("forest");
    
    return (
      <Box>
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <Typography variant="h6">{location.title}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{location.difficulty}</Typography>
        </Box>
        <Box
          onClick={() => !isLocked && handleSelectLocation(location.id)}
          sx={{
            position: 'relative',
            width: 120,
            height: 120,
            borderRadius: '50%',
            backgroundColor: isLocked ? '#e0e0e0' : location.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isLocked ? 'not-allowed' : 'pointer',
            opacity: isLocked ? 0.7 : 1,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: isLocked ? 'none' : 'translateY(-5px)',
              boxShadow: isLocked ? 'none' : '0 10px 20px rgba(0,0,0,0.2)'
            },
            border: isLocked ? '4px dashed #bdbdbd' : '4px solid white',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
          }}
        >
          <Box sx={{ color: 'white', fontSize: '2rem' }}>
            {isLocked ? <FaLock size={40} /> : location.icon}
          </Box>
          
          {isCompleted && (
            <Box
              sx={{
                position: 'absolute',
                top: -10,
                right: -10,
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#2ecc71',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid white',
              }}
            >
              <FaCheck color="white" size={20} />
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  // Content Dialog for selected location
  const ContentDialog = () => (
    <Dialog
      open={contentDialogOpen}
      onClose={handleCloseContentDialog}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle
        sx={{
          bgcolor: selectedLocation?.color || 'primary.main',
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">{selectedLocation?.title || 'Location'}</Typography>
          <IconButton color="inherit" onClick={handleCloseContentDialog}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', height: '70vh' }}>
          {/* Sidebar */}
          <Box sx={{ width: 250, borderRight: '1px solid #e0e0e0', p: 2, overflow: 'auto' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Adventure Tasks
            </Typography>
            {selectedLocation?.subtopics.map((topic) => (
              <Box key={topic.id} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {topic.title}
                </Typography>
                {topic.subtopics.map((subtopic, idx) => (
                  <Box
                    key={subtopic.id}
                    onClick={() => handleSelectSubtopic(subtopic.id)}
                    sx={{
                      p: 1.5,
                      mb: 0.5,
                      borderRadius: 1,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      bgcolor: selectedSubtopic?.id === subtopic.id ? 'rgba(0,0,0,0.05)' : 'transparent',
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.05)'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: selectedLocation.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        mr: 1.5,
                        fontSize: '0.8rem'
                      }}
                    >
                      {idx + 1}
                    </Box>
                    <Typography variant="body2">{subtopic.title}</Typography>
                  </Box>
                ))}
              </Box>
            ))}
            {selectedLocation?.subtopics.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                No quests available for this location yet.
              </Typography>
            )}
          </Box>

          {/* Content area */}
          <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
            {selectedSubtopic ? (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {selectedSubtopic.title}
                </Typography>
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {selectedSubtopic.contents?.length > 0 ? (
                    selectedSubtopic.contents.map((content) => (
                      <ContentRenderer key={content.id} content={content} />
                    ))
                  ) : (
                    <Typography color="text.secondary">No content available yet.</Typography>
                  )}
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', mt: 8 }}>
                <FaMapMarkedAlt size={60} color="#bdbdbd" />
                <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
                  Select a quest from the sidebar to begin your adventure!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Complete all quests to earn badges and unlock new locations.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          bgcolor: '#4c4c4c',
          color: 'white',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: 'inset 0 0 0 4px rgba(255,255,255,0.05), 0 10px 30px rgba(0,0,0,0.2)',
          height: { xs: 'auto', md: '80vh' }
        }}
      >
        {/* Left sidebar - User profile */}
        <Box
          sx={{
            width: { xs: '100%', md: 300 },
            bgcolor: '#333',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar
            src={userProfile?.avatar_url}
            sx={{
              width: 120,
              height: 120,
              mb: 2,
              border: '4px solid #1e88e5',
              bgcolor: '#1e88e5'
            }}
          >
            {user?.email?.charAt(0)}
          </Avatar>
          
          <Typography variant="h5" sx={{ mb: 1 }}>
            {user?.email?.split('@')[0] || 'Jane'}
          </Typography>
          
          <Box
            sx={{
              width: '100%',
              mt: 6,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            {adventureLocations.map((location) => (
              <Box
                key={location.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderRadius: 3,
                  bgcolor: selectedLocation?.id === location.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.05)'
                  },
                  cursor: 'pointer'
                }}
                onClick={() => handleSelectLocation(location.id)}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: location.color, 
                    opacity: location.id === 'peak' && !completedLocations.includes('forest') ? 0.5 : 1
                  }}
                >
                  {location.icon}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography>{location.title}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {location.difficulty}
                  </Typography>
                </Box>
                {completedLocations.includes(location.id) ? (
                  <FaCheck color="#4caf50" size={20} />
                ) : location.id === 'peak' && !completedLocations.includes('forest') ? (
                  <FaLock size={18} color="#bdbdbd" />
                ) : null}
              </Box>
            ))}
          </Box>
        </Box>
        
        {/* Main area - Adventure map */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            backgroundImage: `url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" fill="%23ffffff" fill-opacity="0.05" fill-rule="evenodd"/%3E%3C/svg%3E')`,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              flexGrow: 1,
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 3,
              border: '4px solid white',
              backgroundImage: `url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" fill="%2362d0ff" fill-opacity="0.1" fill-rule="evenodd"/%3E%3C/svg%3E')`,
              backgroundColor: '#81d4fa',
              backgroundSize: '80px 80px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              p: 4,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                animation: 'pulse 8s infinite',
                pointerEvents: 'none',
              },
              '@keyframes pulse': {
                '0%': {
                  opacity: 0.5,
                  backgroundSize: '100% 100%',
                },
                '50%': {
                  opacity: 0.8,
                  backgroundSize: '120% 120%',  
                },
                '100%': {
                  opacity: 0.5,
                  backgroundSize: '100% 100%',
                },
              }
            }}
          >
            {/* Map Instructions */}
            <Box 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.8)',
                borderRadius: 2,
                p: 2,
                mb: 4,
                maxWidth: 600,
                position: 'relative',
                overflow: 'hidden',
                zIndex: 2,
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
            >
              <Typography variant="h5" gutterBottom>Adventure Map</Typography>
              <Box component="ol" sx={{ pl: 3, m: 0 }}>
                <Typography component="li" sx={{ mb: 1 }}>Visit each point on the map</Typography>
                <Typography component="li" sx={{ mb: 1 }}>Answer the questions correctly</Typography>
                <Typography component="li">Earn all three badges</Typography>
              </Box>
            </Box>
            
            {/* Main Map Area */}
            <Box sx={{ position: 'relative', height: '70%' }}>
              {/* Sky Background with Clouds */}
              <Box sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '60%', 
                background: 'linear-gradient(to bottom, #64b5f6, #90caf9)',
                zIndex: 0 
              }}>
                {/* Sun moved higher up */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '15%',
                    left: '10%',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#ffeb3b',
                    boxShadow: '0 0 20px 5px rgba(255, 235, 59, 0.7)',
                    animation: 'sun-pulse 5s infinite alternate',
                    zIndex: 1,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 235, 59, 0.4)',
                      animation: 'sun-halo 3s infinite',
                      transform: 'scale(1.2)',
                    },
                    '@keyframes sun-pulse': {
                      '0%': { transform: 'scale(1)' },
                      '100%': { transform: 'scale(1.1)' }
                    },
                    '@keyframes sun-halo': {
                      '0%, 100%': { opacity: 0.3, transform: 'scale(1.2)' },
                      '50%': { opacity: 0.6, transform: 'scale(1.4)' }
                    }
                  }}
                >
                  {/* Sun rays */}
                  {[...Array(8)].map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '40px',
                        height: '2px',
                        backgroundColor: '#ffeb3b',
                        transformOrigin: '0 0',
                        transform: `rotate(${i * 45}deg)`,
                        animation: `ray-pulse 3s infinite ${i * 0.2}s`,
                        '@keyframes ray-pulse': {
                          '0%, 100%': { opacity: 0.7, width: '40px' },
                          '50%': { opacity: 1, width: '50px' }
                        }
                      }}
                    />
                  ))}
                </Box>
                
                {/* Rainbow moved higher */}
                <Box sx={{
                  position: 'absolute',
                  top: '15%',
                  right: '15%',
                  width: '100px',
                  height: '50px',
                  overflow: 'hidden',
                  zIndex: 1,
                  opacity: 0.7,
                  animation: 'rainbow-appear 10s infinite',
                  '@keyframes rainbow-appear': {
                    '0%, 100%': { opacity: 0.2 },
                    '50%': { opacity: 0.7 }
                  }
                }}>
                  {['#f44336', '#ff9800', '#ffeb3b', '#4caf50', '#2196f3', '#9c27b0'].map((color, i) => (
                    <Box
                      key={i}
                      sx={{
                        position: 'absolute',
                        top: i * 4,
                        left: 0,
                        right: 0,
                        height: '10px',
                        borderRadius: '50% 50% 0 0',
                        border: `3px solid ${color}`,
                        borderBottom: 'none',
                      }}
                    />
                  ))}
                </Box>
                
                {/* More clouds in the sky - floating at different speeds */}
                {[...Array(6)].map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      position: 'absolute',
                      top: `${10 + (i % 3) * 15}%`,
                      left: `${(i * 15) % 80}%`,
                      width: `${60 + Math.random() * 40}px`,
                      height: `${30 + Math.random() * 20}px`,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                      animation: `cloud-float-${i} ${20 + i * 7}s infinite linear`,
                      zIndex: 1,
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '20%',
                        width: '60%',
                        height: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        bottom: '5%',
                        right: '10%',
                        width: '40%',
                        height: '60%',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      },
                      [`@keyframes cloud-float-${i}`]: {
                        '0%': { transform: 'translateX(-100px)' },
                        '100%': { transform: 'translateX(calc(100vw + 100px))' }
                      }
                    }}
                  />
                ))}
              </Box>
              
              {/* Ground Element */}
              <Box sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                width: '100%', 
                height: '40%',
                background: 'linear-gradient(to top, #8d6e63 0%, #a1887f 15%, #81c784 15%, #66bb6a 100%)',
                borderTopLeftRadius: '50% 20%',
                borderTopRightRadius: '50% 20%',
                boxShadow: 'inset 0 5px 15px rgba(0,0,0,0.2)',
                zIndex: 1,
                overflow: 'visible',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '15%',
                  background: '#8d6e63',
                  borderTopLeftRadius: '15px',
                  borderTopRightRadius: '15px',
                }
              }}>
                {/* Ground details - small grass tufts */}
                {[...Array(20)].map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      position: 'absolute',
                      bottom: '15%',
                      left: `${5 + (i * 5)}%`,
                      width: '4px',
                      height: `${5 + Math.random() * 8}px`,
                      backgroundColor: '#33691e',
                      transformOrigin: 'bottom center',
                      animation: `grass-sway-${i} ${2 + Math.random() * 2}s infinite alternate`,
                      [`@keyframes grass-sway-${i}`]: {
                        '0%': { transform: 'rotate(-5deg)' },
                        '100%': { transform: 'rotate(5deg)' }
                      }
                    }}
                  />
                ))}
              </Box>

              {/* Animated flowing river connecting all locations */}
              <svg 
                width="100%" 
                height="100%" 
                style={{ position: 'absolute', top: 0, left: 0, zIndex: 2, pointerEvents: 'none' }}
              >
                {/* Main river path connecting all locations - adjusted to match new layout */}
                <path 
                  d="M15% 85% C25% 75%, 40% 65%, 50% 50% C55% 45%, 70% 45%, 85% 55%" 
                  fill="none"
                  stroke="#2196f3"
                  strokeWidth="20"
                  strokeLinecap="round"
                  style={{
                    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))',
                  }}
                />
                {/* Blue river overlay with animation */}
                <path 
                  d="M15% 85% C25% 75%, 40% 65%, 50% 50% C55% 45%, 70% 45%, 85% 55%" 
                  fill="none"
                  stroke="#64b5f6"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray="20,10"
                  style={{
                    strokeDashoffset: 0,
                    animation: 'flow 30s linear infinite',
                  }}
                />
                {/* Lighter blue sparkles on river */}
                <path 
                  d="M15% 85% C25% 75%, 40% 65%, 50% 50% C55% 45%, 70% 45%, 85% 55%" 
                  fill="none"
                  stroke="#e3f2fd"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="5,15"
                  style={{
                    strokeDashoffset: 0,
                    animation: 'sparkle 20s linear infinite reverse',
                    opacity: 0.7,
                  }}
                />
                
                {/* Add CSS animations for the river */}
                <style>{`
                  @keyframes flow {
                    to {
                      stroke-dashoffset: -200;
                    }
                  }
                  @keyframes sparkle {
                    to {
                      stroke-dashoffset: 200;
                    }
                  }
                  @keyframes ripple {
                    0% { r: 0; opacity: 0.8; }
                    100% { r: 15; opacity: 0; }
                  }
                `}</style>
                
                {/* Water ripples along the river */}
                {[...Array(8)].map((_, i) => (
                  <circle
                    key={i}
                    cx={`${20 + (i * 10)}%`}
                    cy={`${85 - (i * 5)}%`}
                    r="2"
                    fill="#90caf9"
                    style={{
                      animation: `ripple ${3 + i * 0.5}s infinite ease-out ${i * 0.7}s`,
                    }}
                  />
                ))}
              </svg>

              {/* Houses for the three locations, styled like buildings on the ground */}
              {/* Village House - First Location (left) */}
              <Box
                sx={{
                  position: 'absolute',
                  left: '15%',
                  bottom: '20%',
                  width: '120px',
                  height: '140px',
                  zIndex: 3,
                  cursor: 'pointer',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05) translateY(-5px)'
                  }
                }}
                onClick={() => handleSelectLocation("village")}
              >
                {/* House base */}
                <Box sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: '10%',
                  width: '80%',
                  height: '70px',
                  backgroundColor: '#e57373',
                  borderRadius: '5px',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: '2px solid #c62828'
                }}>
                  {/* Door */}
                  <Box sx={{
                    position: 'absolute',
                    bottom: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '30px',
                    height: '40px',
                    backgroundColor: '#6d4c41',
                    borderRadius: '5px 5px 0 0',
                    border: '1px solid #5d4037',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Box sx={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#ffc107' }} />
                  </Box>
                  {/* Windows */}
                  <Box sx={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#bbdefb',
                    border: '1px solid #1976d2',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    padding: '2px',
                  }}>
                    <Box sx={{ backgroundColor: 'rgba(255,255,255,0.5)' }} />
                    <Box sx={{ backgroundColor: 'rgba(255,255,255,0.5)' }} />
                    <Box sx={{ backgroundColor: 'rgba(255,255,255,0.5)' }} />
                    <Box sx={{ backgroundColor: 'rgba(255,255,255,0.5)' }} />
                  </Box>
                  <Box sx={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#bbdefb',
                    border: '1px solid #1976d2',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    padding: '2px',
                  }}>
                    <Box sx={{ backgroundColor: 'rgba(255,255,255,0.5)' }} />
                    <Box sx={{ backgroundColor: 'rgba(255,255,255,0.5)' }} />
                    <Box sx={{ backgroundColor: 'rgba(255,255,255,0.5)' }} />
                    <Box sx={{ backgroundColor: 'rgba(255,255,255,0.5)' }} />
                  </Box>
                </Box>
                {/* House roof */}
                <Box sx={{
                  position: 'absolute',
                  bottom: '70px',
                  left: '0',
                  width: '100%',
                  height: '50px',
                  backgroundColor: '#b71c1c',
                  clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
                  zIndex: 1,
                  boxShadow: '0 -5px 15px rgba(0,0,0,0.1)',
                }} />
                {/* House sign */}
                <Box sx={{
                  position: 'absolute',
                  bottom: '-20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  padding: '5px',
                  backgroundColor: '#fff8e1',
                  border: '1px solid #ffca28',
                  borderRadius: '4px',
                  textAlign: 'center',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                  zIndex: 4,
                }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#5d4037' }}>
                    The Village
                  </Typography>
                </Box>
                {/* Smoke from chimney */}
                <Box sx={{ position: 'absolute', top: '10px', right: '30px', zIndex: -1 }}>
                  {[...Array(3)].map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        position: 'absolute',
                        width: '10px',
                        height: '10px',
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        borderRadius: '50%',
                        animation: `smoke ${3 + i}s infinite ease-out`,
                        animationDelay: `${i * 0.5}s`,
                        '@keyframes smoke': {
                          '0%': { transform: 'translate(0, 0) scale(1)', opacity: 0.7 },
                          '100%': { transform: 'translate(-15px, -40px) scale(2)', opacity: 0 }
                        }
                      }}
                    />
                  ))}
                </Box>
                {/* Completion badge */}
                {completedLocations.includes("village") && (
                  <Box sx={{ 
                    position: 'absolute',
                    right: '10px',
                    top: '25px',
                    backgroundColor: '#2196f3',
                    color: 'white',
                    borderRadius: '50%',
                    width: 30,
                    height: 30,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid white',
                    zIndex: 4,
                    boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
                    animation: 'pulse-light 2s infinite',
                  }}>
                    <FaCheck size={15} />
                  </Box>
                )}
              </Box>

              {/* Forest Cabin - Middle Location */}
              <Box
                sx={{
                  position: 'absolute',
                  left: '50%',
                  bottom: '18%',
                  width: '130px',
                  height: '120px',
                  transform: 'translateX(-50%)',
                  zIndex: 3,
                  cursor: 'pointer',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateX(-50%) scale(1.05) translateY(-5px)'
                  }
                }}
                onClick={() => handleSelectLocation("forest")}
              >
                {/* Cabin base */}
                <Box sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: '10%',
                  width: '80%',
                  height: '65px',
                  backgroundColor: '#8d6e63',
                  borderRadius: '5px',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: '3px solid #5d4037',
                  backgroundImage: 'repeating-linear-gradient(0deg, #5d4037, #5d4037 3px, #8d6e63 3px, #8d6e63 10px)',
                }}>
                  {/* Door */}
                  <Box sx={{
                    position: 'absolute',
                    bottom: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '25px',
                    height: '35px',
                    backgroundColor: '#4e342e',
                    border: '1px solid #3e2723',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Box sx={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#fdd835' }} />
                  </Box>
                  {/* Windows */}
                  <Box sx={{
                    position: 'absolute',
                    top: '15px',
                    left: '15px',
                    width: '15px',
                    height: '15px',
                    backgroundColor: '#ffecb3',
                    border: '1px solid #4e342e',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    padding: '1px',
                  }}>
                    <Box sx={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
                    <Box sx={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
                    <Box sx={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
                    <Box sx={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
                  </Box>
                  <Box sx={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    width: '15px',
                    height: '15px',
                    backgroundColor: '#ffecb3',
                    border: '1px solid #4e342e',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    padding: '1px',
                  }}>
                    <Box sx={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
                    <Box sx={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
                    <Box sx={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
                    <Box sx={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
                  </Box>
                </Box>
                {/* Cabin roof */}
                <Box sx={{
                  position: 'absolute',
                  bottom: '65px',
                  left: '0',
                  width: '100%',
                  height: '40px',
                  backgroundColor: '#795548',
                  clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
                  zIndex: 1,
                  boxShadow: '0 -5px 15px rgba(0,0,0,0.1)',
                }} />
                {/* Cabin sign */}
                <Box sx={{
                  position: 'absolute',
                  bottom: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '70px',
                  padding: '4px',
                  backgroundColor: '#e8f5e9',
                  border: '1px solid #66bb6a',
                  borderRadius: '4px',
                  textAlign: 'center',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                  zIndex: 4,
                }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                    The Forest
                  </Typography>
                </Box>
                {/* Completion badge */}
                {completedLocations.includes("forest") && (
                  <Box sx={{ 
                    position: 'absolute',
                    right: '15px',
                    top: '20px',
                    backgroundColor: '#2196f3',
                    color: 'white',
                    borderRadius: '50%',
                    width: 30,
                    height: 30,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid white',
                    zIndex: 4,
                    boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
                    animation: 'pulse-light 2s infinite',
                  }}>
                    <FaCheck size={15} />
                  </Box>
                )}
              </Box>

              {/* Mountain Tower - Third Location (right) */}
              <Box
                sx={{
                  position: 'absolute',
                  right: '15%',
                  bottom: '22%',
                  width: '100px',
                  height: '180px',
                  zIndex: completedLocations.includes("forest") ? 3 : 2,
                  opacity: completedLocations.includes("forest") ? 1 : 0.7,
                  cursor: completedLocations.includes("forest") ? 'pointer' : 'not-allowed',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: completedLocations.includes("forest") ? 'scale(1.05) translateY(-5px)' : 'none'
                  }
                }}
                onClick={() => completedLocations.includes("forest") && handleSelectLocation("peak")}
              >
                {/* Tower base */}
                <Box sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: '15%',
                  width: '70%',
                  height: '120px',
                  backgroundColor: completedLocations.includes("forest") ? '#9575cd' : '#bdbdbd',
                  borderRadius: '5px 5px 0 0',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                  border: completedLocations.includes("forest") ? '2px solid #5e35b1' : '2px solid #9e9e9e',
                }}>
                  {/* Windows */}
                  {[...Array(3)].map((_, i) => (
                    <Box 
                      key={i}
                      sx={{
                        position: 'absolute',
                        top: `${20 + i * 30}px`,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '20px',
                        height: '20px',
                        backgroundColor: completedLocations.includes("forest") ? '#d1c4e9' : '#e0e0e0',
                        border: completedLocations.includes("forest") ? '1px solid #7e57c2' : '1px solid #9e9e9e',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {!completedLocations.includes("forest") && i === 1 && (
                        <FaLock size={10} color="#616161" />
                      )}
                    </Box>
                  ))}
                </Box>
                {/* Tower top */}
                <Box sx={{
                  position: 'absolute',
                  bottom: '120px',
                  left: '20%',
                  width: '60%',
                  height: '40px',
                  backgroundColor: completedLocations.includes("forest") ? '#7e57c2' : '#9e9e9e',
                  clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
                  zIndex: 1,
                  boxShadow: '0 -5px 15px rgba(0,0,0,0.1)',
                }}>
                  {/* Snow particles on mountaintop */}
                  {completedLocations.includes("forest") && (
                    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
                      {[...Array(8)].map((_, i) => (
                        <Box
                          key={i}
                          sx={{
                            position: 'absolute',
                            width: '3px',
                            height: '3px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            opacity: 0.8,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `snow ${3 + Math.random() * 7}s infinite linear`,
                            animationDelay: `${Math.random() * 5}s`,
                            '@keyframes snow': {
                              '0%': { transform: 'translateY(0)', opacity: 0 },
                              '20%': { opacity: 0.8 },
                              '100%': { transform: 'translateY(40px)', opacity: 0 }
                            }
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
                {/* Tower sign */}
                <Box sx={{
                  position: 'absolute',
                  bottom: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '70px',
                  padding: '4px',
                  backgroundColor: '#e8eaf6',
                  border: '1px solid #3f51b5',
                  borderRadius: '4px',
                  textAlign: 'center',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                  zIndex: 4,
                }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#303f9f' }}>
                    The Peak
                  </Typography>
                </Box>
                {/* Lock icon for locked peak */}
                {!completedLocations.includes("forest") && (
                  <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                  }}>
                    <FaLock size={20} color="#e0e0e0" />
                  </Box>
                )}
              </Box>

              {/* Add multiple trees around the scene */}
              {[...Array(12)].map((_, i) => (
                <Box 
                  key={i}
                  sx={{
                    position: 'absolute',
                    left: `${5 + Math.random() * 90}%`,
                    bottom: `${15 + Math.random() * 10}%`,
                    width: `${15 + Math.random() * 10}px`,
                    height: `${25 + Math.random() * 15}px`,
                    zIndex: Math.random() > 0.5 ? 2 : 4,
                    transform: `scale(${0.7 + Math.random() * 0.6}) rotate(${-5 + Math.random() * 10}deg)`,
                    display: i < 8 ? 'block' : 'none', // Only show some trees on small screens
                    '@media (min-width: 600px)': {
                      display: 'block', // Show all trees on larger screens
                    },
                  }}
                >
                  {/* Tree trunk */}
                  <Box sx={{ 
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    width: '4px',
                    height: '40%',
                    backgroundColor: '#795548',
                    transform: 'translateX(-50%)',
                  }} />
                  {/* Tree foliage - different types */}
                  {i % 3 === 0 ? (
                    // Pine tree
                    <>
                      <Box sx={{ 
                        position: 'absolute',
                        bottom: '30%',
                        left: '50%',
                        width: '90%',
                        height: '35%',
                        backgroundColor: '#2e7d32',
                        clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
                        transform: 'translateX(-50%)',
                      }} />
                      <Box sx={{ 
                        position: 'absolute',
                        bottom: '45%',
                        left: '50%',
                        width: '80%',
                        height: '30%',
                        backgroundColor: '#388e3c',
                        clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
                        transform: 'translateX(-50%)',
                      }} />
                      <Box sx={{ 
                        position: 'absolute',
                        bottom: '60%',
                        left: '50%',
                        width: '60%',
                        height: '25%',
                        backgroundColor: '#43a047',
                        clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
                        transform: 'translateX(-50%)',
                      }} />
                    </>
                  ) : i % 3 === 1 ? (
                    // Round tree
                    <Box sx={{ 
                      position: 'absolute',
                      bottom: '25%',
                      left: '50%',
                      width: '100%',
                      height: '75%',
                      backgroundColor: '#66bb6a',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      transform: 'translateX(-50%)',
                    }} />
                  ) : (
                    // Oval tree
                    <Box sx={{ 
                      position: 'absolute',
                      bottom: '30%',
                      left: '50%',
                      width: '120%',
                      height: '60%',
                      backgroundColor: '#81c784',
                      borderRadius: '50%',
                      transform: 'translateX(-50%)',
                    }} />
                  )}
                </Box>
              ))}

              {/* Add more butterflies around the houses */}
              {[...Array(5)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    bottom: `${30 + i * 10}%`,
                    left: `${15 + i * 18}%`,
                    width: '12px',
                    height: '12px',
                    zIndex: 5,
                    animation: `butterfly-path-${i} ${15 + i * 5}s infinite ease-in-out`,
                    [`@keyframes butterfly-path-${i}`]: {
                      '0%, 100%': { transform: 'translate(0, 0) rotate(10deg)' },
                      '25%': { transform: `translate(${20 + i * 10}px, ${-30 - i * 5}px) rotate(-10deg)` },
                      '50%': { transform: `translate(${50 + i * 15}px, ${-10 - i * 3}px) rotate(5deg)` },
                      '75%': { transform: `translate(${30 + i * 10}px, ${-20 - i * 4}px) rotate(-5deg)` },
                    }
                  }}
                >
                  {/* Butterfly wings */}
                  <Box sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    '@keyframes wing-flap': {
                      '0%': { transform: 'rotate(-20deg) scaleX(0.8)' },
                      '100%': { transform: 'rotate(20deg) scaleX(1.2)' }
                    }
                  }}>
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '5px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: ['#e91e63', '#9c27b0', '#2196f3', '#ff9800', '#4caf50'][i % 5],
                      animation: 'wing-flap 0.15s infinite alternate',
                    }} />
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '5px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: ['#e91e63', '#9c27b0', '#2196f3', '#ff9800', '#4caf50'][i % 5],
                      animation: 'wing-flap 0.15s infinite alternate-reverse',
                    }} />
                    <Box sx={{
                      position: 'absolute',
                      top: '4px',
                      left: '5.5px',
                      width: '1px',
                      height: '8px',
                      backgroundColor: '#212121',
                      transformOrigin: 'top',
                    }} />
                  </Box>
                </Box>
              ))}

              {/* Floating items on river */}
              <Box sx={{ position: 'absolute', zIndex: 3, left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                {/* Leaf boat on river */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: '30px',
                    height: '20px',
                    bottom: '20%',
                    left: '20%',
                    animation: 'boat-journey 30s linear infinite',
                    '@keyframes boat-journey': {
                      '0%': { transform: 'translate(0, 0) rotate(5deg)', left: '15%', bottom: '20%' },
                      '33%': { transform: 'translate(0, 0) rotate(-5deg)', left: '40%', bottom: '25%' },
                      '66%': { transform: 'translate(0, 0) rotate(5deg)', left: '65%', bottom: '20%' },
                      '100%': { transform: 'translate(0, 0) rotate(-5deg)', left: '85%', bottom: '25%' }
                    }
                  }}
                >
                  <Box sx={{ 
                    width: '100%', 
                    height: '100%', 
                    backgroundColor: '#8bc34a', 
                    borderRadius: '50% 50% 0 0 / 60% 60% 0 0',
                    position: 'relative',
                    transform: 'rotate(-45deg)',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: '40%',
                      left: '50%',
                      width: '6px',
                      height: '15px',
                      backgroundColor: '#795548',
                      transformOrigin: 'bottom',
                      transform: 'translateX(-50%)',
                    },
                  }} />
                </Box>
                
                {/* Rubber duck on river */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: '25px',
                    height: '20px',
                    bottom: '25%',
                    left: '60%',
                    zIndex: 3,
                    animation: 'duck-float 40s linear infinite',
                    '@keyframes duck-float': {
                      '0%': { transform: 'translate(0, 0) rotate(-5deg)', left: '60%', bottom: '25%' },
                      '50%': { transform: 'translate(0, 0) rotate(5deg)', left: '30%', bottom: '22%' },
                      '100%': { transform: 'translate(0, 0) rotate(-5deg)', left: '60%', bottom: '25%' }
                    }
                  }}
                >
                  <Box sx={{ 
                    width: '100%', 
                    height: '100%', 
                    backgroundColor: '#ffeb3b', 
                    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                    position: 'relative',
                    '&::before': { // duck bill
                      content: '""',
                      position: 'absolute',
                      width: '10px',
                      height: '5px',
                      borderRadius: '40% 40% 50% 50%',
                      backgroundColor: '#ff9800',
                      top: '45%',
                      left: '-5px',
                    },
                    '&::after': { // duck eye
                      content: '""',
                      position: 'absolute',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: '#212121',
                      top: '35%',
                      left: '30%',
                    },
                  }} />
                </Box>
              </Box>

              {/* Add small character on the river - adventurer in boat */}
              <Box
                sx={{
                  position: 'absolute',
                  zIndex: 4,
                  width: '40px',
                  height: '30px',
                  animation: 'adventure-journey 35s linear infinite',
                  '@keyframes adventure-journey': {
                    '0%': { transform: 'translate(0, 0) rotate(10deg)', left: '10%', bottom: '18%' },
                    '33%': { transform: 'translate(0, 0) rotate(-5deg)', left: '40%', bottom: '22%' },
                    '66%': { transform: 'translate(0, 0) rotate(5deg)', left: '65%', bottom: '20%' },
                    '100%': { transform: 'translate(0, 0) rotate(-5deg)', left: '85%', bottom: '25%' }
                  }
                }}
              >
                {/* Boat */}
                <Box sx={{ 
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                }}>
                  {/* Boat hull */}
                  <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '30px',
                    height: '10px',
                    backgroundColor: '#a1887f',
                    borderRadius: '40% 40% 0 0',
                    transform: 'rotate(90deg)',
                    animation: 'boat-rock 2s infinite ease-in-out',
                    '@keyframes boat-rock': {
                      '0%, 100%': { transform: 'rotate(90deg)' },
                      '50%': { transform: 'rotate(87deg)' }
                    }
                  }} />
                  {/* Character */}
                  <Box sx={{
                    position: 'absolute',
                    bottom: '7px',
                    left: '12px',
                    width: '10px',
                    height: '15px',
                    zIndex: 2,
                  }}>
                    {/* Body */}
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '10px',
                      height: '10px',
                      backgroundColor: '#4db6ac',
                      borderRadius: '5px 5px 5px 5px / 7px 7px 3px 3px',
                      animation: 'character-move 1s infinite alternate',
                      '@keyframes character-move': {
                        '0%': { transform: 'translateY(0)' },
                        '100%': { transform: 'translateY(-1px)' }
                      }
                    }} />
                    {/* Head */}
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: '1px',
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#ffcc80',
                      borderRadius: '50%',
                    }} />
                    {/* Eyes */}
                    <Box sx={{
                      position: 'absolute',
                      top: '3px',
                      left: '3px',
                      width: '1px',
                      height: '1px',
                      backgroundColor: 'black',
                      borderRadius: '50%',
                    }} />
                    <Box sx={{
                      position: 'absolute',
                      top: '3px',
                      left: '6px',
                      width: '1px',
                      height: '1px',
                      backgroundColor: 'black',
                      borderRadius: '50%',
                    }} />
                    {/* Paddle */}
                    <Box sx={{
                      position: 'absolute',
                      top: '5px',
                      right: '-8px',
                      width: '10px',
                      height: '2px',
                      backgroundColor: '#8d6e63',
                      borderRadius: '1px',
                      transformOrigin: 'right',
                      animation: 'paddle 1.5s infinite',
                      '@keyframes paddle': {
                        '0%, 50%, 100%': { transform: 'rotate(0deg)' },
                        '25%': { transform: 'rotate(-20deg)' },
                        '75%': { transform: 'rotate(20deg)' }
                      }
                    }} />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Content dialog */}
      <ContentDialog />
    </Container>
  );
};

export default AdventureMapUI;
