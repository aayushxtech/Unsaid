import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import PostCard from "../components/PostCard";
import CreatePostForm from "../components/CreatePostForm";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext"; // Make sure your auth context path is correct

const Posts = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreatePost, setOpenCreatePost] = useState(false);

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
          .select("id, first_name, last_name, avatar_url")
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
            ? "Anonymous"
            : profile
            ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
            : "Unknown User",
          userAvatar: post.is_anonymous ? null : profile?.avatar_url,
          timePosted: formatTimeAgo(post.created_at),
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

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [user]);

  const handlePostCreated = async () => {
    setOpenCreatePost(false); // Close the create post dialog
    setLoading(true); // Show loading state
    await fetchPosts(); // Refresh the posts
  };

  if (profile?.is_banned) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box
          sx={{
            textAlign: "center",
            p: 4,
            borderRadius: 2,
            bgcolor: "error.lighter",
            border: "1px solid",
            borderColor: "error.light",
          }}
        >
          <Typography variant="h5" color="error.main" gutterBottom>
            Account Suspended
          </Typography>
          <Typography color="error.dark">
            Your account has been suspended and you cannot view posts at this
            time. Please contact support for more information.
          </Typography>
        </Box>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 6 }}>
        <Typography variant="h4" component="h2">
          Latest Discussions
        </Typography>
        <Button
          variant="contained"
          onClick={() => setOpenCreatePost(true)}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 3,
          }}
        >
          Create Post
        </Button>
      </Box>
      <Grid container spacing={4}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <PostCard {...post} />
          </Grid>
        ))}
      </Grid>
      <CreatePostForm
        open={openCreatePost}
        onClose={() => setOpenCreatePost(false)}
        onPostCreated={handlePostCreated}
      />
    </Container>
  );
};

export default Posts;
