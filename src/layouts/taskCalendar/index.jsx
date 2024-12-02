import React, { useEffect, useState } from "react";
import { Container, Title, Card, Table } from "@mantine/core";
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import AppSidebar from "../../components/appSidebar";
import TopBar from "../../components/appTopBar";
import { tasks_view, getCookie, get_church_data } from "../../api";
import InformationModal from "../../components/modals/InformationModal";

const TaskCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mustGetTasks, setMustGetTasks] = useState(true);
  const [churchData, setChurchData] = useState([]);
  const [taskId, setTaskId] = useState();
  const [isInformationModalOpen, setIsInformationModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const backgroundColor = selectedDate ? "#b0bce8" : "#b0bce8"; // Blue for non-selected days
  const priorityColors = {
    high: 'red',
    medium: 'orange',
    low: 'green'
  };

  useEffect(() => {
    get_church_data()
      .then((req) => {
        const Data = req.data;
        let tempData = [];
        Data.forEach(x => {
          tempData.push({
            "id": x.id,
            "name": x.name
          });
        });
        setChurchData(tempData);
      })
      .catch((error) => console.log(error));
    viewAllTasks();
  }, [mustGetTasks]);

  const viewAllTasks = async () => {
    const response = await tasks_view().catch((error) => console.log(error));
    setIsLoading(false);
    const privilege = getCookie("priv");
    const church = getCookie("church");
    const id = getCookie("user-id");
    const tempTasks = response?.data?.results || [];

    let filteredTasks = [];
    if (privilege === "1") {
      filteredTasks = tempTasks;
    } else if (privilege === "2") {
      filteredTasks = tempTasks.filter(task => task.church + "" === church);
    } else if (privilege === "3") {
      filteredTasks = tempTasks.filter(task => task.created_by + "" === id + "");
    }
    setTasks(filteredTasks);
  };

  const tileContent = ({ date }) => {
    const tasksForDate = getTasksForDate(date, tasks);
    const isSelectedDate = date.toDateString() === selectedDate.toDateString();
  
    if (tasksForDate.length > 0) {
      return (
        <div style={{
          borderRadius: "5px",
          padding: "5px",
        }}>
          {tasksForDate.map((task, index) => {
            // Set background color based on task priority
            const taskColor = priorityColors[task.priority] || 'gray'; // Default to gray if no priority
            return (
              <div key={index} style={{
                backgroundColor: taskColor, // Background color based on task priority
                color: "white",  // White text for contrast
                borderRadius: "3px",
                margin: "2px 0", // Space between tasks
                padding: "3px 5px",
              }}>
                {task.task_name}
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const getTasksForDate = (date, tasks) => {
    return tasks.filter((task) => date.toISOString().split('T')[0] === task.end_date);
  };

  const selectedTasks = getTasksForDate(selectedDate, tasks);

  const getChurchName = (churchId) => {
    const church = churchData.find(church => church.id === churchId);
    return church ? church.name : "Unknown";
  };

  const toggleInformationModal = () => {
    setIsInformationModalOpen(!isInformationModalOpen);
  };

  const onTaskClick = (task) => {
    setTaskId(task.id);
    setSelectedTask(task);
    console.log("Selectec task:", selectedTask);
    toggleInformationModal();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <TopBar />
      <div style={{ display: "flex" }}>
        <AppSidebar />
        <div style={{ position: "relative", left: "15%", width: "100%", height: "94vh" }} className="my-3">
        <InformationModal
          id={taskId}
          edit_task="null"
          task={selectedTask || {}}
          isOpen={isInformationModalOpen}
          toggle={toggleInformationModal}
        />
          <Card className="my-card my-card-height schedule-card" style={{ width: "80%" }}>
            <Title ta="center" mr={320} mb={30} order={1}>Task Calendar</Title>
            <div className="calendar-wrapper">
              <Calendar
                value={selectedDate}
                className="custom-calendar"
                onClickDay={handleDateClick}
                tileContent={tileContent}
              />
              {selectedDate && (
                <div>
                  <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '20px 0' }} />
                  <div style={{ backgroundColor: "#b0bce8", padding: '20px', borderRadius: '8px' }}>
                    <Title order={4} color="white">
                      Tasks for {selectedDate.toISOString().split('T')[0]}
                    </Title>
                    <Table highlightOnHover style={{ marginTop: '10px'}}>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Task Name</Table.Th>
                          <Table.Th>Employee Name</Table.Th>
                          {getCookie("priv") && <Table.Th>Church</Table.Th>}
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {selectedTasks.map((task, index) => (
                          <Table.Tr key={index} onClick={() => onTaskClick(task)}>
                            <Table.Td>{task.task_name}</Table.Td>
                            <Table.Td>{task.employee_name}</Table.Td>
                            {getCookie("priv") && <Table.Td>{getChurchName(task.church)}</Table.Td>}
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskCalendar;
