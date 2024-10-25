import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import moment from 'moment';
import EditTaskModal from "../../../components/modals/EditTaskModal";
import DeleteTaskModal from "../../../components/modals/DeleteTaskModal";
import InformationModal from "../../../components/modals/InformationModal";
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Define your custom theme
const customTheme = createTheme({
  palette: {
    primary: {
      main: "#FFD700", // Golden yellow
    },
    secondary: {
      main: "#FFA500", // Orange
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "1px solid #FFD700", // Border color of the DataGrid
          backgroundColor: "#FFFBE6", // Light yellow background for the entire grid
        },
        columnHeaders: {
          backgroundColor: "#FFF5CC", // Light yellow background for column headers
          color: "#000", // Black text color
          borderBottom: "1px solid #FFD700", // Border color for column headers
        },
        row: {
          '&.Mui-selected': {
            backgroundColor: "#FFF8E1", // Very light yellow for selected rows
          },
        },
        cell: {
          borderBottom: "1px solid #FFD700", // Border color for cells
          backgroundColor: "#FFFFE0", // Light yellow background for cells
        },
        footerContainer: {
          backgroundColor: "#FFF5CC", // Light yellow background for footer
          borderTop: "1px solid #FFD700", // Border color for footer
        },
        virtualScrollerContent: {
          backgroundColor: "#FFFBE6", // Light yellow background for the main content area
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#FFD700", // Color of the IconButton
        },
      },
    },
  },
});


export default function TaskTable(props) {
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
  const [isInformationModalOpen, setIsInformationModalOpen] = useState(false);
  const [taskId, setTaskId] = useState();
  const [taskDetails, setTaskDetails] = useState();
  const res = props.rows;
  const toDashboard = props.dashboard;
  const isComplete = props.isCompleted;

  const columns = [
    { field: "Tasks", headerName: "Tasks", width: toDashboard ? 100 : 210 },
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
          const taskId = params.id; 
          const originalRowData = res.find(row => row.task_id === taskId);
          setTaskId(originalRowData);
          toggleDeleteTaskModal();
        };

        const onInfoIcon = () => {
          const taskId = params.id; 
          const originalRowData = res.find(row => row.task_id === taskId);
          setTaskDetails(originalRowData);
          setTaskId(taskId);
          toggleInformationModal();
        };

        const onEditToggle = () => {
          const taskId = params.id; 
          const originalRowData = res.find(row => row.task_id === taskId);
          setTaskId(originalRowData);
          toggleEditTaskModal();
        };

        return (
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
        );
      },
    },
  ];

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
      [firstName, lastName] = fullName.split(" ");
    } else {
      firstName = fullName;
      lastName = "LNU";
    }

    return {
      id: data.task_id,
      priority: data.priority,
      Tasks: data.task_name,
      firstName: firstName,
      lastName: lastName,
      start_date: data.start_date,
      end_date: data.end_date,
      status: "Finished",
      isDelete: data.is_delete,
      isCompleted: data.is_completed,
      action: <i class="fa fa-pencil" aria-hidden="true"></i>,
    };
  });

  const newArray = temp.filter((el) => {
    if (toDashboard) {
      return el.priority === "high" && el.isDelete === false;
    } else {
      if (!isComplete) {
        return el.isCompleted === true && el.isDelete === false;
      } else {
        return el.isCompleted === false && el.isDelete === false;
      }
    }
  });

  return (
    <ThemeProvider theme={customTheme}>
      <div style={{ height: toDashboard ? "100%" : 400, width: "100%" ,backgroundColor: "#FFFBE6"}}>
        {isEditTaskModalOpen && <EditTaskModal isOpen={isEditTaskModalOpen} toggle={toggleEditTaskModal} id={taskId} />}
        {isDeleteTaskModalOpen && <DeleteTaskModal isOpen={isDeleteTaskModalOpen} toggle={toggleDeleteTaskModal} id={taskId} />}
        {isInformationModalOpen && <InformationModal isOpen={isInformationModalOpen} toggle={toggleInformationModal} id={taskId} edit_task={EditTaskModal} task={taskDetails} />}
        <DataGrid
          rows={newArray}
          getRowId={(row) => row.id}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      </div>
    </ThemeProvider>
  );
}
