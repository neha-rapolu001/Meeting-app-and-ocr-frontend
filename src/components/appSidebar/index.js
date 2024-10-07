/**
 * This component is the AppSidebar component of the application. It contains logout button and links to different pages.
 * 1. AppSidebar
 * 2. Schedule table
 * 8. Footer
 *
 * @params: {props}
 *
 *
 */

import React, { useState } from "react";
import {
    Container,
    Nav,
    NavLink,
    Button
  } from "reactstrap";
import {
  Sidebar,
  Menu,
  SubMenu,
  MenuItem
} from "react-pro-sidebar";
import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { useNavigate, Link } from "react-router-dom";
import { logout, tasks_view } from "../../api";
import "bootstrap/dist/css/bootstrap.min.css";
import { AccessAlarm, ThreeDRotation } from "@mui/icons-material";


const AppSidebar = () => {

  const navigate = useNavigate();

  const handleLogout = async () => {
      logout()
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    };

  return (
    <Sidebar
      className="sidebar"
      width="8%"
      backgroundColor="rgba(200, 250, 200, 0.2)"
      rootStyles={{position: "fixed", borderRightColor: "rgb(160, 200, 160)"}}
    >
      <Menu>
        <MenuItem className="sidebar-menu-item" component={<Link to="/dashboard" />}>
          <SpeedOutlinedIcon className="sidebar-menu-item-icon" />
          <br />
          Dashboard
        </MenuItem>
        <SubMenu
          className="sidebar-menu-item"
          label={
            <div>
              <ForumOutlinedIcon className="sidebar-menu-item-icon" />
              <br />
              Meetings
            </div>
          }
        >
          <MenuItem className="sidebar-menu-item" component={<Link to="/schedule/meeting" state={{meeting: null, clearForm: true}} />}>
            <AddCircleOutlineOutlinedIcon />
            <br />
            New
          </MenuItem>
          <MenuItem className="sidebar-menu-item" component={<Link to="/schedule" />}>
            <GridViewOutlinedIcon />
            <br />
            List
          </MenuItem>
        </SubMenu>
        <SubMenu
          className="sidebar-menu-item"
          label={
            <div>
              <AssignmentOutlinedIcon className="sidebar-menu-item-icon" />
              <br />
              Tasks
            </div>
          }
        >
          <MenuItem className="sidebar-menu-item" component={<Link to="/task-calendar" />}>
            <CalendarMonthOutlinedIcon />
            <br />
            <div style={{overflow: "visible"}}>Dates</div>
          </MenuItem>
          <MenuItem className="sidebar-menu-item" component={<Link to="/tasks" />}>
            <GridViewOutlinedIcon />
            <br />
            List
          </MenuItem>
        </SubMenu>
        <MenuItem className="sidebar-menu-item" component={<div onClick={handleLogout} />}>
          <LogoutOutlinedIcon className="sidebar-menu-item-icon" />
          <br />
          Logout
        </MenuItem>
      </Menu>
    </Sidebar>
)}

export default AppSidebar;

