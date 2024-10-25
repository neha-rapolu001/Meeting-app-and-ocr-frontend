import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { meeting_view, getCookie } from '../../../api';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { Global, css } from '@emotion/react';

const DateAndTodoList = () => {
  const [meetings, setMeetings] = useState([]);
  const [allMeetings, setAllMeetings] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        viewAllMeeting();
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const viewAllMeeting = async () => {
    const response = await meeting_view().catch((error) => {
      console.log(error);
    });
    setAllMeetings(response.data);
    const privilege = getCookie("priv");
    if (privilege == 1) {
      let wantedMeetingData = response.data;
      setMeetings(wantedMeetingData);
    } else if (privilege == 2) {
      const church = getCookie("church");
      let wantedMeetingData = [];
      let tempMeetingsData = response.data;
      for (let i = 0; i < tempMeetingsData.length; i++) {
        if (tempMeetingsData[i].church + "" === church) {
          wantedMeetingData.push(tempMeetingsData[i]);
        }
      }
      setMeetings(wantedMeetingData);
    } else if (privilege == 3) {
      const church = getCookie("church");
      const id = getCookie("user-id");
      let wantedMeetingData = [];
      let tempMeetingsData = response.data;
      for (let i = 0; i < tempMeetingsData.length; i++) {
        if (tempMeetingsData[i].created_by + "" === id + "") {
          wantedMeetingData.push(tempMeetingsData[i]);
        }
      }
      setMeetings(wantedMeetingData);
    }

    setIsLoading(false);
  };

  const localizer = momentLocalizer(moment);

  // Map your meeting data to match the expected format for react-big-calendar
  const events = meetings.map((meeting) => ({
    title: meeting.name,
    start: new Date(`${meeting.date}T${meeting.time}`), // Combine date and time
    end: moment(`${meeting.date}T${meeting.time}`).add(meeting.duration, 'hours').toDate(), // Calculate end time
    type: meeting.type, // Include the type property
    // ... other properties
  }));

  return (
    <div>
      <CssBaseline /> {/* Ensures global styles are applied */}
      <Global
        styles={css`
          .rbc-calendar {
            background-color: #fffbe6;
            border: 1px solid #ffd700;
          }
          .rbc-toolbar {
            background-color: #fff5cc;
            color: #000;
            border-bottom: 1px solid #ffd700;
          }
          .rbc-toolbar button {
            background-color: #ffd700;
            color: #000;
          }
          .rbc-month-view,
          .rbc-time-view {
            background-color: #fffbe6;
          }
          .rbc-event {
            background-color: #ffd700;
            color: #000;
            border: 1px solid #ffd700;
          }
          .rbc-day-bg,
          .rbc-time-content {
            background-color: #fffbe6;
          }
          .rbc-time-header {
            background-color: #fff5cc;
            border-bottom: 1px solid #ffd700;
          }
          .rbc-time-content > * + * > * {
            border-left: 1px solid #ffd700;
          }
          .rbc-date-cell {
            color: #000;
          }
          .rbc-header {
            background-color: #fff5cc;
            color: #000;
            border-bottom: 1px solid #ffd700;
          }
          .rbc-today {
            background-color: #fff8e1;
          }
          .rbc-off-range {
            background-color: #fffbe6;
            color: #aaa;
          }
          .rbc-selected {
            background-color: #2e2e2e !important;
            color: #fff !important;
            border: 1px solid #ffd700 !important;
          }
        `}
      />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ height: '450px', width: '100%' }}> {/* Parent container with defined height */}
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ width: 'auto', height: '100%' }}
          />
        </div>
      )}
    </div>
  );
};

export default DateAndTodoList;
