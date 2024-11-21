import { ChangeEvent, useState } from "react";
import { TextField, Button, Container, Typography, Box, Divider, Grid } from "@mui/material";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useBlogs } from "../context/BlogsContext";
import { toast } from "react-toastify";
import { useImageUpload } from "../Hooks/useImageUpload";
import { AxiosError } from "../utils/Utils";

export const EditProfile = () => {
  const { updateUser } = useAuth();
  const { fetchBlogs } = useBlogs();
  const { uploadImage, uploading } = useImageUpload();
  const[isLoading,setIsLoading] = useState(false);
  
  const [formValues, setFormValues] = useState({
    fullname: "",
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    bio: "",
    link: "",
    profileImg: "",
    coverImg: ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      setFormValues((prevValues) => ({
        ...prevValues,
        [fieldName]: imageUrl
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const response = await axios.post("https://blogs-app-backend-mb0v.onrender.com/api/user/updateprofile", formValues, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
     // console.log("Profile Updated:", response.data);
      if (response.data) {
        toast.success(response.data.message);
      }
      setIsLoading(false)
      updateUser();
      fetchBlogs();

    } catch (error) {
      const axiosError = error as AxiosError;
      toast.error(axiosError.response?.data?.error);
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Container className="" maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: { xs: 1, sm: 3 }, px: { xs: 2, sm: 0 } }}>
        <Typography variant="h4" gutterBottom>Edit Profile</Typography>

        {/* Personal Information Section */}
        <Typography variant="h6" sx={{ mt: { xs: 3, sm: 2 } }}>Personal Information</Typography>
        <Divider sx={{ mb: { xs: 3, sm: 2 } }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Full Name"
              name="fullname"
              value={formValues.fullname}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Username"
              name="username"
              value={formValues.username}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Bio"
              name="bio"
              value={formValues.bio}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        {/* Account Settings Section */}
        <Typography variant="h6" sx={{ mt: { xs: 3, sm: 4 } }}>Account Settings</Typography>
        <Divider sx={{ mb: { xs: 3, sm: 2 } }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Current Password"
              type="password"
              name="currentPassword"
              value={formValues.currentPassword}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              label="New Password"
              type="password"
              name="newPassword"
              value={formValues.newPassword}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Link"
              type="url"
              name="link"
              value={formValues.link}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        {/* Image Upload Section */}
        <Typography variant="h6" sx={{ mt: { xs: 3, sm: 4 } }}>Profile Images</Typography>
        <Divider sx={{ mb: { xs: 3, sm: 2 } }} />

        <div className="mb-4">
          <Button
            variant="contained"
            component="label"
            disabled={uploading}
            sx={{ mt: { xs: 1, sm: 0 }, mb: { xs: 2, sm: 0 } }}
          >
            {uploading ? "Uploading..." : "Upload Profile Image"}
            <input
              type="file"
              hidden
              onChange={(e) => handleFileChange(e, "profileImg")}
            />
          </Button>
        </div>

        <div className="mb-4">
          <Button
            variant="contained"
            component="label"
            disabled={uploading}
            sx={{ mt: { xs: 1, sm: 0 }, mb: { xs: 2, sm: 0 } }}
          >
            {uploading ? "Uploading..." : "Upload Cover Image"}
            <input
              type="file"
              hidden
              onChange={(e) => handleFileChange(e, "coverImg")}
            />
          </Button>
        </div>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={uploading || isLoading}
          fullWidth
          sx={{ mt: { xs: 3, sm: 4 } }}
        >
          Submit
        </Button>
      </Box>
    </Container>
  );
};
