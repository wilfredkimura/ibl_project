import { useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const Login = () => {
  const { register, handleSubmit, watch } = useForm({ defaultValues: { remember: true } });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/api/auth/login", data);
      login(res.data.token, res.data.user, !!data.remember);
      navigate("/");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "480px", padding: "2rem 1.5rem" }}>
      <div className="card glass-surface" style={{ padding: "1.5rem 1.75rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Login</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.9rem" }}>Email</span>
            <input type="email" required {...register("email")} className="form-input" />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.9rem" }}>Password</span>
            <input type="password" required {...register("password")} className="form-input" />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
            <input type="checkbox" defaultChecked {...register("remember")} />
            <span>Remember me</span>
          </label>
          <button type="submit" className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
            Login
          </button>
          <p style={{ fontSize: "0.85rem", opacity: 0.85, marginTop: "0.5rem" }}>
            No account? <RouterLink to="/register">Please register here</RouterLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
