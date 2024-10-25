import React, { useEffect, useState, useRef } from "react";
import { CardText, Row, Col } from "reactstrap";
import { Container, Card, Title, Button, NavLink, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { meeting_create } from '../../../api';
import DeleteMeetingModal from '../../../components/modals/DeleteMeetingModal';

const MeetingCard = (props) => {
  const [isMeetingMenuOpen, setIsMeetingMenuOpen] = useState(false);
  const [isDeleteMeetingModalOpen, setIsDeleteMeetingModalOpen] = useState(false);

  const anchorRef = useRef(null);
  const navigate = useNavigate();

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
  }

  const duplicateMeeting = () => {
    const meeting = {
      name: props.meeting.name,
      type: props.meeting.type,
      date: props.meeting.date,
      time: props.meeting.time,
      attendees: props.meeting.attendees,
      agenda: props.meeting.agenda,
      notes: props.meeting.notes,
      meeting_tasks: props.meeting.meeting_tasks
    };

    meeting_create(meeting)
      .then(() => {
        props.setMustGetMeetings(true);
      })
      .catch((error) => {
        console.error("Error creating meeting:", error);
      });
  }

  const toggleDeleteMeetingModal = () => {
    setIsDeleteMeetingModalOpen(!isDeleteMeetingModalOpen);
    props.setMustGetMeetings(true);
  }

  const toggleMeetingMenu = () => {
    setIsMeetingMenuOpen(!isMeetingMenuOpen);
  }

  const handleMeetingMenuClose = (e) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(e.target)
    ) {
      return;
    }

    setIsMeetingMenuOpen(false);
  };

  const formatDate = () => {
    const year = props.meeting.date.substring(0, 4);
    const month = Number(props.meeting.date.substring(5, 7));
    let day = props.meeting.date.substring(8);

    if (day[0] === "0") {
      day = day[1];
    }

    const monthStrs = [
      "Jan.",
      "Feb.",
      "Mar.",
      "Apr.",
      "May",
      "June",
      "July",
      "Aug.",
      "Sep.",
      "Oct.",
      "Nov.",
      "Dec."
    ];

    return monthStrs[month - 1] + " " + day + ", " + year;
  }

  const formatTime = () => {
    let hour = Number(props.meeting.time.substring(0, 2));
    const minute = (props.meeting.time.substring(3, 5));

    const isAm = hour < 12;
    const amPm = isAm ? "AM" : "PM";

    hour = hour % 12;

    if (hour === 0) {
      hour = 12;
    }

    return String(hour) + ":" + minute + " " + amPm;
  }

  return (
    <Card className="outer-card card-margin" onClick={toggleMeetingMenu} style={{ backgroundColor: '#fffbe6',  borderRadius: '10px', height:"100%"}}>
      <DeleteMeetingModal
        meeting={props.meeting}
        isOpen={isDeleteMeetingModalOpen}
        toggle={toggleDeleteMeetingModal}
      />
      <div>
        <div ref={anchorRef} />
        <div >
          <Card className="outer-card meeting-card card-body d-flex flex-column" style={{ backgroundColor: '#fffbe6', borderRadius: '10px' }}>
            <Card.Section style={{ overflow: "auto" , backgroundColor:"#ffe658f1"}}>
              <Title>
                <Row>
                  <Col>
                    <Text style={{ padding: "20px", margin: "5px", color: '#2E2E2E' }}>
                      <small>
                        {formatDate()}
                        <br />
                        {formatTime()}
                      </small>
                    </Text>
                  </Col>
                  <Col>
                    <Text style={{ padding: "20px", color: '#2E2E2E' }}>
                      {props.meeting.name}
                    </Text>
                  </Col>
                </Row>
              </Title>
            </Card.Section>
            <Card.Section className="my-card-body flex-grow-1 d-flex flex-column justify-content-between" style={{ overflow: "auto", backgroundColor: '#FFFFE0',flexGrow:1}}>
              <div>
                <Popper
                  open={isMeetingMenuOpen}
                  anchorEl={anchorRef.current}
                  placement="bottom"
                  transition
                  disablePortal
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                    >
                      <Paper style={{ backgroundColor: '#FFF5CC', border: '1px solid #FFD700' }}>
                        <ClickAwayListener onClickAway={handleMeetingMenuClose}>
                          <Container>
                            <MenuList>
                              <MenuItem onClick={viewMeeting} style={{ color: '#2E2E2E' }}>View/Edit</MenuItem>
                              <MenuItem onClick={duplicateMeeting} style={{ color: '#2E2E2E' }}>Duplicate</MenuItem>
                              <MenuItem onClick={toggleDeleteMeetingModal} style={{ color: '#2E2E2E' }}>Delete</MenuItem>
                            </MenuList>
                          </Container>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </div>
              <Row>
                <Col>
                  <Text style={{ padding: "20px", color: '#2E2E2E' }}>
                    <small>
                      {props.meeting.agenda}
                    </small>
                  </Text>
                </Col>
                <Col>
                  <Text style={{ padding: "20px", color: '#2E2E2E' }}>
                    <small>
                      Invited: {props.meeting.attendees.length}
                    </small>
                  </Text>
                </Col>
              </Row>
            </Card.Section>
          </Card>
        </div>
      </div>
    </Card>
  )
}

export default MeetingCard;
