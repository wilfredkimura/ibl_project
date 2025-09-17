import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { motion } from "framer-motion";
import { Container, Paper, TextField, Button, Alert, Stack, Typography, Link } from "@mui/material";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/api/auth/register", data);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Please try again.";
      setError(errorMessage);
      console.error("Registration error:", err.response?.data || err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Join YSC at St. Dominic
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Name"
              {...register("name", { required: "Name is required" })}
              error={!!errors.name}
              helperText={errors.name?.message}
              placeholder="Enter your name"
            />
            <TextField
              type="email"
              label="Email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              placeholder="Enter your email"
            />
            <TextField
              type="password"
              label="Password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              placeholder="Enter your password"
            />
            <Button type="submit" variant="contained">Register</Button>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login">Login</Link>
            </Typography>
            
          </Stack>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Register;
