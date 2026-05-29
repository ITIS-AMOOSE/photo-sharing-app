import React, { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
} from "@mui/material";

import "./styles.css";

const SERVER_URL = process.env.REACT_APP_API_URL;

const LoginRegister = ({ onLoginSuccess }) => {
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerForm, setRegisterForm] = useState({
    login_name: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      const response = await fetch(`${SERVER_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login_name: loginName,
          password: loginPassword,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Login failed");
      }

      const user = await response.json();

      localStorage.setItem("photo_app_token", user.token);
      localStorage.setItem("photo_app_user", JSON.stringify(user));

      onLoginSuccess(user);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleRegisterChange = (field, value) => {
    setRegisterForm({
      ...registerForm,
      [field]: value,
    });
  };

  const handleRegister = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      if (registerForm.password !== registerForm.confirm_password) {
        setErrorMessage("Password and confirm password do not match");
        return;
      }

      const response = await fetch(`${SERVER_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login_name: registerForm.login_name,
          password: registerForm.password,
          first_name: registerForm.first_name,
          last_name: registerForm.last_name,
          location: registerForm.location,
          description: registerForm.description,
          occupation: registerForm.occupation,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Register failed");
      }

      await response.json();

      setSuccessMessage("Register successfully. You can login now.");

      setRegisterForm({
        login_name: "",
        password: "",
        confirm_password: "",
        first_name: "",
        last_name: "",
        location: "",
        description: "",
        occupation: "",
      });
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Card className="login-card">
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Login / Register
        </Typography>

        {errorMessage && (
          <Alert severity="error" className="login-message">
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" className="login-message">
            {successMessage}
          </Alert>
        )}

        <div className="login-section">
          <Typography variant="h6">Login</Typography>

          <TextField
            label="Login name"
            value={loginName}
            onChange={(event) => setLoginName(event.target.value)}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Password"
            type="password"
            value={loginPassword}
            onChange={(event) => setLoginPassword(event.target.value)}
            fullWidth
            margin="normal"
          />

          <Button variant="contained" onClick={handleLogin}>
            Login
          </Button>
        </div>

        <Divider className="login-divider" />

        <div className="login-section">
          <Typography variant="h6">Register</Typography>

          <TextField
            label="Login name"
            value={registerForm.login_name}
            onChange={(event) =>
              handleRegisterChange("login_name", event.target.value)
            }
            fullWidth
            margin="normal"
          />

          <TextField
            label="Password"
            type="password"
            value={registerForm.password}
            onChange={(event) =>
              handleRegisterChange("password", event.target.value)
            }
            fullWidth
            margin="normal"
          />

          <TextField
            label="Confirm password"
            type="password"
            value={registerForm.confirm_password}
            onChange={(event) =>
              handleRegisterChange("confirm_password", event.target.value)
            }
            fullWidth
            margin="normal"
          />

          <TextField
            label="First name"
            value={registerForm.first_name}
            onChange={(event) =>
              handleRegisterChange("first_name", event.target.value)
            }
            fullWidth
            margin="normal"
          />

          <TextField
            label="Last name"
            value={registerForm.last_name}
            onChange={(event) =>
              handleRegisterChange("last_name", event.target.value)
            }
            fullWidth
            margin="normal"
          />

          <TextField
            label="Location"
            value={registerForm.location}
            onChange={(event) =>
              handleRegisterChange("location", event.target.value)
            }
            fullWidth
            margin="normal"
          />

          <TextField
            label="Description"
            value={registerForm.description}
            onChange={(event) =>
              handleRegisterChange("description", event.target.value)
            }
            fullWidth
            margin="normal"
          />

          <TextField
            label="Occupation"
            value={registerForm.occupation}
            onChange={(event) =>
              handleRegisterChange("occupation", event.target.value)
            }
            fullWidth
            margin="normal"
          />

          <Button variant="contained" color="success" onClick={handleRegister}>
            Register Me
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginRegister;