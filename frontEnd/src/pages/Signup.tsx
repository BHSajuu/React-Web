import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission for sign up

  const auth = useAuth();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      toast.loading("Signing Up");
      await auth?.signup(name, email, password);
      toast.success("Signed Up Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Signing Up Failed");
    }
  };
  useEffect(() => {
    if (auth?.user) {
      return navigate("/");
    }
  }, [auth]);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#aaade6",
        padding: "16px",
      }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "400px",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "8px 8px 24px rgba(0, 0, 0, 0.2)",
          backgroundColor: "white",
        }}>
        <Typography variant="h5" sx={{ marginBottom: "16px", color: "black" }}>
          Sign Up
        </Typography>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            width: "100%",
          }}>
          <TextField
            label="Username"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Sign Up
          </Button>
        </form>

        <Typography sx={{ mt: 2, color: "black" }}>
          Already have an account?{" "}
          <Button
            onClick={() => navigate("/login")}
            sx={{ textTransform: "none" }}>
            Login
          </Button>
        </Typography>
      </Box>
    </Box>
  );
}
