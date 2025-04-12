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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  useTheme,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  School as SchoolIcon,
  MenuBook as MenuBookIcon,
  Description as DescriptionIcon,
  ErrorOutline,
} from "@mui/icons-material";
import {
  FaFileAlt,
  FaFilePdf,
  FaFileWord,
  FaVolumeUp,
  FaGamepad,
} from "react-icons/fa";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";

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

// Update the ContentRenderer component to handle more content types
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
            }}
          >
            <Typography variant="body1" color="text.secondary">
              {content.body}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                const blob = new Blob([content.body], { type: "text/plain" });
                const url = window.URL.createObjectURL(blob);
                downloadContent(url, `text-${Date.now()}.txt`);
              }}
            >
              Download Text
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
            bgcolor: "grey.100",
            borderRadius: 1,
          }}
        >
          <Typography color="text.secondary">Image not available</Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ position: "relative" }}>
            <img
              src={content.media_url}
              alt={content.body || "Content"}
              style={{ maxWidth: "100%", height: "auto", display: "block" }}
              onError={handleMediaError}
              loading="lazy"
            />
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
                  bgcolor: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.7)",
                  },
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
            bgcolor: "grey.100",
            borderRadius: 1,
          }}
        >
          <Typography color="text.secondary">Video not available</Typography>
        </Box>
      ) : (
        <Box>
          <Box sx={{ position: "relative" }}>
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
                  bgcolor: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.7)",
                  },
                }}
              >
                <ZoomInIcon />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() =>
                downloadContent(
                  content.media_url,
                  getFileName(content.media_url)
                )
              }
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
            bgcolor: "grey.100",
            borderRadius: 1,
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
            bgcolor: "grey.50",
            borderRadius: 2,
          }}
        >
          <FaVolumeUp
            size={24}
            color={theme.palette.secondary.main}
            style={{ marginRight: "12px" }}
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
            variant="outlined"
            color="primary"
            size="small"
            sx={{ ml: 2 }}
            onClick={() =>
              downloadContent(content.media_url, getFileName(content.media_url))
            }
          >
            Download Audio
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
            bgcolor: "grey.100",
            borderRadius: 1,
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
              p: 2,
              bgcolor: "grey.50",
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Box sx={{ mr: 2 }}>{getFileIcon(fileExt)}</Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1">
                {content.body || "Document"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={handlePreviewOpen}
                color="primary"
                size="small"
              >
                <ZoomInIcon />
              </IconButton>
              <Button
                variant="contained"
                size="small"
                href={content.media_url}
                download
              >
                Download
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
            p: 2,
            bgcolor: "grey.50",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Box sx={{ mr: 2 }}>
            <FaGamepad size={24} color={theme.palette.secondary.main} />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">
              {content.body || "Interactive Game"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              External Game Link
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
          >
            Play Game
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
            p: 2,
            bgcolor: "grey.50",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Box sx={{ mr: 2 }}>{getFileIcon("default")}</Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">
              {content.body || "File"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {content.content_type.toUpperCase()} File
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
          >
            Download
          </Button>
        </Box>
      );
  }
};

