import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
//import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import BarChartIcon from "@mui/icons-material/BarChart";
import { Link } from "react-router-dom"; // Import Link from React Router
import AddBoxIcon from '@mui/icons-material/AddBox';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ScheduleIcon from '@mui/icons-material/Schedule';
//import GrassIcon from '@mui/icons-material/Grass';
import BlenderIcon from '@mui/icons-material/Blender';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import "./sidebar.css";

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
    segment: "mealHistory",
    title: "Meal History",
    icon: <ScheduleIcon />,
    path: "/mealHistory",
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
        segment: "weight tracking",
        title: "Weight Tracking",
        icon: <MonitorWeightIcon />,
        path: "/tracking/weight", // Add the route for weight tracking
      },
      
      {
        segment: "macro tracking",
        title: "Macro Tracking",
        icon: <BlenderIcon />,
        path: "/tracking/macro", // Add path for routing
      },
      {
        segment: "calorie tracking",
        title: "Calorie Tracking",
        icon: <FastfoodIcon />,
        path: "/tracking/calorie", // Add path for routing
      },
    ],
  },
];

function Sidebar() {
  return (
    <Box className="sidebar-container">
      <nav>
        {NAVIGATION.map((item, index) => {
          if (item.kind === "header") {
            return (
              <Typography className="sidebar-header">
                {item.title}
              </Typography>
            );
          }

          if (item.kind === "divider") {
            return <hr key={index} className="sidebar-divider"/>;
          }

          if (item.children) {
            return (
              <div key={index}>
                <Typography className="sidebar-header">
                  {item.title}
                </Typography>
                {item.children.map((child, childIndex) => (
                  <Link key={childIndex} to={child.path} className="sidebar-link">
                    {child.icon}
                    <span style={{ marginLeft: "10px" }}>{child.title}</span>
                  </Link>
                ))}
              </div>
            );
          }

          return (
            <Link key={index} to={item.path} className="sidebar-link">
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