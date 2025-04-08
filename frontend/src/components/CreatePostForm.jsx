import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Switch,
  FormControlLabel,
  IconButton,
  Typography,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import { supabase } from "../supabaseClient";

const CreatePostForm = ({ open, onClose, onPostCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    is_anonymous: false,
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "is_anonymous" ? checked : value,
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // File size validation (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      let image_url = null;

      // Upload image if selected
      if (formData.image) {
        const fileExt = formData.image.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from("post-images")
          .upload(filePath, formData.image);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("post-images").getPublicUrl(filePath);

        image_url = publicUrl;
      }

      // Create post
      const { data: post, error: postError } = await supabase
        .from("posts")
        .insert([
          {
            title: formData.title,
            content: formData.content,
            is_anonymous: formData.is_anonymous,
            image_url: image_url,
            user_id: user?.id,
          },
        ])
        .single();

      if (postError) throw postError;

      // Reset form and close dialog
      setFormData({
        title: "",
        content: "",
        is_anonymous: false,
        image: null,
      });
      onPostCreated?.();
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="create-post-dialog-title"
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        id="create-post-dialog-title"
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box component="div" sx={{ typography: "h5" }}>
          Create New Post
        </Box>
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            name="title"
            label="Title"
            fullWidth
            required
            value={formData.title}
            onChange={handleInputChange}
            sx={{ mb: 3 }}
          />

          <TextField
            name="content"
            label="Content"
            multiline
            rows={4}
            fullWidth
            required
            value={formData.content}
            onChange={handleInputChange}
            sx={{ mb: 3 }}
          />

          <Box sx={{ mb: 3 }}>
            <input
              accept="image/*"
              type="file"
              id="image-upload"
              hidden
              onChange={handleImageUpload}
            />
            <label htmlFor="image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<ImageIcon />}
              >
                {formData.image ? "Change Image" : "Add Image"}
              </Button>
            </label>
            {formData.image && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Selected: {formData.image.name}
              </Typography>
            )}
          </Box>

          <FormControlLabel
            control={
              <Switch
                name="is_anonymous"
                checked={formData.is_anonymous}
                onChange={handleInputChange}
              />
            }
            label="Post anonymously"
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {loading ? "Creating..." : "Create Post"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreatePostForm;
