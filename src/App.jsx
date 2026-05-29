import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Grid, Paper, Typography } from "@mui/material";

import TopBar from "./components/TopBar";
import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";

import "./App.css";

const SERVER_URL = process.env.REACT_APP_API_URL;

const getStoredUser = () => {
  const storedUser = localStorage.getItem("photo_app_user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
};

const AppContent = () => {
  const navigate = useNavigate();

  const [topBarContext, setTopBarContext] = useState("Users");
  const [currentUser, setCurrentUser] = useState(getStoredUser());

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setTopBarContext(`${user.first_name} ${user.last_name}`);
    navigate(`/users/${user._id}`);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("photo_app_token");

      if (token) {
        await fetch(`${SERVER_URL}/admin/logout`, {
          method: "POST",
          header: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch {}
    localStorage.removeItem("photo_app_token");
    localStorage.removeItem("photo_app_user");

    setCurrentUser(null);
    setTopBarContext("Please Login");

    navigate("/");
  };

  const handlePhotoUploaded = () => {
    navigate(`/photos/${currentUser._id}?uploaded=${Date.now()}`);
  };

  if (!currentUser) {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TopBar
            topBarContext={topBarContext}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        </Grid>

        <Grid item xs={12} className="main-topbar-buffer" />

        <Grid item xs={12}>
          <Paper className="main-grid-item">
            <Routes>
              <Route
                path="*"
                element={<LoginRegister onLoginSuccess={handleLoginSuccess} />}
              />
            </Routes>
          </Paper>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TopBar
          topBarContext={topBarContext}
          currentUser={currentUser}
          onLogout={handleLogout}
          onPhotoUploaded={handlePhotoUploaded}
        />
      </Grid>

      <Grid item xs={12} className="main-topbar-buffer" />

      <Grid item xs={12} sm={3}>
        <Paper className="main-grid-item">
          <UserList />
        </Paper>
      </Grid>

      <Grid item xs={12} sm={9}>
        <Paper className="main-grid-item">
          <Routes>
            <Route
              path="/users"
              element={
                <div className="main-welcome">
                  <Typography variant="h5" gutterBottom>
                    Photo Sharing App
                  </Typography>

                  <Typography variant="body1">
                    Chọn một user ở danh sách bên trái để xem thông tin chi
                    tiết.
                  </Typography>
                </div>
              }
            />

            <Route
              path="/users/:userId"
              element={<UserDetail setTopBarContext={setTopBarContext} />}
            />

            <Route
              path="/photos/:userId"
              element={<UserPhotos setTopBarContext={setTopBarContext} />}
            />

            <Route path="*" element={<Navigate to="/users" replace />} />
          </Routes>
        </Paper>
      </Grid>
    </Grid>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
