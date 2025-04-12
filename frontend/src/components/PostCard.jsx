import React, { useState } from "react";
import {
  Button,
  Typography,
  Card,
  CardActions,
  CardMedia,
  CardContent,
  Avatar,
  Box,
  Dialog,
  IconButton,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DetailedPost from "./DetailedPost";

const PostCard = ({
  id,
  user_id,
  fullName = "Unknown User",
  userAvatar = "/api/placeholder/40/40",
  timePosted = "10 hours ago",
  title = "This is a sample post title",
  content = "This is some sample content for the post.",
  imageUrl = "/api/placeholder/600/400",
  is_anonymous,
  created_at,
  updated_at,
}) => {
  const [openDetailedPost, setOpenDetailedPost] = useState(false);

  const handleOpenDetailedPost = () => {
    setOpenDetailedPost(true);
  };

  const handleCloseDetailedPost = () => {
    setOpenDetailedPost(false);
  };

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease-in-out",
          borderRadius: 2,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2.5 }}>
            <Avatar
              src={is_anonymous ? null : userAvatar}
              alt={fullName}
              sx={{ width: 48, height: 48 }}
            />
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
                {timePosted}
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{
              fontSize: "1.25rem",
              fontWeight: 600,
              mb: 1.5,
              color: "text.primary",
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              mb: 2,
              lineHeight: 1.6,
            }}
          >
            {content.length > 120 ? `${content.substring(0, 120)}...` : content}
          </Typography>
        </CardContent>

        {imageUrl && (
          <Box sx={{ position: "relative" }}>
            <CardMedia
              component="img"
              height="180"
              image={imageUrl}
              alt="Post image"
              sx={{
                objectFit: "cover",
                borderTop: 1,
                borderBottom: 1,
                borderColor: "divider",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                height: "50%",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.2), rgba(0,0,0,0))",
              }}
            />
          </Box>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <CardActions
          sx={{
            justifyContent: "flex-end",
            px: 3,
            py: 2,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Button
            size="small"
            variant="contained"
            onClick={handleOpenDetailedPost}
            sx={{
              textTransform: "none",
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            Read More
          </Button>
        </CardActions>
      </Card>

      <DetailedPost
        id={id}
        user_id={user_id}
        title={title}
        content={content}
        is_anonymous={is_anonymous}
        created_at={created_at}
        updated_at={updated_at}
        imageUrl={imageUrl}
        fullName={fullName}
        userAvatar={userAvatar}
        onClose={handleCloseDetailedPost}
        open={openDetailedPost}
      />
    </>
  );
};

export default PostCard;
