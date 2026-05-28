import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Grid, Paper, Typography } from "@mui/material";

import TopBar from "./components/TopBar";
import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";
import UserPhotos from "./components/UserPhotos";

import "./App.css";

const App = () => {
  const [topBarContext, setTopBarContext] = useState("Users");

  return (
    <Router>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TopBar topBarContext={topBarContext} />
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
    </Router>
  );
};

export default App;
