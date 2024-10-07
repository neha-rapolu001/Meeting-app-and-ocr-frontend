import React, {useEffect, useState} from "react";
import {
  Container,
  Card,
  CardTitle,
  CardText,
  Row,
  Col,
  Button
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { meeting_view } from "../../api";
import AppSidebar from "../../components/appSidebar";
import MeetingCard from "./components/MeetingCard";

/**
 * "Schedule" page of application displays meetings.
 */
const Schedule = () => {
  const [meetings, setMeetings] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  /*
   * mustGetMeetings is a boolean useEffect() trigger - useful to
   * have a single trigger for the API call to avoid filling
   * useEffect's dependency array with booleans and complicating
   * its execution conditional.
   */
  const [mustGetMeetings, setMustGetMeetings] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeetings = async () => {
      const response =
        await meeting_view()
        .catch((error) => {
          console.log(error)
        });
      setMeetings(response.data);
      setMustGetMeetings(false);
      setIsLoading(false);
    }

    if (mustGetMeetings) {
      fetchMeetings();
    }
  }, [mustGetMeetings]);


  const newMeeting = () => {
    navigate(
      "/schedule/meeting",
      {
        state: {
          meeting: null,
          clearForm: true
        }
      }
    );
  }

  return (
    <div style={{display: 'flex'}}>
      <AppSidebar />
      <Container className="my-4">
        <Card className="my-card schedule-card">
          <CardTitle tag="h5" className="p-3 card-head">
            <Row>
              <IconButton onClick={newMeeting}>
                <AddCircleOutlineOutlinedIcon />
              </IconButton>
            </Row>
          </CardTitle>
          <CardText className="p-3 schedule-card-body">
            {
              isLoading ?
              <CircularProgress /> :
              <Row>
                {
                  meetings.map(
                    (meeting) => (
                      <Col key={meeting.id} xs={12} md={6} lg={4}>
                        <MeetingCard
                          meeting={meeting}
                          mustGetMeetings={mustGetMeetings}
                          setMustGetMeetings={setMustGetMeetings}
                        />
                      </Col>
                    )
                  )
                }
              </Row>
            }
          </CardText>
        </Card>
      </Container>
    </div>
  );
};

export default Schedule;

