import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

import "./styles.css";

const TopBar = ({ topBarContext }) => {
  return (
    <AppBar position="fixed" className="topbar-appbar">
      <Toolbar className="topbar-toolbar">
        <Typography variant="h5" className="topbar-name">
          Đinh Việt Dũng
        </Typography>

        <Typography variant="h6">{topBarContext}</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
