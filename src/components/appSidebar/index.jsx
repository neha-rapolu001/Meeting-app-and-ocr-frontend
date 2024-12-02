import React, { useEffect } from "react";
import { Menu, MenuItem } from "react-pro-sidebar";
import { useNavigate, Link } from "react-router-dom";
import { logout, getCookie, updateCookie, isSuperUser, isAdmin, isLeader } from "../../api";
import { Text, Box } from "@mantine/core"; // Mantine components
import { useHover } from '@mantine/hooks'; // Mantine's useHover hook
import {
    SpeedOutlined as SpeedOutlinedIcon,
    ChatBubbleOutline as ChatBubbleOutlineIcon,  // Updated icon
    AssignmentOutlined as AssignmentOutlinedIcon,
    LogoutOutlined as LogoutOutlinedIcon,
    AddCircleOutlineOutlined as AddCircleOutlineOutlinedIcon,
    GridViewOutlined as GridViewOutlinedIcon,
    CalendarMonthOutlined as CalendarMonthOutlinedIcon,
    People as PeopleIcon,
    Receipt as ReceiptIcon,
    AttachMoney as AttachMoneyIcon,
    EmojiPeople as EmojiPeopleIcon,
    Church as ChurchIcon,
    Group as GroupIcon,
} from '@mui/icons-material'; // Material UI icons

const AppSidebar = () => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = React.useState(false);

    useEffect(() => {
        if (getCookie("user") == null && getCookie("priv") == null) {
            updateCookie("user", "");
            updateCookie("priv", "");
        }

        if (getCookie("user") === "" && getCookie("priv") === "") {
            navigate('/');
        }
    }, []);

    const handleLogout = async () => {
        try {
            console.log("Attempting logout...");
            await logout(); // Assuming logout returns a promise
            console.log("Logout successful!");
            updateCookie('user', '');
            updateCookie('priv', '');
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error.response?.data || error.message);
        }
    };
    

    return (
        <Box
            style={{
                width: '150px',
                height: '100vh',
                backgroundColor: '#39383b',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                padding: 0,
                position: 'fixed',
                textAlign: "center",
                zIndex: 10,
                gap: '10px',
                paddingTop: '20px',
            }}
        >
            
            <Menu
                style={{
                    width: '100%',
                    flexGrow: 1,
                    padding: 0,
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}
            >
                <HoverableMenuItem
                    link="/dashboard"
                    icon={<SpeedOutlinedIcon />}
                    text="Dashboard"
                />

                <SubMenuItem
                    icon={<ChatBubbleOutlineIcon />}
                    text="Meetings"
                    submenu={
                        <>
                        { !isSuperUser() && (
                            <HoverableMenuItem
                            link="/schedule/meeting"
                            icon={<AddCircleOutlineOutlinedIcon />}
                            text="New"
                            state={{ meeting: null, clearForm: true }}
                            />
                        )}
                            <HoverableMenuItem
                                link="/schedule"
                                icon={<GridViewOutlinedIcon />}
                                text="List"
                            />
                        </>
                    }
                />

                <SubMenuItem
                    icon={<AssignmentOutlinedIcon />}
                    text="Tasks"
                    submenu={
                        <>
                            <HoverableMenuItem
                                link="/task-calendar"
                                icon={<CalendarMonthOutlinedIcon />}
                                text="Dates"
                            />
                            <HoverableMenuItem
                                link="/tasks"
                                icon={<GridViewOutlinedIcon />}
                                text="List"
                            />
                        </>
                    }
                />

                {(isSuperUser() || isAdmin()) && (
                    <HoverableMenuItem
                        link="/users"
                        icon={<PeopleIcon />}
                        text="Users"
                    />
                )}

                {isSuperUser() && (
                    <HoverableMenuItem
                        link="/subscribers"
                        icon={<GroupIcon />}
                        text="Subcribers"
                    />
                )}

                {isSuperUser() && (
                    <HoverableMenuItem
                        link="/edit-church"
                        icon={<ChurchIcon />}
                        text="Edit Church"
                    />
                )}

                {(isAdmin() || isLeader()) && (
                    <HoverableMenuItem
                        link="/people"
                        icon={<EmojiPeopleIcon />}
                        text="People"
                />
                )}

                {(isSuperUser() || isAdmin()) && (
                    <HoverableMenuItem
                        link="/subscriptions"
                        icon={<AttachMoneyIcon />}
                        text="Subscriptions"
                    />
                )}
                {isSuperUser() && (
                    <HoverableMenuItem
                        link="/paymenthistory"
                        icon={<ReceiptIcon />}
                        text="Payments"
                    />
                )}
                {isAdmin() && (
                    <HoverableMenuItem
                    link="/paymenthistorya"
                    icon={<ReceiptIcon />}
                    text="Payments"
                />
                )}
                <MenuItem
                    onClick={handleLogout}
                    className="menu-item"
                    style={{
                        textAlign: 'center',
                        marginBottom: '5px', 
                        borderRadius: '4px',
                        transition: 'background-color 0.3s ease, color 0.3s ease', // Smooth transition for hover effects
                        backgroundColor: isHovered ? '#0a0a0a' : 'transparent', // Dark background on hover
                        color: isHovered ? '#ffffff' : '#bfbfbf', // Light text on hover
                        padding: '15px',
                        display: 'flex', // Use flexbox to align icon and text vertically
                        flexDirection: 'column', // Stack icon on top of text
                        alignItems: 'center', // Center align the items horizontally
                        justifyContent: 'center', // Center align the items vertically
                        minHeight: '80px', // Ensure there's enough height for both icon and text
                    }}
                    onMouseEnter={() => setIsHovered(true)} // Enable hover
                    onMouseLeave={() => setIsHovered(false)} // Disable hover
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <LogoutOutlinedIcon className="menu-item-icon"/>
                        <Text
                            className="menu-item-text"
                            style={{
                                marginTop: '8px', 
                                fontSize: '14px',
                                display: 'block', // Ensure text is treated as block
                                color: isHovered ? '#ffffff' : '#bfbfbf', // Ensure text color is visible
                            }}
                        >
                            Logout
                        </Text>
                    </div>
                </MenuItem>

            </Menu>
        </Box>
    );
};

