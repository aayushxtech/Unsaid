import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Box,
  Button,
  Paper,
  Divider,
  Fade,
  Chip,
  Alert,
  Tooltip,
} from "@mui/material";
import PostCard from "../components/PostCard";
import CreatePostForm from "../components/CreatePostForm";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import calculateAge from "../lib/calculateAge";
import getAgeGroup from "../lib/ageGroup";
import AddIcon from "@mui/icons-material/Add";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import ShieldIcon from "@mui/icons-material/Shield";
import InfoIcon from "@mui/icons-material/Info";

const Posts = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [userAgeGroup, setUserAgeGroup] = useState(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);

  // Fetch user profile and set age group
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          setProfile(data);
          const age = calculateAge(data.date_of_birth);
          const ageGroup = getAgeGroup(age);
          setUserAgeGroup(ageGroup);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [user]);

  const fetchPosts = async () => {
    try {
      // First, let's try to see what relationships are available
      const { data: postsData, error } = await supabase
        .from("posts")
        .select(
          `
          *
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      // If we need to get profiles data, we'll do it separately
      const userIds = postsData
        .filter((post) => !post.is_anonymous && post.user_id)
        .map((post) => post.user_id);

      // Fetch profiles data for non-anonymous posts
      let profilesData = [];
      if (userIds.length > 0) {
        const { data, error: profilesError } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, avatar_url, date_of_birth")
          .in("id", userIds);

        if (!profilesError) {
          profilesData = data;
        }
      }

      // Now map posts with profile data
      const formattedPosts = postsData.map((post) => {
        // Find corresponding profile
        const profile = post.is_anonymous
          ? null
          : profilesData.find((p) => p.id === post.user_id);

        return {
          id: post.id,
          user_id: post.user_id,
          title: post.title,
          content: post.content,
          is_anonymous: post.is_anonymous,
          created_at: post.created_at,
          updated_at: post.updated_at,
          imageUrl: post.image_url,
          fullName: post.is_anonymous
            ? "Anonymous Friend"
            : profile
            ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
            : "Community Member",
          userAvatar: post.is_anonymous ? null : profile?.avatar_url,
          timePosted: formatTimeAgo(post.created_at),
          ageGroup: profile
            ? getAgeGroup(calculateAge(profile.date_of_birth))
            : null,
        };
      });

      setPosts(formattedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format timestamp to relative time
  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (let [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }
    return "Just now";
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = async () => {
    setOpenCreatePost(false); // Close the create post dialog
    setLoading(true); // Show loading state
    await fetchPosts(); // Refresh the posts
  };

  // Loading state
  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Box textAlign="center">
          <CircularProgress
            size={60}
            thickness={4}
            sx={{ mb: 3, color: "secondary.main" }}
          />
          <Typography variant="body1" color="text.secondary">
            Loading our friendly community discussions...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Check banned status
  if (profile?.is_banned) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Fade in>
          <Paper
            elevation={3}
            sx={{
              textAlign: "center",
              p: 5,
              borderRadius: 4,
              bgcolor: "#FFF4F5",
              border: "1px solid",
              borderColor: "#FFCDD2",
            }}
          >
            <Typography
              variant="h5"
              color="#D32F2F"
              gutterBottom
              fontWeight="medium"
            >
              Account Temporarily Paused
            </Typography>
            <Divider sx={{ my: 2, width: "50%", mx: "auto" }} />
            <Typography color="#D32F2F" sx={{ maxWidth: "80%", mx: "auto" }}>
              Your account has been temporarily paused. Our community guidelines
              help keep this a safe space for everyone. Please contact our
              friendly support team for assistance and information on next
              steps.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              sx={{ mt: 3, borderRadius: 3, textTransform: "none" }}
            >
              Contact Support
            </Button>
          </Paper>
        </Fade>
      </Container>
    );
  }

  // Age restriction check with friendlier message
  if (userAgeGroup === "3-12") {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Fade in>
          <Paper
            elevation={3}
            sx={{
              textAlign: "center",
              p: 5,
              borderRadius: 4,
              bgcolor: "#FFF8E1",
              border: "1px solid",
              borderColor: "#FFE082",
            }}
          >
            <EmojiPeopleIcon sx={{ fontSize: 60, color: "#FFA000", mb: 2 }} />
            <Typography
              variant="h5"
              color="#F57F17"
              gutterBottom
              fontWeight="medium"
            >
              Hey There, Young Friend!
            </Typography>
            <Divider sx={{ my: 2, width: "50%", mx: "auto" }} />
            <Typography
              color="#795548"
              sx={{ maxWidth: "80%", mx: "auto", mb: 2 }}
            >
              This part of our community is designed for older members. We have
              special areas just for you that are full of fun and
              age-appropriate content!
            </Typography>
            <Button
              variant="contained"
              color="warning"
              sx={{
                mt: 2,
                borderRadius: 3,
                textTransform: "none",
                bgcolor: "#FFB74D",
                "&:hover": {
                  bgcolor: "#FFA726",
                },
              }}
            >
              Go to Kids Zone
            </Button>
          </Paper>
        </Fade>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Fade in timeout={800}>
        <Box>
          {showWelcomeMessage && (
            <Alert
              severity="info"
              icon={<ShieldIcon fontSize="inherit" />}
              onClose={() => setShowWelcomeMessage(false)}
              sx={{
                mb: 4,
                borderRadius: 3,
                "& .MuiAlert-message": {
                  display: "flex",
                  alignItems: "center",
                },
                bgcolor: "#E3F2FD",
                color: "#0D47A1",
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                Welcome to our community space! This is a safe and supportive
                environment where everyone's voice matters.
                <Tooltip title="We monitor content to ensure it's appropriate for all age groups. Please be kind and respectful to others.">
                  <InfoIcon
                    sx={{
                      ml: 1,
                      fontSize: 18,
                      cursor: "pointer",
                      verticalAlign: "middle",
                    }}
                  />
                </Tooltip>
              </Typography>
            </Alert>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 5,
              pb: 3,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ChatBubbleOutlineIcon
                sx={{ color: "primary.main", mr: 2, fontSize: 32 }}
              />
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: "medium",
                  color: "primary.main",
                }}
              >
                Community Discussions
              </Typography>
              <Chip
                label={userAgeGroup}
                size="small"
                color="secondary"
                sx={{ ml: 2, borderRadius: 2 }}
              />
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenCreatePost(true)}
              sx={{
                textTransform: "none",
                borderRadius: 3,
                px: 3,
                py: 1.2,
                boxShadow: 2,
                fontSize: "1rem",
                fontWeight: "medium",
                bgcolor: "secondary.main",
                "&:hover": {
                  bgcolor: "secondary.dark",
                },
              }}
            >
              Share Your Thoughts
            </Button>
          </Box>

          {posts.length === 0 ? (
            <Paper
              elevation={1}
              sx={{
                p: 5,
                textAlign: "center",
                borderRadius: 4,
                bgcolor: "#E8F5E9",
                border: "1px solid #C8E6C9",
              }}
            >
              <Typography variant="h6" color="#2E7D32" gutterBottom>
                Be the first to start a friendly discussion!
              </Typography>
              <Typography variant="body1" color="#33691E" sx={{ mb: 3 }}>
                Our community is waiting to hear your thoughts, questions, and
                ideas.
              </Typography>
              <Button
                variant="contained"
                onClick={() => setOpenCreatePost(true)}
                sx={{
                  mt: 2,
                  borderRadius: 3,
                  textTransform: "none",
                  px: 3,
                  bgcolor: "#66BB6A",
                  "&:hover": {
                    bgcolor: "#4CAF50",
                  },
                }}
              >
                Start a New Discussion
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {posts.map((post) => (
                <Grid item xs={12} sm={6} md={4} key={post.id}>
                  <Fade in timeout={400 + posts.indexOf(post) * 100}>
                    <Box>
                      <PostCard {...post} />
                    </Box>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          )}

          <CreatePostForm
            open={openCreatePost}
            onClose={() => setOpenCreatePost(false)}
            onPostCreated={handlePostCreated}
          />
        </Box>
      </Fade>
    </Container>
  );
};

export default Posts;
