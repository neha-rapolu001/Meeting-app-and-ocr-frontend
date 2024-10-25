/**
 * This component is the task page of the application.
 * @params: {props}
 */
import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
} from "reactstrap";
import { Container, Title, Card, Button, NavLink, Text } from "@mantine/core";
import Dropdown from 'react-dropdown';
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
// import { PieChart, pieChartDefaultProps } from "react-minimal-pie-chart";
import "bootstrap/dist/css/bootstrap.min.css";
// import DataTable from "./components/DataTable";
import { useNavigate } from "react-router-dom";
import { isSuperUser, logout, task_view } from "../../api";
import { tasks_view ,  getCookie, get_church_data} from "../../api";
import CreateTaskModal from "../../components/modals/CreateTaskModal";
// import DateAndTodoList from "./components/DateAndTodoList";
import Switch from "@mui/material/Switch";
import AppSidebar from "../../components/appSidebar";
import TaskCard from "./components/TaskCard";

const Task = () => {
  const navigate = useNavigate();
  const [AllTasks, setAllTasks] = useState("");
  const [tasks, setTasks] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const[isCompleted, setIsCompleted] = useState(true);
  const [mustGetTasks, setMustGetTasks] = useState(true);
  const [churchDropdownOptions,setChurchDropdownOptions] = useState(['other']);
  const [selectedChurchDropdownOption,setSelectedChurchDropdownOption] = useState();

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
  fetchChurchDropdownData();
}, [mustGetTasks]);

// const viewAllTasks = () => {
//   tasks_view()
//     .then((req) => {
//       const task = req.data.results;
//       setTasks(task);

      
        
//       setIsLoading(false);
//     })
//     .catch((error) => {
//       console.log(error);
//     });

// };


const viewAllTasks = async () => {
  const response =
    await tasks_view()
    .catch((error) => {
      console.log(error)
    });
    console.log(response.data.results);
    setAllTasks(response.data.results);
    setIsLoading(false);
  const privilege=getCookie("priv");
  if(privilege ==1){
   
    let church=selectedChurchDropdownOption;
    let wantedTaskData=[];
    let tempTasksData=response.data.results;
    for (let i = 0; i < tempTasksData.length; i++) {
      console.log(tempTasksData[i].church,church);
      if (tempTasksData[i].church+"" === church) {
        wantedTaskData.push(tempTasksData[i]);
      }
  } 
  setTasks(wantedTaskData)
    
// }
  } else if(privilege ==2){
    const church =getCookie("church");
    let wantedTaskData=[];
    let tempTasksData=response.data.results;
    for (let i = 0; i < tempTasksData.length; i++) {
      if (tempTasksData[i].church+"" === church) {
        wantedTaskData.push(tempTasksData[i]);
      }
  } 
  setTasks(wantedTaskData)
  }else if(privilege ==3){
    const church =getCookie("church");
    const id =getCookie("user-id");
    let wantedTaskData=[];
    let tempTasksData=response.data.results;
    for (let i = 0; i < tempTasksData.length; i++) {
      if (tempTasksData[i].created_by+"" === id+"") {
        wantedTaskData.push(tempTasksData[i]);
      }
  } 
  setTasks(wantedTaskData)
  }
}


const fetchChurchDropdownData=()=>{

  get_church_data()
          .then((req) => {
              const churchData = req.data;
              
              
              let tempDropdownData=[];
              churchData.forEach(x => {
                tempDropdownData.push({
                  "id":x.id,
                  "name":x.name
                })
                });
              setChurchDropdownOptions(tempDropdownData);
              
          })
          .catch((error) => {
              console.log(error);
          });
}
const OnChurchDropdownOptionChange=(selectedIndex)=>{
  let wantedTaskData=[];
    for (let i = 0; i < AllTasks.length; i++) {
      console.log(AllTasks[i].church,selectedIndex);
      if (AllTasks[i].church+"" === selectedIndex+"") {
          wantedTaskData.push(AllTasks[i]);
      }
  } 
  setTasks(wantedTaskData)
}

return (
  <div style={{display: 'flex'}}>
    <AppSidebar />
    <div style={{position: "relative", left: "15%",width:"100%",height:"94vh"}} className="my-3">
      <Card className="my-card  my-card-height schedule-card" style={{width:"80%"}}>
        <Title order={5} className="p-3 card-head" style={{ display: "flex", justifyContent: "space-between" }}>
        {getCookie("priv")==="1" &&<Dropdown
                className="custom-dropdown" 
                  options={churchDropdownOptions.map((x)=>x.name)} 
                  onChange={
                    (selectedValue) => {
                      const selectedIndex = churchDropdownOptions.findIndex(option => option.name === selectedValue.value);
                      setSelectedChurchDropdownOption(churchDropdownOptions[selectedIndex].id);
                      OnChurchDropdownOptionChange(churchDropdownOptions[selectedIndex].id);

                    }}
                   placeholder="Select an church" 
                   
                   />}
          <Row>
            {!isSuperUser() && <IconButton onClick={toggleCreateTaskModal}>
              <AddCircleOutlineOutlinedIcon />
            </IconButton>}
            <CreateTaskModal
            isOpen={isCreateTaskModalOpen}
            toggle={toggleCreateTaskModal}
            />
          </Row>
          <div></div>
        </Title>
        <Text className="p-3 schedule-card-body">
          {
            isLoading ?
            <CircularProgress /> :
            <Row>
              {
                tasks.map(
                  (task) => (
                    <Col key = {task.id} xs={12} md={6} lg={4} style={{paddingBottom:"10px"}} >
                      <TaskCard task = {task} setMustGetTasks= {setMustGetTasks} mustGetTasks={mustGetTasks} />
                    </Col>
                  )
                )
              }
            </Row>
          }
        </Text>
      </Card>
    </div>
  </div>
);
};

export default Task;
