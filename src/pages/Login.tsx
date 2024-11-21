import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../context/AuthContext';
import { toast } from "react-toastify";
import { AxiosError } from "../utils/Utils";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const[isLoading,setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const response = await axios.post(
        "https://blogs-app-backend-mb0v.onrender.com/api/auth/login",
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token } = response.data;
      if (token) {
        login(token);
        localStorage.setItem('userId',response.data.user._id)
        navigate('/');
        toast.success(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      toast.error(axiosError.response?.data?.message || "Error logging in");
    }finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[95vh]" >
      <Box
        sx={{
          width: 400,
          padding: 4,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
        }}
        className="shadow-lg"
      >
        <Typography variant="h4" align="center" className="mb-4">
          Login
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Username"
            name="username"
            variant="outlined"
            value={loginData.username}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            value={loginData.password}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            className="transition-transform transform hover:scale-105 hover:shadow-2xl"
            disabled={isLoading}
          >
             {isLoading ? "Signing..." : "Login"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Typography variant="body2">
            Don't have an account?{" "}
            <Button className="" color="secondary" onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
          </Typography>
        </div>
      </Box>
    </div>
  );
};
