import React, { useState, useEffect } from "react";
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
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import ChurchIcon from '@mui/icons-material/Church';
import GroupIcon from '@mui/icons-material/Group';
import { useNavigate, Link } from "react-router-dom";
import { logout, getCookie, updateCookie, isSuperUser, isAdmin, isLeader } from "../../api";
import "bootstrap/dist/css/bootstrap.min.css";

const AppSidebar = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (getCookie("user") == null && getCookie("priv") == null) {
            updateCookie("user", "");
            updateCookie("priv", "");
        }

        if (getCookie("user") == "" && getCookie("priv") == "") {
            navigate('/');
        }
    }, []);

    const handleLogout = async () => {
        logout()
            .then(() => {
                updateCookie('user', '');
                updateCookie('priv', '');
                navigate("/");
            })
            .catch((error) => {
                console.log(error.response.data);
            });
    };

    return (
        <Sidebar
            className="sidebar"
            width="12%"
            backgroundColor="#2E2E2E"
            rootStyles={{ position: "fixed", borderRightColor: "#2E2E2E",overflow:"auto" }}
        >
            <Menu>
                <MenuItem className="sidebar-menu-item" component={<Link className="custom-link" to="/dashboard" />}>
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
                   { !isSuperUser() && <MenuItem className="sidebar-menu-item" component={<Link to="/schedule/meeting" state={{ meeting: null, clearForm: true }} />}>
                        <AddCircleOutlineOutlinedIcon />
                        <br />
                        New
                    </MenuItem> }
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
                    <MenuItem className="sidebar-menu-item" component={<Link className="custom-link" to="/task-calendar" />}>
                        <CalendarMonthOutlinedIcon />
                        <br />
                        Dates
                    </MenuItem>
                    <MenuItem className="sidebar-menu-item" component={<Link className="custom-link" to="/tasks" />}>
                        <GridViewOutlinedIcon />
                        <br />
                        List
                    </MenuItem>
                </SubMenu>
                {(isSuperUser() || isAdmin()) && (
                    <MenuItem className="sidebar-menu-item" component={<Link className="custom-link" to="/users" />}>
                        <PeopleIcon className="sidebar-menu-item-icon" />
                        <br />
                        Users
                    </MenuItem>
                )}
                {isSuperUser() && (
                    <MenuItem className="sidebar-menu-item" component={<Link className="custom-link" to="/subscribers" />}>
                        <GroupIcon className="sidebar-menu-item-icon" />
                        <br />
                        Subscribers
                    </MenuItem>
                )}
                {isSuperUser() && (
                    <MenuItem className="sidebar-menu-item" component={<Link className="custom-link" to="/edit-church" />}>
                        <ChurchIcon className="sidebar-menu-item-icon" />
                        <br />
                        Edit Church
                    </MenuItem>
                )}
                {(isAdmin() || isLeader()) && (
                    <MenuItem className="sidebar-menu-item" component={<Link className="custom-link" to="/people" />}>
                        <EmojiPeopleIcon  className="sidebar-menu-item-icon" />
                        <br />
                        People
                    </MenuItem>
                )}
                {(isSuperUser() || isAdmin()) && (
                    <MenuItem className="sidebar-menu-item" component={<Link className="custom-link"  to="/subscriptions" />}>
                        <AttachMoneyIcon  className="sidebar-menu-item-icon" />
                        <br />
                        Subscriptions
                    </MenuItem>
                )}
                {isSuperUser() && (
                    <MenuItem className="sidebar-menu-item" component={<Link className="custom-link" to="/paymenthistory" />}>
                        <ReceiptIcon />
                        <br />
                        Payments
                    </MenuItem>
                )}
                {isAdmin() && (
                    <MenuItem className="sidebar-menu-item" component={<Link className="custom-link" to="/paymenthistorya" />}>
                        <ReceiptIcon  className="sidebar-menu-item-icon"/>
                        <br />
                        Payments
                    </MenuItem>
                )}
                <MenuItem className="sidebar-menu-item" component={<div onClick={handleLogout} />}>
                    <LogoutOutlinedIcon className="sidebar-menu-item-icon" />
                    <br />
                    Logout
                </MenuItem>
            </Menu>
        </Sidebar>
    );
};

export default AppSidebar;