const Modules = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAgeGroup, setUserAgeGroup] = useState(null);
  const [topics, setTopics] = useState([]);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [expandedSubtopic, setExpandedSubtopic] = useState(null);

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

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Update the error display condition to only show for banned users
  if (error?.type === "banned") {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            bgcolor: "error.lighter",
            border: "1px solid",
            borderColor: "error.light",
          }}
        >
          <ErrorOutline
            sx={{
              fontSize: 64,
              color: "error.main",
              mb: 2,
            }}
          />
          <Typography variant="h5" color="error.main" gutterBottom>
            Account Suspended
          </Typography>
          <Typography color="error.dark" paragraph>
            {error.message}
          </Typography>
          {error.bannedAt && (
            <Typography variant="body2" color="error.dark">
              Suspended on: {new Date(error.bannedAt).toLocaleDateString()}
            </Typography>
          )}
        </Paper>
      </Container>
    );
  }

  // For other types of errors, show a different message
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ maxWidth: 600, mx: "auto" }}>
          {error.message || "An error occurred while loading content."}
        </Alert>
      </Container>
    );
  }

  if (!userAgeGroup) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Alert severity="info" sx={{ maxWidth: 600 }}>
          No content available for your age group.
        </Alert>
      </Box>
    );
  }

  const getTopicColor = (index) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.info.main,
      theme.palette.warning.main,
    ];
    return colors[index % colors.length];
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.50",
        py: 4,
        backgroundImage:
          "radial-gradient(circle, rgba(238,242,255,1) 0%, rgba(240,245,255,1) 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 4,
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <SchoolIcon fontSize="large" color="primary" />
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              color="primary.dark"
            >
              Learning Adventures
            </Typography>
          </Box>
          <Chip
            icon={<MenuBookIcon />}
            label={`Age Group: ${userAgeGroup}`}
            variant="outlined"
            color="primary"
            sx={{ fontWeight: "medium" }}
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Explore interactive learning modules customized for your age group
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {topics.map((topic, index) => (
            <Paper
              key={topic.id}
              elevation={2}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                borderLeft: `6px solid ${getTopicColor(index)}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: 4,
                },
              }}
            >
              <Accordion
                expanded={expandedTopic === topic.id}
                onChange={() =>
                  setExpandedTopic(expandedTopic === topic.id ? null : topic.id)
                }
                disableGutters
                sx={{ boxShadow: "none" }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    px: 3,
                    py: 2,
                    "&:hover": { bgcolor: "rgba(0, 0, 0, 0.02)" },
                  }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {topic.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {topic.description}
                    </Typography>
                  </Box>
                </AccordionSummary>

                {topic.subtopics && (
                  <AccordionDetails
                    sx={{ p: 0, bgcolor: "rgba(0, 0, 0, 0.01)" }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      {topic.subtopics
                        .sort((a, b) => a.order_no - b.order_no)
                        .map((subtopic, subtopicIndex) => (
                          <Box
                            key={subtopic.id}
                            sx={{
                              borderTop: "1px solid",
                              borderColor: "divider",
                            }}
                          >
                            <Accordion
                              expanded={expandedSubtopic === subtopic.id}
                              onChange={() =>
                                setExpandedSubtopic(
                                  expandedSubtopic === subtopic.id
                                    ? null
                                    : subtopic.id
                                )
                              }
                              disableGutters
                              sx={{ boxShadow: "none" }}
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{
                                  px: 3,
                                  py: 1.5,
                                  transition: "all 0.2s ease",
                                  bgcolor:
                                    expandedSubtopic === subtopic.id
                                      ? "rgba(0, 0, 0, 0.03)"
                                      : "transparent",
                                  "&:hover": { bgcolor: "rgba(0, 0, 0, 0.05)" },
                                }}
                              >
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Box
                                    sx={{
                                      width: 32,
                                      height: 32,
                                      borderRadius: "50%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      bgcolor: getTopicColor(index),
                                      color: "white",
                                      mr: 2,
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      fontWeight="bold"
                                    >
                                      {subtopicIndex + 1}
                                    </Typography>
                                  </Box>
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight="medium"
                                  >
                                    {subtopic.title}
                                  </Typography>
                                </Box>
                              </AccordionSummary>

                              {subtopic.contents && (
                                <AccordionDetails
                                  sx={{ p: 3, bgcolor: "rgba(0, 0, 0, 0.02)" }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 3,
                                    }}
                                  >
                                    {subtopic.contents
                                      .sort((a, b) => a.order_no - b.order_no)
                                      .map((content) => (
                                        <Card
                                          key={content.id}
                                          variant="outlined"
                                          sx={{
                                            borderRadius: 2,
                                            transition: "all 0.2s ease",
                                            "&:hover": {
                                              boxShadow: 2,
                                            },
                                          }}
                                        >
                                          <CardContent>
                                            <ContentRenderer
                                              content={content}
                                            />
                                          </CardContent>
                                        </Card>
                                      ))}
                                  </Box>
                                </AccordionDetails>
                              )}
                            </Accordion>
                          </Box>
                        ))}
                    </Box>
                  </AccordionDetails>
                )}
              </Accordion>
            </Paper>
          ))}
        </Box>

        {topics.length === 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 8,
              p: 4,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <DescriptionIcon
              sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              No learning modules available yet
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 1 }}
            >
              Check back later for new content
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Modules;
