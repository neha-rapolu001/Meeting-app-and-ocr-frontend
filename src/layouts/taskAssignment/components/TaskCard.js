import React, { useState } from "react";
import { Row } from "reactstrap";
import { Container, Title, Card, Text } from "@mantine/core";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';
import EditTaskModal from "../../../components/modals/EditTaskModal";
import DeleteTaskModal from "../../../components/modals/DeleteTaskModal";
import InformationModal from "../../../components/modals/InformationModal";
import { isSuperUser } from "../../../api";

const TaskCard = (props) => {
  const [showIconButtons, setShowIconButtons] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
  const [isInformationModalOpen, setIsInformationModalOpen] = useState(false);
  const [taskId, setTaskId] = useState();

  const toggleEditTaskModal = () => {
    setShowIconButtons(false);
    setIsInformationModalOpen(false);
    setIsEditTaskModalOpen(!isEditTaskModalOpen);
    props.setMustGetTasks(!props.mustGetTasks);
  };

  const toggleDeleteTaskModal = () => {
    setShowIconButtons(false);
    setIsInformationModalOpen(false);
    setIsDeleteTaskModalOpen(!isDeleteTaskModalOpen);
    props.setMustGetTasks(!props.mustGetTasks);
  };

  const toggleInformationModal = () => {
    setTaskId(props.task.task_id);
    setShowIconButtons(false);
    setIsInformationModalOpen(!isInformationModalOpen);
  };

  const onCardClick = () => {
    setTaskId(props.task.task_id);
    toggleInformationModal();
  }

  const onEditClick = (event) => {
    event.stopPropagation();
    console.log(`Editing row ${props.task.task_id}`);
    setTaskId(props.task.task_id);
    toggleEditTaskModal(props.task);
  };

  const onDeleteClick = (event) => {
    event.stopPropagation();
    setTaskId(props.task.task_id);
    toggleDeleteTaskModal();
  };

  return (
    <Card className="outer-card card-margin"  onClick={onCardClick} onMouseEnter={() => setShowIconButtons(true)} onMouseLeave={() => setShowIconButtons(false)} style={{ backgroundColor: '#fffbe6', borderRadius: '10px', height: '100%' }}>
      <InformationModal
        id={taskId}
        edit_task={EditTaskModal}
        task={props.task}
        isOpen={isInformationModalOpen && !isEditTaskModalOpen && !isDeleteTaskModalOpen}
        toggle={toggleInformationModal}
      />
      <EditTaskModal
        id={props.task}
        isOpen={isEditTaskModalOpen}
        toggle={toggleEditTaskModal}
      />
      <DeleteTaskModal
        id={props.task}
        isOpen={isDeleteTaskModalOpen}
        toggle={toggleDeleteTaskModal}
      />
      <Card.Section style={{ overflow: 'auto', backgroundColor: '#ffe658f1' }}>
        <Title>
          <Row>
            <Text style={{ padding: '20px', margin: '5px', color: '#2E2E2E' }}>
              <small>
                {props.task.task_name}
                <IconButton style={{ float: 'right',color:"#2E2E2E" }} size="small" onClick={onDeleteClick}>
                  <DeleteIcon />
                </IconButton>
                <IconButton style={{ float: 'right',color:"#2E2E2E" }} size="small" onClick={onEditClick}>
                  <EditIcon />
                </IconButton>
              </small>
            </Text>
          </Row>
        </Title>
      </Card.Section>
      <Card.Section className="my-card-body" style={{ overflow: 'auto', backgroundColor: '#FFFFE0', flexGrow: 1 }}>
        <Row>
          <Text style={{ padding: '20px', color: '#2E2E2E' }}>
            <small>
              {props.task.end_date}
            </small>
          </Text>
        </Row>
      </Card.Section>
    </Card>
  )
}

export default TaskCard;
