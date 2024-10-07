/**
 * This files contains all the routes of the application.
 *
 * @params: {props}
 *
 *
 */

import './App.css';
import { BrowserRouter as Router, Routes, Route, Redirect } from 'react-router-dom';
import Dashboard from "./layouts/dashboard";
import TaskAssignment from "./layouts/taskAssignment";
import Schedule from "./layouts/schedule";
import Meeting from "./layouts/schedule/meeting";
import Login from "./layouts/authentication/login";
import Signup from "./layouts/authentication/signup/index"
import ForgotPassword from './layouts/authentication/forgotPassword/index';
import TaskCalendar from "./layouts/taskCalendar";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/forgot-password" element={<ForgotPassword />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/schedule" element={<Schedule />} />
        <Route exact path="/schedule/meeting" element={<Meeting />} />
        <Route exact path="/tasks" element={<TaskAssignment />} />
        <Route exact path="/task-calendar" element={<TaskCalendar />} />
      </Routes>
    </Router>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Welcome to Scheduler App
    //     </p>
    //     <a
    //       className="App-link"
    //       href="http://localhost:3001"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Scheduler App
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;

