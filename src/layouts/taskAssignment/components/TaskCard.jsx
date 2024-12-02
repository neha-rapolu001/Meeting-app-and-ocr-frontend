import React, { useState, useEffect } from "react";
import { Card, Title, Text, Grid, Flex, Group } from "@mantine/core";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';
import EditTaskModal from "../../../components/modals/EditTaskModal";
import DeleteTaskModal from "../../../components/modals/DeleteTaskModal";
import InformationModal from "../../../components/modals/InformationModal";
import { isSuperUser, getCookie, person_view } from "../../../api";
import IconCalendar from "@mui/icons-material/CalendarToday";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

const TaskCard = (props) => {
  const [showIconButtons, setShowIconButtons] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
  const [isInformationModalOpen, setIsInformationModalOpen] = useState(false);
  const [taskId, setTaskId] = useState();
  const [people, setPeople] = useState([]);
  const [employeeNames, setEmployeeNames] = useState([]);
  const privilege = getCookie("priv");

  useEffect(() => {
    fetchPeople();
  }, []);

  useEffect(() => {
    if (props.task.employees && props.task.employees.length > 0) {
      const names = props.task.employees.map(empId => {
        const employee = people.find(emp => emp.id === empId);
        return employee ? employee.name : "Unknown Employee"; // Fallback if employee not found
      });
      setEmployeeNames(names);
    }
  }, [props.task.employees, people]); // Re-run when employees or people data changes

  const fetchPeople = async () => {
    const church = parseInt(getCookie("church"));
    try {
      const response = await person_view(church);
      setPeople(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleEditTaskModal = () => {
    setShowIconButtons(false);
    setIsInformationModalOpen(false);
    setIsEditTaskModalOpen(!isEditTaskModalOpen);
    props.setMustGetTasks(!props.mustGetTasks);
  };

  const toggleDeleteTaskModal = () => {
    setShowIconButtons(false);
    setIsInformationModalOpen(false);
    setIsDeleteTaskModalOpen(!isDeleteTaskModalOpen);
    props.setMustGetTasks(!props.mustGetTasks);
  };

  const toggleInformationModal = () => {
    setTaskId(props.task.id);
    setShowIconButtons(false);
    setIsInformationModalOpen(!isInformationModalOpen);
  };

  const onCardClick = () => {
    setTaskId(props.task.id);
    toggleInformationModal();
  }

  const onEditClick = (event) => {
    event.stopPropagation();
    console.log(`Editing row ${props.task.id}`);
    setTaskId(props.task.id);
    toggleEditTaskModal(props.task);
  };

  const onDeleteClick = (event) => {
    event.stopPropagation();
    setTaskId(props.task.id);
    toggleDeleteTaskModal();
  };

  return (
      <Card
        className="outer-card card-margin"
        style={{
          backgroundColor: "#6776ab",
          borderRadius: "7px",
          width: "450px",
          height: "150px",
          padding: "20px 20px",
          cursor: "pointer", // Keep the cursor style on hover for card interaction
          position: "relative", // Keep position for fixed bottom section
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out", // Smooth transition for scaling and shadow
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)"; // Scale up on hover
          e.currentTarget.style.boxShadow = "0 10px 15px rgba(0, 0, 0, 0.1)"; // Add shadow on hover
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)"; // Reset scale
          e.currentTarget.style.boxShadow = "none"; // Reset shadow
        }}
      >
        {/* Modals */}
        <InformationModal
          id={taskId}
          edit_task={EditTaskModal}
          task={props.task}
          isOpen={isInformationModalOpen && !isEditTaskModalOpen && !isDeleteTaskModalOpen}
          toggle={toggleInformationModal}
        />
        <EditTaskModal
          id={props.task}
          isOpen={isEditTaskModalOpen}
          toggle={toggleEditTaskModal}
        />
        <DeleteTaskModal
          id={props.task}
          isOpen={isDeleteTaskModalOpen}
          toggle={toggleDeleteTaskModal}
        />
    
        {/* Top Section (Similar to MeetingCard's header section with task name, status, and date) */}
        <Card.Section
          onClick={onCardClick}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6776ab",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left Section: Task Date */}
          <Flex align="center" direction="row" gap="sm">
          <IconCalendar size={32} style={{color:"#e6e6e8"}} />
            <Text style={{ fontSize: "12px", color: "#e6e6e8" }}>
              <small>{moment(props.task.end_date).format("MMM D, YYYY")}</small>
            </Text>
          </Flex>
    
          {/* Center: Task Title */}
          <Title order={4} style={{ color: '#e6e6e8', textAlign: "center", flex: 1 }}>
            {props.task.task_name}
          </Title>
    
          {/* Right Section: Icons for editing and deleting */}
          <Group spacing={0} style={{ gap: "0px" }}>
            {isSuperUser() && (
              <IconButton onClick={onEditClick} style={{ color: "#e6e6e8" }}>
                <RemoveRedEyeIcon />
              </IconButton>
            )}
            {!isSuperUser() && (
              <IconButton onClick={onEditClick} style={{ color: "#e6e6e8" }}>
                <EditIcon />
              </IconButton>
            )}
            {!isSuperUser() && (
              <IconButton onClick={onDeleteClick} style={{ color: "#e6e6e8" }}>
                <DeleteIcon />
              </IconButton>
            )}
          </Group>
        </Card.Section>
    
        {/* Bottom Section (Fixed like MeetingCard, showing status and extra details) */}
        <Card.Section
          onClick={onCardClick}
          style={{
            position: "absolute",
            bottom: 0, // Fixing this section to the bottom
            left: 15,
            right: 0,
            padding: "10px",
            backgroundColor: "#f2f4fa",
            height: "100px",
            display: "flex",
            flexDirection: "row", // Row layout for two columns
            justifyContent: "space-between", // Distribute space
            borderTop: "1px solid #ccc",
          }}
        >
          {/* Left Column: Status */}
          <div style={{ flex: 1 }}>
            <Text style={{ fontSize: "16px", color: "#2E2E2E" }}>
              Status: {props.task.is_completed ? "Completed" : "Pending"}
            </Text>
          </div>
    
          {/* Right Column: People Assigned */}
          <div style={{ flex: 1, textAlign: "right", marginRight: "40px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              {employeeNames.slice(0, 2).map((name, index) => (
                <Text key={index} style={{ fontSize: "14px", color: "#2E2E2E" }}>
                  {name}
                </Text>
              ))}
              {employeeNames.length > 2 && (
                <Text style={{ fontSize: "14px", color: "#2E2E2E" }}>...</Text>
              )}
            </div>
          </div>
        </Card.Section>
      </Card>
    );
};  

export default TaskCard;