// Component for hoverable menu items
const HoverableMenuItem = ({ link, icon, text, state=null }) => {
    const { hovered, ref } = useHover();

    return (
        <Link to={link} state={state} style={{ textDecoration: 'none', width: '100%' }}>  {/* Remove any default link styling */}
            <MenuItem
                ref={ref}
                style={{
                    backgroundColor: hovered ? '#0a0a0a' : 'transparent',
                    color: hovered ? '#ffffff' : '#bfbfbf',
                    borderRadius: '4px',
                    transition: 'background-color 0.3s ease',
                    padding: '15px',  // Increased padding for better spacing
                    margin: '5px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    minHeight: '80px',  // Ensure sufficient height
                    whiteSpace: 'nowrap',  // Prevent text from wrapping
                }}
                className="hoverable-menu-item"
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
                <Text style={{ marginTop: '8px', fontSize: '14px' }}>{text}</Text>
                </div>
            </MenuItem>
        </Link>
    );
};

// SubMenuItem component
const SubMenuItem = ({ icon, text, submenu }) => {
    const { hovered, ref } = useHover();

    return (
        <div style={{ position: 'relative' }} ref={ref}>
            <MenuItem
                style={{
                    backgroundColor: hovered ? '#0a0a0a' : 'transparent',
                    color: hovered ? '#ffffff' : '#bfbfbf',
                    borderRadius: '4px',
                    transition: 'background-color 0.3s ease',
                    padding: '15px',  // Increased padding for better spacing
                    margin: '5px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    minHeight: '80px',  // Ensure sufficient height
                    whiteSpace: 'nowrap',  // Prevent text from wrapping
                }}
                className="hoverable-submenu-item"
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {icon}
                    <Text style={{ marginTop: '8px', fontSize: '14px' }}>{text}</Text> {/* Adjust margin and font size */}
                </div>
            </MenuItem>

            {hovered && (
                <div
                    style={{
                        position: 'absolute',
                        top: -15,
                        left: '105px',
                        backgroundColor: '#39383b',
                        borderRadius: '4px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        zIndex: 999,
                        padding: '10px 0',
                        minWidth: '150px',
                    }}
                >
                    <Menu style={{ display: 'flex', flexDirection: 'column' }}>
                        {submenu}
                    </Menu>
                </div>
            )}
        </div>
    );
};


export default AppSidebar;
