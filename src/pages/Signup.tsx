import { TextField, Button, Box, Typography, Modal, CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
  });

  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for OTP verification

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://blogs-app-backend-mb0v.onrender.com/api/auth/signup', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        // Show OTP modal
        toast.success("OTP sent to Your Email")
        setOpenOtpModal(true);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response.data.message);
    }
  };

  const handleOtpSubmit = async () => {
    setLoading(true); // Set loading to true while waiting for the OTP verification
    try {
      const response = await axios.post('https://blogs-app-backend-mb0v.onrender.com/api/auth/verify', { code: otp });

      if (response.status === 200) {
        toast.success(response.data.message);
        navigate('/login');
        setOpenOtpModal(false);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtpError('Invalid OTP, please try again.');
    } finally {
      setLoading(false); // Reset loading state after the request is complete
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8 ">
      <div className="w-full max-w-md p-6 space-y-8">
        <Box
          sx={{
            width: '100%',
            padding: { xs: 2, sm: 4 },
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 3,
          }}
          className="shadow-lg"
        >
          <Typography variant="h4" align="center" className="mb-6">
            Signup
          </Typography>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              variant="outlined"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Full Name"
              name="fullname"
              variant="outlined"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
            >
              Get Otp
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Typography variant="body2">
              Already have an account?{" "}
              <Button className="" color="secondary" onClick={() => navigate("/login")}>
                Login
              </Button>
            </Typography>
          </div>
        </Box>

        {/* OTP Modal */}
        <Modal
          open={openOtpModal}
          onClose={() => setOpenOtpModal(false)}
          aria-labelledby="otp-modal-title"
          aria-describedby="otp-modal-description"
        >
          <Box sx={{ width: 400, padding: 3, margin: 'auto', backgroundColor: 'white', borderRadius: 2 }}>
            <Typography variant="h5" align="center" className="mb-4">
              Enter OTP
            </Typography>
            <TextField
              fullWidth
              label="OTP"
              variant="outlined"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              error={!!otpError}
              helperText={otpError}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
              onClick={handleOtpSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
            </Button>
          </Box>
        </Modal>
      </div>
    </div>
  );
};
