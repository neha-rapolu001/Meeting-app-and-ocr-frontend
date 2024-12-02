import React, { useEffect, useState } from "react";
import {
  Container,
  Title,
  Card,
  Button,
  Text,
  Select,
  Loader,
  TextInput,
  CloseButton
} from "@mantine/core";
import { Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { getCookie, meeting_view, get_church_data, isSuperUser, person_view, tasks_view } from "../../api";
import AppSidebar from "../../components/appSidebar";
import MeetingCard from "./components/MeetingCard";
import TopBar from "../../components/appTopBar";

const Schedule = () => {
  const [meetings, setMeetings] = useState([]);
  const [allMeetings, setAllMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [churchDropdownOptions, setChurchDropdownOptions] = useState([]);
  const [selectedChurchDropdownOption, setSelectedChurchDropdownOption] = useState(null);
  const [mustGetMeetings, setMustGetMeetings] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [personMapping, setPersonMapping] = useState({});
  const [taskMapping, setTaskMapping] = useState({});


  const navigate = useNavigate();

  // Fetch meetings and church data
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await meeting_view();
        const privilege = getCookie("priv");

        const filterMeetings = (meeting) => {
          if (privilege === "1" && meeting.church.toString() === selectedChurchDropdownOption) return true;
          if (privilege === "2" && meeting.church.toString() === getCookie("church")) return true;
          if (privilege === "3" && meeting.created_by.toString() === getCookie("user-id")) return true;
          return false;
        };

        setAllMeetings(response?.data || []);
        setMeetings(response?.data.filter(filterMeetings) || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
        setMustGetMeetings(false);
      }
    };

    const fetchChurchDropdownData = async () => {
      try {
        const response = await get_church_data();
        setChurchDropdownOptions(
          response.data.map((church) => ({
            value: church.id.toString(),
            label: church.name,
          }))
        );
      } catch (error) {
        console.error(error);
      }
    };

    if (mustGetMeetings) fetchMeetings();
    fetchChurchDropdownData();
  }, [mustGetMeetings, selectedChurchDropdownOption]);

  const newMeeting = () => {
    navigate("/schedule/meeting", { state: { meeting: null, clearForm: true } });
  };

  const onChurchDropdownOptionChange = (value) => {
    setSelectedChurchDropdownOption(value);
    setMeetings(allMeetings.filter((meeting) => meeting.church.toString() === value));
  };

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const response = await person_view(getCookie("church"));
        const mapping = {};
        response.data.forEach((person) => {
          mapping[person.id] = person.name; // Create a mapping of person ID to name
        });
        setPersonMapping(mapping); // Save the mapping to state
      } catch (error) {
        console.error("Error fetching persons:", error);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await tasks_view();
        const mapping = {};
        console.log("response", response);
        response.data.results.forEach((task) => {
          mapping[task.id] = task;
        });
        setTaskMapping(mapping);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
  
    fetchPersons();
    fetchTasks();
  }, []);
  

  useEffect(() => {
    const filteredMeetings = allMeetings.filter((meeting) => {
      const searchText = searchQuery.toLowerCase();
  
      // Attendees string
      const attendees = (meeting.attendees || [])
        .map((id) => personMapping[id]?.toLowerCase() || "")
        .join(" ");
  
      // Tasks string (name, end date, priority)
      const tasks = (meeting.meeting_tasks || [])
        .map((id) => {
          const task = taskMapping[id] || {};
          return [
            task.task_name?.toLowerCase() || "",
            task.priority?.toLowerCase() || ""
          ].join(" ");
        })
        .join(" ");
  
      // Employees (example: meeting.employees or task.assigned_to)
      const employees = (meeting.employees || [])
        .map((id) => personMapping[id]?.toLowerCase() || "")
        .join(" ");

      console.log(attendees);
  
      // Check if search text matches any field
      return (
        meeting.name.toLowerCase().includes(searchText) ||
        meeting.type.toLowerCase().includes(searchText) ||
        meeting.date.toLowerCase().includes(searchText) ||
        meeting.time.toLowerCase().includes(searchText) ||
        meeting.notes?.toLowerCase().includes(searchText) ||
        meeting.questions.toLowerCase().includes(searchText) ||
        meeting.agenda?.toLowerCase().includes(searchText) ||
        meeting.action_steps.toLowerCase().includes(searchText) ||
        meeting.objective?.toLowerCase().includes(searchText) ||
        attendees.includes(searchText) ||
        tasks.includes(searchText) ||
        employees.includes(searchText)
      );
    });
  
    setMeetings(filteredMeetings);
  }, [searchQuery, allMeetings, personMapping, taskMapping]);
  
  

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh"}}>
      {/* TopBar */}
      <TopBar />

      <div style={{ display: "flex", flex: 1, flexDirection: "row", overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: "9%" }}>
          <AppSidebar />
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflow: "auto", backgroundColor: "#f5f5f5" }}>
          <Card
            style={{
              minHeight: "calc(100vh - 32px)",
            }}
          >
            <div
              className="p-3 card-head"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
              }}
            >
              {/* Left-aligned Title */}
              <Title order={2} style={{ fontSize: "40px", fontWeight: "bold"}}>
                Meetings
              </Title>

              {/* Right-aligned Search, Dropdown, or Button */}
              <div style={{ display: "flex", gap: "16px", alignItems: "center", position: "absolute", right: "60px" }}>
                <TextInput
                  placeholder="Search meetings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.currentTarget.value)}
                  style={{ width: "250px" }}
                  rightSection={
                    <CloseButton
                      aria-label="Clear input"
                      onClick={() => setSearchQuery('')}
                    />
                  }
                />
                {getCookie("priv") === "1" && (
                  <Select
                    variant="filled"
                    color="#65729e"
                    data={churchDropdownOptions}
                    value={selectedChurchDropdownOption}
                    onChange={onChurchDropdownOptionChange}
                    placeholder="Select a church"
                  />
                )}
                {!isSuperUser() && (
                  <Button
                    variant="filled"
                    color="#6776ab"
                    onClick={newMeeting}
                    style={{
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Add Meeting
                  </Button>
                )}
              </div>
            </div>

            <Text className="p-3 schedule-card-body">
              {isLoading ? (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <Loader size="xl" />
                </div>
              ) : (
                <Row className="equal-height">
                  {meetings.map((meeting) => (
                    <Col key={meeting.id} xs={12} md={6} lg={4}>
                      <MeetingCard
                        meeting={meeting}
                        mustGetMeetings={mustGetMeetings}
                        setMustGetMeetings={setMustGetMeetings}
                      />
                    </Col>
                  ))}
                </Row>
              )}
            </Text>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
