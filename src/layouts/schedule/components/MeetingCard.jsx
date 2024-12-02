import React, { useState, useEffect } from "react";
import { Card, Title, Text, Grid, Flex, Group, Modal, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CopyIcon from '@mui/icons-material/ContentCopy';
import { meeting_create, getCookie, person_view, isSuperUser } from '../../../api';
import IconCalendar from "@mui/icons-material/CalendarToday";
import DeleteMeetingModal from '../../../components/modals/DeleteMeetingModal';
import MeetingInformationModal from '../../../components/modals/MeetingInformationModal'; // Import the modal
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

const MeetingCard = (props) => {
  const [isDeleteMeetingModalOpen, setIsDeleteMeetingModalOpen] = useState(false);
  const [isMeetingInfoModalOpen, setIsMeetingInfoModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null); // State for the selected meeting
  const [meetingId, setMeetingId] = useState();
  const navigate = useNavigate();
  const privilege = getCookie("priv");
  const [personMapping, setPersonMapping] = useState({});
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [dupMeetingId, setDupMeetingId] = useState(null);

  useEffect(() => {
    person_view(getCookie("church"))
      .then((response) => {
        const mapping = {};
        response.data.forEach((person) => {
          mapping[person.id] = person.name;
        });
        setPersonMapping(mapping);
      })
      .catch((error) => {
        console.error("Error fetching persons:", error);
      });
  }, []);

  const attendeesNames = (props.meeting.attendees || [])
    .map((id) => personMapping[id] || `Unknown ID: ${id}`)
    .join(", ");

  const viewMeeting = () => {
    navigate(
      "/schedule/meeting",
      {
        state: {
          meeting: props.meeting,
          clearForm: false
        }
      }
    );
  };

  const duplicateMeeting = (event) => {
    event.stopPropagation();
    const meeting = {
      name: props.meeting.name,
      type: props.meeting.type,
      date: props.meeting.date,
      time: props.meeting.time,
      attendees: props.meeting.attendees,
      agenda: props.meeting.agenda,
      notes: props.meeting.notes,
      questions: props.meeting.questions,
      action_steps: props.meeting.action_steps,
      objective: props.meeting.objective,
      meeting_tasks: [],
      created_by: getCookie("user-id"),
      church: getCookie("church")
    };
    meeting_create(meeting)
      .then(() => {
        props.setMustGetMeetings(true);
        console.log(meeting);
        console.log("Meeting duplicated successfully");
      })
      .catch((error) => {
        console.error("Error duplicating meeting:", error.response?.data || error.message);
      });
      setIsDuplicateModalOpen(!isDuplicateModalOpen);
  };

  const toggleDeleteMeetingModal = () => {
    setIsDeleteMeetingModalOpen(!isDeleteMeetingModalOpen);
    props.setMustGetMeetings(true);
  };

  const toggleMeetingInfoModal = () => {
    setSelectedMeeting(props.meeting);
    setIsMeetingInfoModalOpen(!isMeetingInfoModalOpen);
  };

  const toggleDuplicateModal = () => {
    setIsDuplicateModalOpen(!isDuplicateModalOpen);
    props.setMustGetMeetings(true);
  }

  const formatDate = () => {
    const year = props.meeting.date.substring(0, 4);
    const month = Number(props.meeting.date.substring(5, 7));
    let day = props.meeting.date.substring(8);
    if (day[0] === "0") {
      day = day[1];
    }
    const monthStrs = [
      "Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."
    ];
    return monthStrs[month - 1] + " " + day + ", " + year;
  };

  const formatTime = () => {
    let hour = Number(props.meeting.time.substring(0, 2));
    const minute = props.meeting.time.substring(3, 5);
    const isAm = hour < 12;
    const amPm = isAm ? "AM" : "PM";
    hour = hour % 12;
    if (hour === 0) {
      hour = 12;
    }
    return String(hour) + ":" + minute + " " + amPm;
  };

  const deleteMeeting = (event) => {
    event.stopPropagation();
    setMeetingId(props.meeting.id);
    toggleDeleteMeetingModal();
  };

  // Handle the top section click to open the modal
  const handleEventClick = () => {
    setSelectedMeeting(props.meeting); // Set the selected meeting
    toggleMeetingInfoModal(!isDeleteMeetingModalOpen);
  };

  const handleDuplicateMeeting = (event) => {
    event.stopPropagation();
    setDupMeetingId(props.meeting.id);
    toggleDuplicateModal();
  }

  // Get the first 3 people invited, and append '...' if there are more
  const attendeesList = Array.isArray(props.meeting.attendees)
  ? props.meeting.attendees.map((id) => personMapping[id] || `Unknown ID: ${id}`)
  : []; // Default to an empty array if attendees is not an array

  // Get up to the first 3 attendees' names
  const displayedPeople = attendeesList.slice(0, 3); // Take the first 3 people

  // Show '...' if there are more attendees
  const remainingPeople = attendeesList.length > 3 ? "..." : "";

  return (
    <Card
      className="outer-card card-margin"
      style={{
        backgroundColor: "#6776ab",
        borderRadius: "6px",
        width: "450px",
        padding: "20px 20px",
        height: "200px",
        cursor: "pointer",
        position: "relative", // Required for fixed bottom section
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out", // Smooth transition for scaling and shadow
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)"; // Scale up the card on hover
        e.currentTarget.style.boxShadow = "0 10px 15px rgba(0, 0, 0, 0.1)"; // Add shadow on hover
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)"; // Reset scale when mouse leaves
        e.currentTarget.style.boxShadow = "none"; // Reset shadow when mouse leaves
      }}
    >
      <DeleteMeetingModal
        meeting={props.meeting}
        isOpen={isDeleteMeetingModalOpen}
        toggle={toggleDeleteMeetingModal}
      />

      <MeetingInformationModal
        isOpen={isMeetingInfoModalOpen}
        toggle={toggleMeetingInfoModal}
        meeting={selectedMeeting}
      />


      <Card.Section onClick={handleEventClick} style={{ padding: "10px", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        {/* Left: Calendar Icon with Date & Time */}
        <Flex align="center" direction="row" gap="sm">
          <IconCalendar size={32} style={{color:"#e6e6e8"}} />
          <Flex align="center" direction="column" style={{ gap: "3px" }}>
            <Text style={{ fontSize: "12px", color: "#e6e6e8" }}>{formatDate()}</Text>
            <Text style={{ fontSize: "12px", color: "#e6e6e8" }}>{formatTime()}</Text>
          </Flex>
        </Flex>

        {/* Center: Meeting Title */}
        <Title order={3} style={{ color: '#e6e6e8', textAlign: "center", flex: 1 }}>
          {props.meeting.name}
        </Title>

        {/* Right: Icons based on privilege */}
        <Group spacing={0} style={{ gap: "0px" }}>
          {isSuperUser() && (
            <IconButton onClick={() => navigate("/schedule/meeting", { state: { meeting: props.meeting, clearForm: false } })} style={{ color: '#e6e6e8'}}>
              <RemoveRedEyeIcon />
            </IconButton>
          )}
          {!isSuperUser() && (
            <IconButton label="Edit" onClick={() => navigate("/schedule/meeting", { state: { meeting: props.meeting, clearForm: false } })} style={{ color: '#e6e6e8'}}>
              <EditIcon />
            </IconButton>
          )}
          {!isSuperUser() && (
            <IconButton onClick={handleDuplicateMeeting} style={{ color: '#e6e6e8' }}>
              <CopyIcon />
            </IconButton>
          )}
          {!isSuperUser() && (
            <IconButton onClick={deleteMeeting} style={{ color: '#e6e6e8' }}>
              <DeleteIcon />
            </IconButton>
          )}
        </Group>
      </Card.Section>

      {/* Bottom Section (Fixed at the bottom of the card) */}
      <Card.Section
        onClick={handleEventClick}
        style={{
          position: "absolute", // Fix the bottom section
          bottom: 0, // Stick it to the bottom
          left: 15,
          right: 0,
          borderRadius: "6px",
          padding: "10px",
          backgroundColor: "#f2f4fa",
          display: "flex",
          height:'130px',
          flexDirection: "row", // Use row layout for two columns
          justifyContent: "space-between", // Distribute space between the columns
          borderTop: "1px solid #ccc", // Optional: add a border for separation
        }}
      >
        {/* Left Column: Type and Agenda */}
        <div style={{ flex: 1, marginRight: "10px" }}>
          <Text style={{ fontSize: "16px", fontWeight: "bold", color: "#2E2E2E" }}>
            Type: {props.meeting.type || "Not specified"}
          </Text>
          <Text style={{ fontSize: "14px", color: "#2E2E2E", marginTop: "12px" }}>
            Agenda: {props.meeting.agenda || "No agenda provided."}
          </Text>
        </div>

        {/* Right Column: People Invited */}
        <div style={{ flex: 1, textAlign: "right", marginRight: "60px", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          {displayedPeople.map((person, index) => (
            <Text key={index} style={{ fontSize: "14px", color: "#2E2E2E", marginTop: "5px" }}>
              {person}
            </Text>
          ))}
          {remainingPeople && (
            <Text style={{ fontSize: "14px", color: "#2E2E2E", marginTop: "5px" }}>
              {remainingPeople}
            </Text>
          )}
        </div>
        <Modal
          opened={isDuplicateModalOpen}
          onClose={toggleDuplicateModal}
          title="Confirm Duplicate"
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
          size="sm"
          padding="lg"
        >
        <Text size="md" weight={500} style={{ marginBottom: '1rem' }}>
          Are you sure you want to duplicate this meeting?
        </Text>
        <Group position="apart">
          <Button color="red" onClick={duplicateMeeting}>
            Yes
          </Button>
          <Button color="gray" onClick={toggleDuplicateModal}>
            No
          </Button>
        </Group>
        </Modal>
      </Card.Section>
    </Card>
  );
};

export default MeetingCard;