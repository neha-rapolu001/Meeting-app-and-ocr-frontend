import React, { useEffect, useState } from "react";
import {
  Container,
  Card
} from 'reactstrap';
import ReactDOM from 'react-dom';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import AppSidebar from "../../components/appSidebar";
import { tasks_view } from "../../api";



const TaskCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mustGetTasks, setMustGetTasks] = useState(true);

  useEffect(() => {
      if (mustGetTasks) {
          tasks_view()
              .then((req) => {
                  const task = req.data.results;
                  setTasks(task);
                  console.log(task);
                  setIsLoading(false);
                  setMustGetTasks(false);
              })
              .catch((error) => {
                  console.log(error);
              });
      }
  }, [mustGetTasks]);


const tileContent = ({ date, view }) => {
        const tasksForDate = getTasksForDate(date, tasks);
        const isSelectedDate = date.toDateString() === selectedDate.toDateString();
        if (tasksForDate.length > 0) {
            return (
              <div style={{
                width: '80%',
                height: '80%',
                // border: '1px solid rgba(169, 169, 169, 0.5)',
                padding: '10px',
                position: 'relative',
              }}>
                {tasksForDate.map((task, index) => (
                  <div key={index}>
                    <span style={{
                      backgroundColor: 'rgba(169, 300, 169, 0.3)',
                      borderRadius: '5px',
                      padding: '5px',
                    }}>
                      {task.task_name}
                    </span>
                  </div>
                ))}
              </div>
          );
        }
      };

      

  const handleDateClick = (date) => {
      setSelectedDate(date);
  };

  const getTasksForDate = (date, tasks) => {
      return tasks.filter((task) => {
        return date.toISOString().split('T')[0] === task.end_date;
      });
  };

  const selectedTasks = getTasksForDate(selectedDate, tasks);

  return (
      <div style={{display: "flex"}}>
        <AppSidebar />
        <Container className="my-4">
          <Card className="my-card schedule-card">
            <div className="full-screen-calendar">
            <h1 style={{ textAlign: 'left', paddingLeft: '380px' }}>Task Calendar</h1>
                <div className="calendar-wrapper">
                    <Calendar
                        value={selectedDate}
                        className="custom-calendar"
                        onClickDay={handleDateClick}
                        tileContent={tileContent}
                    />
                    {selectedDate && (
                        <div>
                        <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '20px 0' }}></hr>
                        <div style={{ backgroundColor: '#A9C8A94D', padding: '20px', borderRadius: '8px' }}>
                        {/* <h4 style={{ fontSize: '22px' }}><b>Tasks for {selectedDate.toISOString().split('T')[0]}</b></h4> */}
                        <h4> Tasks for {selectedDate.toISOString().split('T')[0]}</h4>
                        <table style={{ borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid black' }}>
                                    <th style={{ borderBottom: '1px solid black', padding: '8px' }}>Task Name</th>
                                    <th style={{ borderBottom: '1px solid black', padding: '8px' }}>Employee Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedTasks.map((task, index) => (
                                    <tr key={index}>
                                        <td style={{ padding: '8px' }}>{task.task_name}</td>
                                        <td style={{ padding: '8px' }}>{task.employee_name}</td>
                                    </tr>
                                    
                                ))}
                            </tbody>
                        </table>
                    </div> 
                    </div>
                    )}
                </div>
            </div>
          </Card>
        </Container>
      </div>
  );
};

export default TaskCalendar;
