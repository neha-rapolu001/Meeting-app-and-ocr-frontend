import React, { useState, useEffect } from "react";
import {
  Modal,
  TextInput,
  Button,
  Select,
  Switch,
  Text,
  Group,
  MultiSelect
} from "@mantine/core";
import { tasks_update, task_view, getCookie, person_view } from "../../api";
import AddPersonModal from "./AddPersonModal";

const TaskInformationAndEditModal = ({ isOpen, toggle, id, task }) => {
  const [formData, setFormData] = useState({
    task_name: "",
    task_description: "",
    employees: [],
    start_date: "",
    end_date: "",
    priority: "",
    is_completed: false,
    task_id: "",
    created_by: "",
    church: "",
    is_delete: false,
    meetings: "",
  });

  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [people, setPeople] = useState([]); // List of persons for MultiSelect
  const [addPersonModalOpen, setAddPersonModalOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsEditMode(false);
      fetchPeople();
    }
  }, [isOpen]);

  const fetchPeople = async () => {
    const church = parseInt(getCookie("church"));
    try {
      const response = await person_view(church);
      setPeople(response.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmployeesChange = (selectedIds) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      employees: selectedIds.map(Number), // Update selected person IDs
    }));
  };

  const toggleNewPersonModal = () => {
    setAddPersonModalOpen(!addPersonModalOpen); // Toggle Add Person modal
  };

  useEffect(() => {
    if (task) {
      setFormData({
        task_name: task.task_name,
        task_description: task.task_description,
        employees: task.employees,
        start_date: task.start_date,
        end_date: task.end_date,
        priority: task.priority,
        is_completed: task.is_completed,
        task_id: task.id,
        created_by: task.created_by,
        church: task.church,
        is_delete: task.deleted,
        meetings: task.meetings,
      });
    } else {
      fetchTaskDetails();
    }
  }, [task, id]);

  const fetchTaskDetails = () => {
    task_view(id)
      .then((response) => {
        const taskData = response.data;
        setFormData({
          task_name: taskData.task_name,
          task_description: taskData.task_description,
          employees: taskData.employees,
          start_date: taskData.start_date,
          end_date: taskData.end_date,
          priority: taskData.priority,
          is_completed: taskData.is_completed,
          task_id: taskData.id,
          created_by: taskData.created_by,
          church: taskData.church,
          is_delete: taskData.deleted,
          meetings: taskData.meetings,
        });
      })
      .catch((error) => {
        console.error("Error fetching task details: ", error);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = {};

    if (!formData.task_name.trim()) validationErrors.task_name = "Task name is required.";
    if (!formData.employees) validationErrors.employee_name = "Employee name is required.";
    if (!formData.start_date) validationErrors.start_date = "Start date is required.";
    if (!formData.end_date) validationErrors.end_date = "End date is required.";
    if (!formData.priority) validationErrors.priority = "Priority is required.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await tasks_update(id, formData);
      setIsEditMode(false); // Switch back to info mode after saving
      toggle(); // Close the modal after saving
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  return (
    <Modal 
      opened={isOpen} 
      onClose={toggle} 
      title={formData.task_name || "Task Details"} 
      size="lg"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      {isEditMode ? (
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Task Name"
            name="task_name"
            value={formData.task_name}
            onChange={handleChange}
            error={errors.task_name}
            required
            size="md"
          style={{ marginBottom: '1rem' }}
          />
          <TextInput
            label="Task Description"
            name="task_description"
            value={formData.task_description}
            onChange={handleChange}
            required
            size="md"
            style={{ marginBottom: '1rem' }}
          />
          <MultiSelect
            label="Employee(s)"
            data={people.map((person) => ({
              value: person.id?.toString(),
              label: person.name || "Unnamed Person",
            }))}
            value={formData.employees?.map(String) || []}
            onChange={handleEmployeesChange}
            searchable
            placeholder="Select employee(s)"
            nothingFoundMessage={
              <>
                No matches found.{" "}
                <Button
                  variant="outline"
                  color="blue"
                  size="xs"
                  onClick={toggleNewPersonModal}
                >
                  Add Person
                </Button>
              </>
            }
            clearable
            required
            error={errors.employees}
            size="md"
            style={{ marginBottom: '1rem' }}
            />
          <TextInput
            label="Start Date"
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleChange}
            error={errors.start_date}
            required
            size="md"
            style={{ marginBottom: '1rem' }}
          />
          <TextInput
            label="End Date"
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleChange}
            error={errors.end_date}
            required
            size="md"
            style={{ marginBottom: '1rem' }}
          />
          <Select
            label="Priority"
            name="priority"
            data={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
            value={formData.priority}
            onChange={(value) =>
              handleChange({ target: { name: "priority", value } })
            }
            error={errors.priority}
            required
            size="md"
            style={{ marginBottom: '1rem' }}
          />
          <Switch
            label="Is Completed"
            name="is_completed"
            fw={500}
            checked={formData.is_completed}
            onChange={(event) =>
              handleChange({
                target: { name: "is_completed", value: event.currentTarget.checked },
              })
            }
            size="md"
          />
          <Group position="apart" mt="md">
            <Button type="submit">Save Task</Button>
            <Button color="gray" onClick={toggle}>
              Close
            </Button>
          </Group>
        </form>
      ) : (
        <>
          <Text size="md" style={{ marginBottom: '1rem' }}>
            <strong>Task Description:</strong> {formData.task_description}
          </Text>
          <Text size="md" style={{ marginBottom: '1rem' }}>
            <strong>Start Date:</strong> {formData.start_date}
          </Text>
          <Text size="md" style={{ marginBottom: '1rem' }}>
            <strong>End Date:</strong> {formData.end_date}
          </Text>
          <Text size="md" style={{ marginBottom: '1rem' }}>
            <strong>Status:</strong> {formData.is_completed ? "Completed" : "Pending"}
          </Text>
          <Group position="apart" mt="md">
            <Button onClick={() => setIsEditMode(true)}>Edit</Button>
            <Button color="gray" onClick={toggle}>
              Close
            </Button>
          </Group>
        </>
      )}
      <AddPersonModal
        opened={addPersonModalOpen}
        toggleModal={toggleNewPersonModal}
        fetchPersons={fetchPeople}
      />
    </Modal>
  );
};

export default TaskInformationAndEditModal;
