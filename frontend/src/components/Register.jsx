import { useState, useContext } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext.jsx";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    try {
      const { name, email, password, confirmPassword } = data;
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      const res = await axios.post("/api/auth/register", { name, email, password });
      // Auto-login: persist token and user in our context (and storage)
      login(res.data.token, res.data.user, true);
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
    <div className="container" style={{ maxWidth: "520px", padding: "2rem 1.5rem" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="card glass-surface" style={{ padding: "1.5rem 1.75rem" }}>
          <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Join YSC at St. Dominic</h2>
          {error && (
            <div className="glass-surface" style={{ padding: "0.75rem 1rem", marginBottom: "1rem", borderLeft: "3px solid var(--clr-accent-a40)" }}>
              <strong style={{ display: "block", marginBottom: "0.25rem" }}>Registration error</strong>
              <span style={{ fontSize: "0.9rem" }}>{error}</span>
            </div>
          )}
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span style={{ fontSize: "0.9rem" }}>Name</span>
              <input
                className="form-input"
                placeholder="Enter your name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name?.message && (
                <span style={{ color: "var(--clr-danger-a40)", fontSize: "0.8rem" }}>{errors.name.message}</span>
              )}
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span style={{ fontSize: "0.9rem" }}>Email</span>
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                })}
              />
              {errors.email?.message && (
                <span style={{ color: "var(--clr-danger-a40)", fontSize: "0.8rem" }}>{errors.email.message}</span>
              )}
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span style={{ fontSize: "0.9rem" }}>Password</span>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
              {errors.password?.message && (
                <span style={{ color: "var(--clr-danger-a40)", fontSize: "0.8rem" }}>{errors.password.message}</span>
              )}
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span style={{ fontSize: "0.9rem" }}>Confirm Password</span>
              <input
                type="password"
                className="form-input"
                placeholder="Re-enter your password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
              {errors.confirmPassword?.message && (
                <span style={{ color: "var(--clr-danger-a40)", fontSize: "0.8rem" }}>{errors.confirmPassword.message}</span>
              )}
            </label>
            <button type="submit" className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
              Register
            </button>
            <p style={{ fontSize: "0.85rem", opacity: 0.85, marginTop: "0.5rem", textAlign: "center" }}>
              Already have an account? <RouterLink to="/login">Login</RouterLink>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
