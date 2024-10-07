/**
 * This component is contains the task table in the application. It contains a table for task.
 * 
 * @params: {props}
 * 
 * 
 */

import React, { useEffect, useState } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import moment from 'moment';
import EditTaskModal from "../../../components/modals/EditTaskModal";
import DeleteTaskModal from "../../../components/modals/DeleteTaskModal";
import InformationModal from "../../../components/modals/InformationModal";


export default function TaskTable(props) {
  //   const getRowId = (row) => row.task_id;
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
  const [isInformationModalOpen, setIsInformationModalOpen] = useState(false);
  const [taskId, setTaskId] = useState();
  const [taskDetails, setTaskDetails] = useState();
  const res = props.rows;
  const toDashboard = props.dashboard;
  const isComplete = props.isCompleted;
  const columns = [
    //   { field: "id", headerName: "ID", width: 70 },
      { field: "Tasks", headerName: "Tasks", width: toDashboard ? 100 : 210 },
    //   { field: "Priority", headerName: "Priority", width: 150 },
      { field: "firstName", headerName: "First name", width: toDashboard ? 100 : 170 },
      { field: "lastName", headerName: "Last name", width: toDashboard ? 100 : 170 },
      { field: "start_date", headerName: "Start Date", width: toDashboard ? 100 : 160, valueFormatter: params => moment(params?.value).format("MM/DD/YYYY"), },
      { field: "end_date", headerName: "End Date", width: toDashboard ? 100 : 160, valueFormatter: params => moment(params?.value).format("MM/DD/YYYY"), },
      { field: "priority", headerName: "Priority", width: toDashboard ? 80 : 140 },
      {
        field: 'actions',
        headerName: 'Actions',
        sortable: false,
        width: 120,
        disableClickEventBubbling: true,
        renderCell: (params) => {
          const onClick = () => {
            // console.log(`Editing row ${params.id}`);
             const taskId = params.id; 
            const originalRowData = res.find(row => row.task_id === taskId);
            setTaskId(originalRowData);
            toggleDeleteTaskModal();
          };

          const onInfoIcon = () => {
            // console.log(`Editing row ${params.id}`);
            const taskId = params.id; 
            const originalRowData = res.find(row => row.task_id === taskId);
            setTaskDetails(originalRowData);
            setTaskId(taskId);
            toggleInformationModal();
          };

          const onEditToggle = () => {
            // console.log(`Editing row ${params.id}`);
            const taskId = params.id; 
            const originalRowData = res.find(row => row.task_id === taskId);
            setTaskId(originalRowData);
            toggleEditTaskModal();
          };
        //   return null;
          return (
            // <GridActionsCellItem>\
            <div>
              <IconButton onClick={onInfoIcon}>
                <InfoIcon />
              </IconButton>
              <IconButton onClick={onEditToggle}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={onClick}>
                <DeleteIcon />
              </IconButton>
              </div>
            // </GridActionsCellItem>
          );
        },
      },
    ];
    
//   console.log(res);
  const toggleEditTaskModal = () => {
    setIsEditTaskModalOpen(!isEditTaskModalOpen);
  };

  const toggleDeleteTaskModal = () => {
    setIsDeleteTaskModalOpen(!isDeleteTaskModalOpen);
  };

  const toggleInformationModal = () => {
    setIsInformationModalOpen(!isInformationModalOpen);
  };

  const temp = res.map((data) => {
    const fullName = data.employee_name;
    
    let firstName, lastName;
    if (fullName.includes(" ")) {
    //   console.log(fullName);
      [firstName, lastName] = fullName.split(" ");
    } else {
      firstName = fullName;
      lastName = "LNU";
    }
    console.log("Task Table: " + isComplete);
    
    return {
      id: data.task_id, // unique id property for each row
      priority: data.priority,
      Tasks: data.task_name,
      firstName: firstName,
      lastName: lastName,
      start_date: data.start_date,
      end_date: data.end_date,
      status: "Finished",
      isDelete: data.is_delete,
      isCompleted: data.is_completed,
      action:<i class="fa fa-pencil" aria-hidden="true"></i>,
    };
  });

  var newArray = temp.filter(function (el) {
    
    if (toDashboard) {
        return el.priority === "high" && el.isDelete === false;
      } else {
        if(!isComplete){
            return el.isCompleted === true && el.isDelete === false;
        } else {
            return el.isCompleted === false && el.isDelete === false;
        }
      }
    });
//   console.log(temp.id);
  return (
    <div style={{ height: toDashboard ? "100%" : 400, width: "100%" }}>
        {isEditTaskModalOpen ? <EditTaskModal isOpen={isEditTaskModalOpen} toggle={toggleEditTaskModal} id={taskId}/> : <></>}
        {isDeleteTaskModalOpen ? <DeleteTaskModal isOpen={isDeleteTaskModalOpen} toggle={toggleDeleteTaskModal} id={taskId}/> : <></>}
        {isInformationModalOpen ? <InformationModal isOpen={isInformationModalOpen} toggle={toggleInformationModal} id={taskId}  edit_task={EditTaskModal} task={taskDetails}/> : <></>}
      <DataGrid
        rows={newArray}
        getRowId={newArray.task_id}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
}