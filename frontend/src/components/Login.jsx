import { useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { Container, Paper, TextField, Button, FormControlLabel, Checkbox, Stack, Typography, Link } from "@mui/material";

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
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField type="email" label="Email" {...register("email")} required />
          <TextField type="password" label="Password" {...register("password")} required />
          <FormControlLabel control={<Checkbox defaultChecked {...register("remember")} />} label="Remember me" />
          <Button type="submit" variant="contained">Login</Button>
          <Typography variant="body2" color="text.secondary">
            No account?{' '}
            <Link component={RouterLink} to="/register">Please register here</Link>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Login;
