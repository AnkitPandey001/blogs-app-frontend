import React, { useState } from "react";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useBlogs } from "../context/BlogsContext";
import { toast } from "react-toastify";
import { useImageUpload } from "../Hooks/useImageUpload";

export const CreatePost = () => {
  const { updateUser } = useAuth();
  const { fetchBlogs } = useBlogs();
  const [formData, setFormData] = useState({
    text: "",
    category: "",
    title: "",
    img: "", 
  });

  const { uploadImage, uploading } = useImageUpload();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name as string]: value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      setFormData((prevData) => ({
        ...prevData,
        img: imageUrl,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("https://blogs-app-backend-mb0v.onrender.com/api/post/create", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data) {
        toast.success("Post created successfully");
      }

      updateUser();
      fetchBlogs();
    } catch (error) {
      toast.error(error.response?.data?.error || "Error creating post");
      console.error("Error creating post:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create Your Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <FormControl fullWidth>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category"
            >
              <MenuItem value="coding">Coding</MenuItem>
              <MenuItem value="news">News</MenuItem>
              <MenuItem value="event">Event</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="mb-4">
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Title"
            variant="outlined"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <TextField
            fullWidth
            id="text"
            name="text"
            label="Content"
            variant="outlined"
            multiline
            rows={4}
            value={formData.text}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <Button variant="contained" component="label" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Image"}
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
        </div>
        <Button type="submit" variant="contained" color="primary" disabled={uploading}>
          Submit
        </Button>
      </form>
    </div>
  );
};
