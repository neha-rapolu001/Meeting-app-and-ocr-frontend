import React from "react";
import { Button, Modal, Text, Group } from "@mantine/core";

const InformationModal = ({ isOpen, toggle, task }) => {
  return (
    <Modal
      opened={isOpen}
      onClose={toggle}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      title={<strong>{task?.task_name}</strong>}
      size="lg"
      padding="lg"
    >
      <Text size="md" weight={500} style={{ marginBottom: '1rem' }}>
        <strong>Task Description:</strong> {task?.task_description}
      </Text>
      <Text size="md" weight={500} style={{ marginBottom: '1rem' }}>
        <strong>Start Date:</strong> {task?.start_date}
      </Text>
      <Text size="md" weight={500} style={{ marginBottom: '1rem' }}>
        <strong>End Date:</strong> {task?.end_date}
      </Text>
      <Text size="md" weight={500} style={{ marginBottom: '1rem' }}>
        <strong>Task Status:</strong> {task?.is_completed ? <span>Completed</span> : <span>Pending</span>}
      </Text>

      <Group position="right">
        <Button color="blue" onClick={toggle}>
          Close
        </Button>
      </Group>
    </Modal>
  );
};

export default InformationModal;
