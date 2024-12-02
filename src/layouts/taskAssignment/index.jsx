import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { Title, Card, Button, Text, Select, Loader, TextInput, CloseButton } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { isSuperUser, getCookie, tasks_view, get_church_data } from "../../api";
import AppSidebar from "../../components/appSidebar";
import TaskCard from "./components/TaskCard";
import CreateTaskModal from "../../components/modals/CreateTaskModal";
import TopBar from "../../components/appTopBar";

const Task = () => {
  const navigate = useNavigate();
  const [allTasks, setAllTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [displayedTasks, setDisplayedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [mustGetTasks, setMustGetTasks] = useState(true);
  const [churchDropdownOptions, setChurchDropdownOptions] = useState([]);
  const [selectedChurchDropdownOption, setSelectedChurchDropdownOption] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleCreateTaskModal = () => {
    setIsCreateTaskModalOpen((prev) => !prev);
    setMustGetTasks(true);
  };

  useEffect(() => {
    if (mustGetTasks) fetchTasks();
    fetchChurchDropdownData();
  }, [mustGetTasks]);

  useEffect(() => {
    let filteredTasks = tasks;

    if (getCookie("priv") === "1" && selectedChurchDropdownOption) {
      filteredTasks = filteredTasks.filter(
        (task) => task.church.toString() === selectedChurchDropdownOption
      );
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.task_name.toLowerCase().includes(lowercasedQuery) ||
          task.task_description.toLowerCase().includes(lowercasedQuery) ||
          task.priority.toLowerCase().includes(lowercasedQuery) ||
          task.employees.some((employee) =>
            employee.name?.toLowerCase().includes(lowercasedQuery)
          )
      );
    }

    setDisplayedTasks(filteredTasks);
  }, [tasks, searchQuery, selectedChurchDropdownOption]);

  const fetchTasks = async () => {
    try {
      const response = await tasks_view();
      const allTasks = response?.data.results || [];
      setAllTasks(allTasks);

      const privilege = getCookie("priv");
      let filteredTasks = allTasks;

      if (privilege === "1" && selectedChurchDropdownOption) {
        filteredTasks = allTasks.filter(
          (task) => task.church.toString() === selectedChurchDropdownOption
        );
      } else if (privilege === "2") {
        const churchId = getCookie("church");
        filteredTasks = allTasks.filter(
          (task) => task.church.toString() === churchId
        );
      } else if (privilege === "3") {
        const userId = getCookie("user-id");
        filteredTasks = allTasks.filter(
          (task) => task.created_by.toString() === userId
        );
      }

      setTasks(filteredTasks);
      setDisplayedTasks(filteredTasks); // Initialize displayed tasks
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
      setMustGetTasks(false);
    }
  };

  const fetchChurchDropdownData = async () => {
    try {
      const response = await get_church_data();
      const churchData = response?.data || [];
      setChurchDropdownOptions(
        churchData.map((church) => ({
          value: church.id.toString(),
          label: church.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching church data:", error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <TopBar />

      <div style={{ display: "flex", flex: 1, flexDirection: "row", overflow: "hidden" }}>
        <div style={{ width: "9%" }}>
          <AppSidebar />
        </div>

        <div style={{ flex: 1, overflow: "auto", backgroundColor: "#f5f5f5" }}>
          <Card style={{ minHeight: "calc(100vh - 32px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems:"center", padding: "16px" }}>
              <Title order={2} style={{ fontSize: "40px", fontWeight: "bold" }}>Tasks</Title>
              <div style={{ display: "flex", gap: "16px", alignItems: "center", position: "absolute", right: "60px" }}>
                <TextInput
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ minWidth: "250px" }}
                  rightSection={
                    <CloseButton
                      aria-label="Clear input"
                      onClick={() => setSearchQuery('')}
                    />
                  }
                />
                {getCookie("priv") === "1" && (
                  <Select
                    data={churchDropdownOptions}
                    value={selectedChurchDropdownOption}
                    onChange={(value) => setSelectedChurchDropdownOption(value)}
                    placeholder="Select a church"
                  />
                )}
                {!isSuperUser() && (
                  <Button variant="filled" color="#6776ab" onClick={toggleCreateTaskModal}>Add Task</Button>
                )}
              </div>
            </div>

            <Text style={{ padding: "16px" }}>
              {isLoading ? (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <Loader size="xl" />
                </div>
              ) : (
                <Row>
                  {displayedTasks.map((task) => (
                    <Col key={task.id} xs={12} md={6} lg={4}>
                      <TaskCard task={task} setMustGetTasks={setMustGetTasks} />
                    </Col>
                  ))}
                </Row>
              )}
            </Text>
          </Card>
        </div>
      </div>

      <CreateTaskModal isOpen={isCreateTaskModalOpen} toggle={toggleCreateTaskModal} />
    </div>
  );
};

export default Task;
