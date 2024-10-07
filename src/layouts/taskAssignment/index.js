/**
 * This component is the task page of the application.
 * @params: {props}
 */
import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardTitle,
  CardText,
  Nav,
  NavLink,
  CardBody,
  Row,
  Col,
} from "reactstrap";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
// import { PieChart, pieChartDefaultProps } from "react-minimal-pie-chart";
import { Button } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
// import DataTable from "./components/DataTable";
import { useNavigate } from "react-router-dom";
import { logout, task_view } from "../../api";
import { tasks_view } from "../../api";
import CreateTaskModal from "../../components/modals/CreateTaskModal";
// import DateAndTodoList from "./components/DateAndTodoList";
import Switch from "@mui/material/Switch";
import AppSidebar from "../../components/appSidebar";
import TaskCard from "./components/TaskCard";

const Task = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const[isCompleted, setIsCompleted] = useState(true);
  const [mustGetTasks, setMustGetTasks] = useState(true);

  const toggleCreateTaskModal = () => {
    setIsCreateTaskModalOpen(!isCreateTaskModalOpen);
    setMustGetTasks(!mustGetTasks);
  };

  const defaultLabelStyle = {
    fontSize: "5px",
    fontFamily: "sans-serif",
  };

//   useEffect (() => {
//     const fetchTasks = async () => {
//       const response =
//         await tasks_view()
//         .catch((error) => {
//           console.log(error);
//         });
//       setTasks(response.data);
//       console.log(response.data)
//       setIsLoading(false);
//     }

//     if (mustGetTasks) {
//       fetchTasks();
//   }
// }, [mustGetTasks]);

useEffect(() => {
  if(mustGetTasks){
    viewAllTasks();
  }
}, [mustGetTasks]);

const viewAllTasks = () => {
  tasks_view()
    .then((req) => {
      const task = req.data.results;
      setTasks(task);
        //console.log(req);
      setIsLoading(false);
    })
    .catch((error) => {
      console.log(error);
    });

};

console.log(tasks);

return (
  <div style={{display: 'flex'}}>
    <AppSidebar />
    <Container className="my-4">
      <Card className="my-card schedule-card">
        <CardTitle tag="h5" className="p-3 card-head">
          <Row>
            <IconButton onClick={toggleCreateTaskModal}>
              <AddCircleOutlineOutlinedIcon />
            </IconButton>
            <CreateTaskModal
            isOpen={isCreateTaskModalOpen}
            toggle={toggleCreateTaskModal}
            />
          </Row>
        </CardTitle>
        <CardText className="p-3 schedule-card-body">
          {
            isLoading ?
            <CircularProgress /> :
            <Row>
              {
                tasks.map(
                  (task) => (
                    <Col key = {task.id} xs={12} md={6} lg={4} >
                      <TaskCard task = {task} setMustGetTasks= {setMustGetTasks} mustGetTasks={mustGetTasks} />
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

export default Task;
