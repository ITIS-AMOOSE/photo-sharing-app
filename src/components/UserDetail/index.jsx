import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

const UserDetail = ({ setTopBarContext }) => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        setUser(null);
        setErrorMessage("");

        const data = await fetchModel(`/user/${userId}`);

        setUser(data);
        setTopBarContext(`${data.first_name} ${data.last_name}`);
      } catch (error) {
        setErrorMessage(error.message);
        setTopBarContext("Error");
      }
    };

    loadUser();
  }, [userId, setTopBarContext]);

  if (errorMessage) {
    return <Alert severity="error">{errorMessage}</Alert>;
  }

  if (!user) {
    return (
      <div className="user-detail-loading">
        <CircularProgress size={24} />
        <Typography>Loading user...</Typography>
      </div>
    );
  }

  return (
    <Card className="user-detail-card">
      <CardContent>
        <Typography variant="h4" gutterBottom>
          {user.first_name} {user.last_name}
        </Typography>

        <Typography className="user-detail-row">
          <strong>Location:</strong> {user.location}
        </Typography>

        <Typography className="user-detail-row">
          <strong>Occupation:</strong> {user.occupation}
        </Typography>

        <Typography className="user-detail-row">
          <strong>Description:</strong> {user.description}
        </Typography>

        <Button
          variant="contained"
          className="user-detail-button"
          onClick={() => navigate(`/photos/${user._id}`)}
        >
          View Photos
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserDetail;
