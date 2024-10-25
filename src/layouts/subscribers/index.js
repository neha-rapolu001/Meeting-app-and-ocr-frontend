import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Container
} from 'reactstrap';
import {  Card, Title,NavLink, Text ,Button, TextInput } from "@mantine/core";
import { delete_user, signup, update_user, get_church_data, getCookie, isSuperUser, subscription_view, get_users, edit_church, delete_church } from '../../../src/api';
import AppSidebar from "../../components/appSidebar";

const Subscribers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [churchData, setChurchData] = useState([]);
  const [editedIndex, setEditedIndex] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: ''
  });
  const [approvalStatus, setApprovalStatus] = useState('');
  const [modal, setModal] = useState(false);
  const [churchNameError, setChurchNameError] = useState('');
  const toggleModal = () => setModal(!modal);

  const toggleEditModal = () => setEditModal(!editModal);
  useEffect(() => {
    get_church_data()
      .then((response) => {
        Promise.all(response.data.map(church => {
            return Promise.all([
                subscription_view(church.subscription),
                get_users(church.id)
            ])
            .then(([subscriptionRes, usersRes]) => {
                if (usersRes.data.length > 0) {
                    return {
                        address: church.address,
                        church_email: church.address,
                        church_id: church.id,
                        church_name: church.name,
                        church_ph_no: church.ph_no,
                        subscription: church.subscription,
                        website: church.website,
                        count: subscriptionRes.data.find(item => item.id === church.subscription)?.count,
                        subscription_name: subscriptionRes.data.find(item => item.id === church.subscription)?.name,
                        admin_name: usersRes.data[0].first_name + " " + usersRes.data[0].last_name,
                        admin_email: usersRes.data[0].email,
                        existin_user_count: usersRes.data.length
                    };
                } else {
                    return null;
                }
            });
        }))
        .then(churches => {
            churches = churches.filter(church => church !== null);
            console.log(churches)
            setChurchData(churches);
            setIsLoading(false);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);



  const priorityLabels = {
    1: "Super-user",
    2: "Admin",
    3: "Leader"
  };

  const handleEdit = (index) => {
    setEditedIndex(index);
    setEditedUser(churchData[index]);
    toggleEditModal();
  };
  const handleSaveEdit = () => {
    if (validateForm()) {
      edit_church(editedUser).then(() => {
        toggleEditModal();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDeleteUser = (churchId) => {
    get_users(churchId)
      .then((response) => {
        response.data.forEach((user) => {
          delete_user(user.id)
            .then(() => {
              console.log(`User ${user.id} deleted successfully.`);
            })
            .catch((error) => {
              console.error(`Error deleting user ${user.id}:`, error);
            });
        });
        delete_church(churchId)
          .then(() => {
            console.log(`Church ${churchId} deleted successfully.`);
            toggleModal(); 
            setTimeout(() => {
              window.location.reload();
            }, 4000);
          })
          .catch((error) => {
            console.error(`Error deleting church ${churchId}:`, error);
          });
      })
      .catch((error) => {
        console.error(`Error fetching users for church ${churchId}:`, error);
      });
  };

  const validateForm = () => {
    let isValid = true;
    if (!editedUser.name) {
      setChurchNameError('Church name is required');
      isValid = false;
    } else {
      setChurchNameError('');
    }
    return isValid;
  };

  return (
    <div style={{ display: "flex" }}>
      <AppSidebar />

      <div style={{position: "relative", left: "15%",width:"100%", height:"94vh"}} className="my-3">
      <Card className="my-card  my-card-height schedule-card" style={{width:"80%"}}>
        <h1 style={{ textAlign: 'center', display: 'inline-block', marginBottom:"20px", marginTop:"10px" }}>Subscribers</h1>
          <div className="full-screen-calendar">
            <div style={{ textAlign: 'center' }}>
            </div>
            {isLoading && <p>Loading...</p>}
            {!isLoading && (
              <div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>

                    <tr style={{ borderBottom: '1px solid black' }}>
                      {/* address
                    admin_email
                    admin_name
                    church_email
                    church_id
                    church_name
                    church_ph_no
                    count
                    subscription
                    subscription_name
                    website  */}

                      <th style={{ borderBottom: '1px solid black', padding: '8px' }}>Church name</th>
                      <th style={{ borderBottom: '1px solid black', padding: '8px' }}>Admin name</th>
                      <th style={{ borderBottom: '1px solid black', padding: '8px' }}>Subscription type</th>
                      <th style={{ borderBottom: '1px solid black', padding: '8px' }}>Existing User count</th>
                      <th style={{ borderBottom: '1px solid black', padding: '8px' }}>Total User limit</th>
                      <th style={{ borderBottom: '1px solid black', padding: '8px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {churchData.map((church, index) => (
                      <tr>
                        <td style={{ padding: '8px' }}>{church.church_name}</td>
                        <td style={{ padding: '8px' }}>{church.admin_name}</td>
                        <td style={{ padding: '8px' }}>{church.subscription_name}</td>
                        <td style={{ padding: '8px' }}>{church.existin_user_count}</td>
                        <td style={{ padding: '8px' }}>{church.count}</td>
                        <td style={{ padding: '8px', display :'flex' }} >
                          <Button variant="filled" color="#FFD700" onClick={() => handleEdit(index)}  style={{ marginRight: '5px', color:"#2E2E2E" }}>Edit</Button>
                          <Button  variant="outline" color="#2E2E2E"  onClick={() => handleDeleteUser(church.church_id)} style={{ marginRight: '5px' }}>Delete</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>


            )}
          </div>
        </Card>
        <Modal style={{color:"black"}} isOpen={modal} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>{approvalStatus === 'added' ? 'User Added' : 'User Deleted'}</ModalHeader>
          <ModalBody>
            {approvalStatus === 'added' ? 'New user has been added.' : 'User has been deleted.'}
          </ModalBody>
          <ModalFooter>
            <Button  onClick={toggleModal}>OK</Button>{' '}
          </ModalFooter>
        </Modal>
        <Modal style={{color:"black"}} isOpen={editModal} toggle={toggleEditModal}>
          <ModalHeader toggle={toggleEditModal}>Edit Church</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="churchName">Church Name</Label>
              <TextInput type="text" name="name" id="churchName" defaultValue={editedUser.church_name} onChange={handleInputChange} invalid={churchNameError !== ''} />
              <FormFeedback>{churchNameError}</FormFeedback>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button variant="filled" color="#FFD700" style={{color:"#2E2E2E"}}onClick={handleSaveEdit}>Save</Button>{' '}
            <Button  variant="outline" color="#2E2E2E" onClick={toggleEditModal}>Cancel</Button>
          </ModalFooter>
        </Modal>

      </div>
    </div>
  );
};

export default Subscribers;
