import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
//import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import { Link } from "react-router-dom"; // Import Link from React Router
import AddBoxIcon from '@mui/icons-material/AddBox';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const NAVIGATION = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "home",
    title: "Home",
    icon: <DashboardIcon />,
    path: "/home", // Add path for routing
  },
  {
    segment: "account",
    title: "Account",
    icon: <PersonIcon />,
    path: "/account", // Add path for routing
  },
  {
    segment: "meallog",
    title: "meal log",
    icon: <AddBoxIcon />,
    path: "/meallog",
  },
  {
    segnment: "mealplan",
    title: "meal plan",
    icon: <RestaurantIcon />,
    path: "/mealplan",
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Analytics",
  },
  {
    segment: "tracking",
    title: "Tracking",
    icon: <BarChartIcon />,
    children: [
      {
        segment: "macro tracking",
        title: "Macro Tracking",
        icon: <DescriptionIcon />,
        path: "/tracking/macro", // Add path for routing
      },
      {
        segment: "calorie tracking",
        title: "Calorie Tracking",
        icon: <DescriptionIcon />,
        path: "/tracking/calorie", // Add path for routing
      },
    ],
  },
];

function Sidebar() {
  return (
    <Box
      sx={{
        width: 250,
        position: "sticky",
        left: 0,
        top: "0px", // Matches topbar height
        bottom: 0, // Extend to bottom of viewport
        zIndex: 1000,
        overflow: "hidden", // Prevent internal scrolling
      }}
    >
      <nav>
        {NAVIGATION.map((item, index) => {
          if (item.kind === "header") {
            return (
              <Typography key={index} variant="h6" sx={{ padding: "10px" }}>
                {item.title}
              </Typography>
            );
          }

          if (item.kind === "divider") {
            return <hr key={index} />;
          }

          if (item.children) {
            return (
              <div key={index}>
                <Typography variant="subtitle1" sx={{ padding: "10px" }}>
                  {item.title}
                </Typography>
                {item.children.map((child, childIndex) => (
                  <Link
                    key={childIndex}
                    to={child.path}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    {child.icon}
                    <span style={{ marginLeft: "10px" }}>{child.title}</span>
                  </Link>
                ))}
              </div>
            );
          }

          return (
            <Link
              key={index}
              to={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {item.icon}
              <span style={{ marginLeft: "10px" }}>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </Box>
  );
}

Sidebar.propTypes = {
  window: PropTypes.func,
};

export default Sidebar;