import { useState } from "react";
import { TextField, Button } from "@mui/material"; // Removed the MUI Select and FormControl
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useBlogs } from "../context/BlogsContext";
import { toast } from "react-toastify";
import { useImageUpload } from "../Hooks/useImageUpload";
import { AxiosError } from "../utils/Utils";
import { useNavigate } from "react-router-dom";

export const CreatePost = () => {
  const { updateUser } = useAuth();
  const { fetchBlogs } = useBlogs();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    text: "",
    category: "",
    title: "",
    img: "", 
  });

  const[isLoading,setIsLoading] = useState(false);


  const { uploadImage, uploading } = useImageUpload();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
    setIsLoading(true)
    try {
      const response = await axios.post("/api/post/create", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data) {
        toast.success("Post created successfully");
      }
      setIsLoading(true);
      navigate('/')
      updateUser();
      fetchBlogs();
    } catch (error) {
      const axiosError = error as AxiosError;
      toast.error(axiosError.response?.data?.error || "Error creating post");
      // console.error("Error creating post:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create Your Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Category</option>
            <option value="coding">Coding</option>
            <option value="news">News</option>
            <option value="event">Event</option>
          </select>
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
        <Button type="submit" variant="contained" color="primary" disabled={uploading || isLoading}>
          {isLoading?"Posting":"Submit"}
        </Button>
      </form>
    </div>
  );
};
