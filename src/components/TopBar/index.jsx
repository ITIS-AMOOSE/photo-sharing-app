import React, { useRef } from "react";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";

import "./styles.css";

const SERVER_URL = process.env.REACT_APP_API_URL;

const TopBar = ({ topBarContext, currentUser, onLogout, onPhotoUploaded }) => {
  const fileInputRef = useRef(null);

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleUploadPhoto = async (event) => {
    try {
      const file = event.target.files[0];

      if (!file) {
        return;
      }

      const token = localStorage.getItem("photo_app_token");

      const formData = new FormData();
      formData.append("photo", file);

      const res = await fetch(`${SERVER_URL}/photos/new`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Upload photo failed");
      }

      const photo = await res.json();

      if (onPhotoUploaded) {
        onPhotoUploaded(photo);
      }

      event.target.value = "";
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <AppBar position="fixed" className="topbar-appbar">
      <Toolbar className="topbar-toolbar">
        <Typography variant="h5" className="topbar-name">
          Photo Sharing App
        </Typography>

        <div className="topbar-right">
          <Typography variant="h6">
            {currentUser ? `Hi ${currentUser.first_name}` : "Please Login"}
          </Typography>

          {currentUser && (
            <>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="topbar-file-input"
                onChange={handleUploadPhoto}
              />

              <Button
                color="inherit"
                variant="outlined"
                onClick={handleChooseFile}
              >
                Add Photo
              </Button>

              <Button color="inherit" variant="outlined" onClick={onLogout}>
                Logout
              </Button>
            </>
          )}

          {currentUser && (
            <Typography variant="body1" className="topbar-context">
              {topBarContext}
            </Typography>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
