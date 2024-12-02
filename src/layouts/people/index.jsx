import React, { useEffect, useState } from "react";
import {
  Title,
  Table,
  Button,
  Modal,
  TextInput,
  Text,
  Card,
  Group
} from "@mantine/core";
import { person_view, add_person, delete_person, getCookie } from '../../api';
import AppSidebar from '../../components/appSidebar';
import TopBar from "../../components/appTopBar";

const PersonPage = () => {
  const [persons, setPersons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    church: getCookie('church'),
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState(null);

  useEffect(() => {
    fetchPersons();
  }, []);

  const fetchPersons = () => {
    person_view(getCookie('church'))
      .then((response) => {
        setPersons(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toggleModal = (person = null) => {
    setModalOpen(!modalOpen);
    if (person) {
      setFormData({ name: person.name, email: person.email, church: person.church });
    } else {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', church: getCookie('church') });
    setValidationErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    setValidationErrors((prevState) => ({ ...prevState, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required.';
    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address.';
      }
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    add_person(formData)
      .then(() => {
        toggleModal();
        fetchPersons();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = async () => {
    if (personToDelete) {
      try {
        await delete_person(personToDelete.id);
        fetchPersons();
        setDeleteModalOpen(false);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const openDeleteModal = (person) => {
    setPersonToDelete(person);
    setDeleteModalOpen(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%" }}>
      {/* TopBar */}
      <TopBar />

      {/* Main Layout */}
      <div style={{ display: "flex", flexGrow: 1, width: "100%" }}>
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            margin: 0,
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // Center the content horizontally within available space
            justifyContent: "flex-start",
          }}
        >
          <Card
            style={{
              width: "80%",
              maxWidth: "1400px",
              marginLeft: "170px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <Title order={1} ml={10} style={{ marginBottom: "20px" }}>
                Persons
              </Title>
              <Button variant="filled" color="blue" onClick={() => toggleModal()}>
                Add Person
              </Button>
            </div>

            {/* Loading or Table */}
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {persons.map((person) => (
                    <Table.Tr key={person.id}>
                      <Table.Td>{person.name}</Table.Td>
                      <Table.Td>{person.email}</Table.Td>
                      <Table.Td>
                        <Button
                          variant="light"
                          color="blue"
                          onClick={() => toggleModal(person)}
                          style={{ marginRight: "10px" }}
                        >
                          Edit
                        </Button>
                        <Button variant="outline" color="red" onClick={() => openDeleteModal(person)}>
                          Delete
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Card>
        </div>
      </div>

      {/* Modal */}
      <Modal opened={modalOpen} onClose={() => toggleModal()} title="Add or Edit Person">
        <div>
          <div style={{ marginBottom: "15px" }}>
            <TextInput
              label="Name"
              placeholder="Person Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={validationErrors.name}
              required
            />
          </div>
          <div>
            <TextInput
              label="Email"
              placeholder="Person Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={validationErrors.email}
              required
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
            <Button variant="filled" color="blue" onClick={handleSubmit} style={{ marginRight: "10px" }}>
              Save
            </Button>
            <Button variant="outline" color="gray" onClick={() => toggleModal()}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
        <Modal
          opened={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Person"
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
          size="sm"
          padding="lg"
        >
          <Text size="md" weight={500} style={{ marginBottom: '1rem' }}>
            Are you sure you want to delete this person?
          </Text>

          <Group position="apart">
            <Button color="red" onClick={handleDelete}>
              Yes
            </Button>
            <Button color="gray" onClick={() => setDeleteModalOpen(false)}>
              No
            </Button>
          </Group>
        </Modal>
    </div>
  );
};

export default PersonPage;
