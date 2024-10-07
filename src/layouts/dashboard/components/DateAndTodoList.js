// This is the original code of rishank:

// import React, { useState } from 'react';
// import CircularProgress from '@mui/material/CircularProgress';
//
// const DateAndTodoList = (props) => {
//   const [todos, setTodos] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//
//   const meetingArray = props.data;
//
//   const handleAddTodo = (e) => {
//     console.log(meetingArray[0].name);
//   };
//
//   const handleDeleteTodo = (index) => {
//     // console.log(meetingArray);
//   };
//
//
//
//   const date = new Date();
//   const month = date.toLocaleString('default', { month: 'long' });
//   const day = date.getDate();
//   const year = date.getFullYear();
//
//   return (
//     <div className="date-and-todo-list">
//       <div className="date">
//         <h1>{month}</h1>
//         <h2>{day}</h2>
//         <h3>{year}</h3>
//       </div>
//       <div className="todo-list">
//         <h4 onClick={handleAddTodo}>Upcoming Meeting</h4>
//           <p>
//             {/* {meetingArray[0].name} */}
//             Meeting 1
//         </p>
//       </div>
//     </div>
//   );
// };
//
// export default DateAndTodoList;


// // NEW CODE : Written by- aravind This is working as expected but here it is upcoming meetings is not visible as a button:
//
// import CircularProgress from '@mui/material/CircularProgress';
// import React, { useState, useEffect } from 'react';
// import Dialog from '@mui/material/Dialog';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import { meeting_view } from "../../../api";
//
// const DateAndTodoList = () => {
//   const [meetings, setMeetings] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize with the current date
//   const [currentMeetingsCount, setCurrentMeetingsCount] = useState(0); // State for the current meetings count
//
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await meeting_view();
//         setMeetings(response.data);
//         setIsLoading(false);
//
//         const currentMeetings = getMeetingsForDate(new Date(), response.data);
//         setCurrentMeetingsCount(currentMeetings.length);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//
//     fetchData();
//   }, []);
//
//
// useEffect(() => {
//     const fetchMeetings = async () => {
//       try {
//         const response = await meeting_view();
//         setMeetings(response.data);
//         setIsLoading(false);
//
//         // Calculate and set the current meetings count
//         const currentMeetings = getMeetingsForDate(new Date(), response.data);
//         setCurrentMeetingsCount(currentMeetings.length);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchMeetings();
//   }, []);
//
//
//   const handleOpenCalendar = () => {
//     setIsCalendarOpen(true);
//   };
//
//   const handleCloseCalendar = () => {
//     setIsCalendarOpen(false);
//   };
//
//   const handleDateClick = (date) => {
//     setSelectedDate(date);
//   };
//
//
//   const getMeetingsForDate = (date, meetings) => {
//     // Filter the meetings array to get meetings for the specified date
//     return meetings.filter((meeting) => {
//       // Compare dates as strings in "YYYY-MM-DD" format
//       return date && date.toISOString().split('T')[0] === meeting.date;
//     });
//   };
//
//   // Usage in your component:
//   const currentMeetings = getMeetingsForDate(new Date(), meetings);
//   const selectedMeetings = getMeetingsForDate(selectedDate, meetings);
//
//   const date = new Date();
//   const month = date.toLocaleString('default', { month: 'long' });
//   const day = date.getDate();
//   const year = date.getFullYear();
//
//   return (
//       <div className="date-and-todo-list">
//         <div className="date">
//           <h1>{month}</h1>
//           <h2>{day}</h2>
//           <h3>{year}</h3>
//         </div>
//         <div className="todo-list">
//           <button onClick={handleOpenCalendar}>Upcoming Meetings</button>
//           <p>Number of Meetings: {currentMeetings.length}</p>
//         </div>
//         <Dialog open={isCalendarOpen} onClose={handleCloseCalendar}>
//           <Calendar value={selectedDate} onClickDay={handleDateClick} />
//           {selectedDate && (
//               <div>
//                 <h4>Meetings for {selectedDate.toISOString().split('T')[0]}</h4>
//                 <ul>
//                   {selectedMeetings.map((meeting, index) => (
//                       <li key={index}>
//                         {meeting.name} - {meeting.time}
//                       </li>
//                   ))}
//                 </ul>
//               </div>
//           )}
//         </Dialog>
//       </div>
//   );
// };
// export default DateAndTodoList;
//
//



// import CircularProgress from '@mui/material/CircularProgress';
// import React, { useState, useEffect } from 'react';
// import Dialog from '@mui/material/Dialog';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import { meeting_view } from "../../../api";

// const DateAndTodoList = () => {
//   const [meetings, setMeetings] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize with the current date
//   const [currentMeetingsCount, setCurrentMeetingsCount] = useState(0); // State for the current meetings count

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await meeting_view();
//         setMeetings(response.data);
//         setIsLoading(false);

//         const currentMeetings = getMeetingsForDate(new Date(), response.data);
//         setCurrentMeetingsCount(currentMeetings.length);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleOpenCalendar = () => {
//     setIsCalendarOpen(true);
//   };

//   const handleCloseCalendar = () => {
//     setIsCalendarOpen(false);
//   };

//   const handleDateClick = (date) => {
//     setSelectedDate(date);
//   };

//   const getMeetingsForDate = (date, meetings) => {
//     return meetings.filter((meeting) => {
//       return date && date.toISOString().split('T')[0] === meeting.date;
//     });
//   };

//   const selectedMeetings = getMeetingsForDate(selectedDate, meetings);

//   const date = new Date();
//   const month = date.toLocaleString('default', { month: 'long' });
//   const day = date.getDate();
//   const year = date.getFullYear();

//   return (
//       <div className="date-and-todo-list">
//         <div className="date">
//           <h1>{month}</h1>
//           <h2>{day}</h2>
//           <h3>{year}</h3>
//         </div>
//         <div className="todo-list">
//           <button onClick={handleOpenCalendar}>Upcoming Meetings</button>
//           <p>Number of Meetings: {currentMeetingsCount}</p>
//         </div>
//         <Dialog open={isCalendarOpen} onClose={handleCloseCalendar}>
//           <Calendar value={selectedDate} onClickDay={handleDateClick} />
//           {selectedDate && (
//               <div>
//                 <h4>Meetings for {selectedDate.toISOString().split('T')[0]}</h4>
//                 <ul>
//                   {selectedMeetings.map((meeting, index) => (
//                       <li key={index}>
//                         {meeting.name} - {meeting.time}
//                       </li>
//                   ))}
//                 </ul>
//               </div>
//           )}
//         </Dialog>
//       </div>
//   );
// };

// export default DateAndTodoList;



// New Calendar Code Like Zoho

// import React, { useEffect, useState } from 'react';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import moment from 'moment';
// import { meeting_view } from '../../../api'; 

// const DateAndTodoList = () => {
//   const [meetings, setMeetings] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await meeting_view();
//         console.log("Meetings: ", response.data);
//         setMeetings(response.data);
//         setIsLoading(false);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const localizer = momentLocalizer(moment);

//   return (
//     <div>
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <Calendar
//           localizer={localizer}
//           events={meetings}
//           startAccessor="start"
//           endAccessor="end"
//           style={{ height: 500 }}
//         />
//       )}
//     </div>
//   );
// };

// export default DateAndTodoList;

import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { meeting_view } from '../../../api';

const DateAndTodoList = () => {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await meeting_view();
        setMeetings(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      )}
    </div>
  );
};

export default DateAndTodoList;

