import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import {
  Typography,
  Box,
  Avatar,
  IconButton,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  DialogTitle,
  DialogContent,
  Dialog,
  DialogActions,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

const DetailedPost = ({
  id: postId,
  user_id,
  title: postTitle,
  content: postContent,
  is_anonymous,
  created_at,
  updated_at,
  imageUrl,
  fullName,
  userAvatar,
  onClose,
  open,
}) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const { data: commentsData, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const userIds = commentsData
        .filter((comment) => !comment.is_anonymous && comment.user_id)
        .map((comment) => comment.user_id);

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

      const formattedComments = commentsData.map((comment) => {
        const profile = comment.is_anonymous
          ? null
          : profilesData.find((p) => p.id === comment.user_id);

        return {
          id: comment.id,
          post_id: comment.post_id,
          user_id: comment.user_id,
          content: comment.content,
          is_anonymous: comment.is_anonymous,
          created_at: comment.created_at,
          author: comment.is_anonymous
            ? "Anonymous"
            : profile
            ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
            : "Unknown User",
          avatar: comment.is_anonymous ? null : profile?.avatar_url,
        };
      });

      setComments(formattedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (newComment.trim() === "") return;

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      const { data: comment, error } = await supabase
        .from("comments")
        .insert([
          {
            post_id: postId,
            user_id: user?.id,
            content: newComment,
            is_anonymous: false,
          },
        ])
        .single();

      if (error) throw error;

      await fetchComments();
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="post-dialog-title"
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        id="post-dialog-title"
        sx={{
          m: 0,
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "text.primary",
          }}
        >
          {postTitle}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: "text.secondary",
            "&:hover": {
              color: "primary.main",
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          height: "70vh",
          overflow: "hidden",
        }}
      >
        <Box sx={{ flex: "1 1 65%", p: 3, overflowY: "auto" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Avatar
              src={is_anonymous ? null : userAvatar}
              alt={fullName}
              sx={{ width: 48, height: 48 }}
            >
              {is_anonymous ? "A" : fullName[0]}
            </Avatar>
            <Box sx={{ ml: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                }}
              >
                {is_anonymous ? "Anonymous" : fullName}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.75rem",
                }}
              >
                {formatDateTime(created_at)}
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="body1"
            component="div"
            sx={{
              mb: 3,
              color: "text.primary",
              lineHeight: 1.6,
            }}
          >
            {postContent}
          </Typography>

          {imageUrl && (
            <Box
              sx={{
                mt: 3,
                mb: 4,
                borderRadius: 2,
                overflow: "hidden",
                border: 1,
                borderColor: "divider",
              }}
            >
              <img
                src={imageUrl}
                alt="Post content"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
              />
            </Box>
          )}
        </Box>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ display: { xs: "none", md: "block" } }}
        />
        <Divider sx={{ display: { xs: "block", md: "none" } }} />

        <Box
          sx={{
            flex: "1 1 35%",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            bgcolor: "background.paper",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: "divider",
              color: "text.primary",
            }}
          >
            Comments
          </Typography>

          <List sx={{ flex: 1, overflowY: "auto", p: 0 }}>
            {loading ? (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography color="text.secondary" sx={{ fontSize: "0.9rem" }}>
                  Loading comments...
                </Typography>
              </Box>
            ) : comments.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography color="text.secondary" sx={{ fontSize: "0.9rem" }}>
                  No comments yet. Be the first to comment!
                </Typography>
              </Box>
            ) : (
              comments.map((comment) => (
                <React.Fragment key={comment.id}>
                  <ListItem alignItems="flex-start" sx={{ px: 3, py: 2 }}>
                    <ListItemAvatar>
                      <Avatar
                        src={comment.is_anonymous ? null : comment.avatar}
                        alt={comment.author}
                        sx={{ width: 40, height: 40 }}
                      >
                        {comment.is_anonymous ? "A" : comment.author[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 600,
                              color: comment.is_anonymous
                                ? "text.secondary"
                                : "text.primary",
                            }}
                          >
                            {comment.is_anonymous
                              ? "Anonymous"
                              : comment.author}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: "0.75rem" }}
                          >
                            {formatDateTime(comment.created_at)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 0.5,
                            whiteSpace: "pre-wrap",
                            color: "text.primary",
                            fontSize: "0.875rem",
                            lineHeight: 1.5,
                          }}
                        >
                          {comment.content}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))
            )}
          </List>

          <Box
            sx={{
              p: 2.5,
              borderTop: 1,
              borderColor: "divider",
              bgcolor: "background.default",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
              <Avatar
                sx={{
                  mr: 1.5,
                  width: 40,
                  height: 40,
                }}
                src="/api/placeholder/40/40"
              />
              <TextField
                fullWidth
                placeholder="Write a comment..."
                multiline
                maxRows={4}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                size="small"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim()}
                      color="primary"
                      edge="end"
                      sx={{
                        mr: -0.5,
                        "&.Mui-disabled": {
                          color: "rgba(0, 0, 0, 0.26)",
                        },
                      }}
                    >
                      <SendIcon />
                    </IconButton>
                  ),
                  sx: {
                    borderRadius: 2,
                    "&.MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                        borderWidth: "1px",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                        borderWidth: "1px",
                      },
                    },
                  },
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DetailedPost;
