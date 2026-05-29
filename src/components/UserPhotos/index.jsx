import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

const SERVER_URL = process.env.REACT_APP_API_URL;

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  return new Date(dateValue).toLocaleString("vi-VN");
};

const UserPhotos = ({ setTopBarContext }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});

  const loadPhotos = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const userData = await fetchModel(`/user/${userId}`);
      const photoData = await fetchModel(`/photosOfUser/${userId}`);

      setUser(userData);
      setPhotos(photoData);
      setTopBarContext(
        `Photos of ${userData.first_name} ${userData.last_name}`
      );
    } catch (error) {
      setErrorMessage(error.message);
      setTopBarContext("Error");
    } finally {
      setLoading(false);
    }
  }, [userId, setTopBarContext]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos, location.search]);

  const handleCommentChange = (photoId, value) => {
    setCommentInputs({
      ...commentInputs,
      [photoId]: value,
    });
  };

  const handleAddComment = async (photoId) => {
    try {
      setErrorMessage("");

      const commentText = commentInputs[photoId] || "";

      if (!commentText.trim()) {
        setErrorMessage("Comment cannot be empty");
        return;
      }

      const token = localStorage.getItem("photo_app_token");

      const response = await fetch(`${SERVER_URL}/commentsOfPhoto/${photoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment: commentText,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Add comment failed");
      }

      setCommentInputs({
        ...commentInputs,
        [photoId]: "",
      });

      await loadPhotos();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  if (loading) {
    return (
      <div className="user-photos-loading">
        <CircularProgress size={24} />
        <Typography>Loading photos...</Typography>
      </div>
    );
  }

  if (errorMessage) {
    return <Alert severity="error">{errorMessage}</Alert>;
  }

  if (!user) {
    return <Alert severity="error">User not found</Alert>;
  }

  return (
    <div className="user-photos-container">
      <Typography variant="h4" gutterBottom>
        Photos of {user.first_name} {user.last_name}
      </Typography>

      {photos.length === 0 && (
        <Alert severity="info">User này chưa có ảnh.</Alert>
      )}

      {photos.map((photo) => (
        <Card className="photo-card" key={photo._id}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Created: {formatDate(photo.date_time)}
            </Typography>

            <img
              className="photo-image"
              src={`${SERVER_URL}/images/${photo.file_name}`}
              alt={photo.file_name}
            />

            <Typography variant="h6" className="comment-title">
              Comments
            </Typography>

            {photo.comments.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No comments yet.
              </Typography>
            )}

            {photo.comments.map((comment) => (
              <div className="comment-box" key={comment._id}>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(comment.date_time)}
                </Typography>

                {comment.user ? (
                  <Typography>
                    <span
                      className="comment-user"
                      onClick={() => navigate(`/users/${comment.user._id}`)}
                    >
                      {comment.user.first_name} {comment.user.last_name}
                    </span>
                    : {comment.comment}
                  </Typography>
                ) : (
                  <Typography>
                    <strong>Unknown user:</strong> {comment.comment}
                  </Typography>
                )}

                <Divider className="comment-divider" />
              </div>
            ))}

            <div className="add-comment-box">
              <TextField
                label="Add a comment"
                value={commentInputs[photo._id] || ""}
                onChange={(event) =>
                  handleCommentChange(photo._id, event.target.value)
                }
                fullWidth
                size="small"
              />

              <Button
                variant="contained"
                onClick={() => handleAddComment(photo._id)}
              >
                Add Comment
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserPhotos;
