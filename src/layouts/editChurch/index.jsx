import React, { useState, useEffect } from "react";
import {
  get_church_data,
  update_church_data,
  delete_church_data,
} from "../../../src/api";
import AppSidebar from "../../components/appSidebar";
import TopBar from "../../components/appTopBar";
import { Card, Table, Button, TextInput, Text, Modal, Title, Group, Loader} from "@mantine/core";

const ChurchList = () => {
  const [churches, setChurches] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedChurch, setEditedChurch] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [approvalStatus, setApprovalStatus] = useState("");
  const [errors, setErrors] = useState({});
  const [churchToDelete, setChurchToDelete] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchChurchData();
  }, []);

  const fetchChurchData = () => {
    setIsLoading(true);
    get_church_data()
      .then((response) => {
        setChurches(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching church data:", error);
        setIsLoading(false);
      });
  };

  const toggleEditModal = () => setIsEditModalOpen(!isEditModalOpen);

  const handleEdit = (church) => {
    console.log("Editing Church:", church);
    setEditedChurch({
      id: church.id || "",
      name: church.name || "",
      address: church.address || "",
      ph_no: church.ph_no || "",
      email: church.email || "",
    });
    toggleEditModal();
  };

  const handleSaveEdit = () => {
    if (!editedChurch.name) {
      setErrors({ name: "Name is required." });
      return;
    }

    update_church_data(editedChurch.id, editedChurch)
      .then(() => {
        setApprovalStatus("updated");
        fetchChurchData();
        toggleEditModal();
      })
      .catch((error) => console.error("Error updating church:", error));
  };

  const handleDelete = async () => {
    if (churchToDelete) {
      try {
        await delete_church_data(churchToDelete.id);
        setApprovalStatus("deleted");
        fetchChurchData();
        setDeleteModalOpen(false);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const openDeleteModal = (church) => {
    setChurchToDelete(church);
    setDeleteModalOpen(true);
  };

  const handleInputChange = (e, key) => {
    setEditedChurch({ ...editedChurch, [key]: e.target.value });
    setErrors({ ...errors, [key]: "" });
  };

  const rows = churches.map((church) => (
    <Table.Tr key={church.id}>
      <Table.Td>{church.name}</Table.Td>
      <Table.Td>{church.address}</Table.Td>
      <Table.Td>{church.ph_no || "N/A"}</Table.Td>
      <Table.Td>{church.email || "N/A"}</Table.Td>
      <Table.Td>
        <Button variant="light" color="blue" onClick={() => handleEdit(church)}>
          Edit
        </Button>
        <Button
          variant="outline"
          color="red"
          style={{ marginLeft: "10px" }}
          onClick={() => openDeleteModal(church)}
        >
          Delete
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        margin: 0,
        padding: 0,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <TopBar />
      <div style={{ display: "flex", flexGrow: 1, width: "100%" }}>
        <AppSidebar />
        <div
          style={{
            flex: 1,
            margin: 0,
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Card
            style={{
              width: "80%",
              maxWidth: "1400px",
              boxSizing: "border-box",
              padding: "20px",
              marginLeft: "170px",
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
              <Title order={1} ml = {10} style={{ marginBottom: "20px" }}>
              Church List
            </Title>
            </div>
            {isLoading ? (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Loader size="xl" />
              </div>
            ) : (
              <Table striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Address</Table.Th>
                    <Table.Th>Phone Number</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            )}
          </Card>
          {/* Edit Modal */}
          <Modal
            opened={isEditModalOpen}
            onClose={toggleEditModal}
            title="Edit Church"
            overlayProps={{
              backgroundOpacity: 0.55,
              blur: 3,
            }}
            styles={{
              modal: { color: "black" },
              title: { fontSize: "20px", fontWeight: 500 },
            }}
          >
              {/* Church Name Field */}
              <TextInput
                id="churchName"
                label="Church Name"
                placeholder="Enter church name"
                value={editedChurch.name || ""}
                onChange={(e) => handleInputChange(e, "name")}
                error={errors.name}
                required
              />
              {errors.name && (
                <Text color="red" size="sm" mt={4}>
                  {errors.name}
                </Text>
              )}

              {/* Address Field */}
              <TextInput
                id="churchAddress"
                label="Address"
                placeholder="Enter address"
                value={editedChurch.address || ""}
                onChange={(e) => handleInputChange(e, "address")}
                mt="md"
              />

              {/* Phone Number Field */}
              <TextInput
                id="churchPhone"
                label="Phone Number"
                placeholder="Enter phone number"
                value={editedChurch.ph_no || ""}
                onChange={(e) => handleInputChange(e, "ph_no")}
                mt="md"
              />

              {/* Email Field */}
              <TextInput
                id="churchEmail"
                label="Email"
                placeholder="Enter email address"
                value={editedChurch.email || ""}
                onChange={(e) => handleInputChange(e, "email")}
                mt="md"
              />

              {/* Buttons */}
              <Group position="right" mt="lg">
                <Button
                  variant="filled"
                  color="blue"
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  color="gray"
                  onClick={toggleEditModal}
                >
                  Cancel
                </Button>
              </Group>
          </Modal>

          <Modal
            opened={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            title="Delete User"
            overlayProps={{
              backgroundOpacity: 0.55,
              blur: 3,
            }}
          >
            <Text size="md" weight={500} style={{ marginBottom: '1rem' }}>
              Are you sure you want to delete this church?
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
      </div>
    </div>
  );
};

export default ChurchList;