import React, { useEffect, useState } from "react";
import { get_all_payments, getCookie, get_payment_card_details, update_payment } from '../../api';
import AppSidebar from "../../components/appSidebar";
import TopBar from "../../components/appTopBar";
import { useNavigate } from 'react-router-dom';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Table, Button, Title, Card, TextInput, Group, Modal, Loader, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const PaymentHistory = () => {
  const history = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [showCardDetailsModal, setShowCardDetailsModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showCreatePaymentForm, setShowCreatePaymentForm] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    email: getCookie('user'),
    church: getCookie('church')
  });
  const stripe = useStripe();
  const elements = useElements();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    fetchPayments();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    if (isSmallScreen) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isSmallScreen]);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const response = await get_all_payments();
      const sortedPayments = response.data.payments.sort((a, b) => new Date(b.date) - new Date(a.date));
      const filteredPayments = sortedPayments.filter(
        payment => parseInt(payment.church_id) === parseInt(getCookie('church'))
      );
      setPayments(filteredPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCardDetailsModal = () => {
    setShowCardDetailsModal(!showCardDetailsModal);
  };

  const toggleCreatePaymentForm = () => {
    setShowCreatePaymentForm(!showCreatePaymentForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handleCreatePayment = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      console.error('Error creating payment method:', error);
    } else {
      console.log('PaymentMethod', paymentMethod);
      updateCard(paymentMethod.id, cardDetails.email, cardDetails.church);
      setShowCreatePaymentForm(false);
      setTimeout(() => {
        fetchPayments();
      }, 1000);
    }
  };

  const updateCard = (paymentMethodId, email, church) => {
    const cardDetails = { payment_method: paymentMethodId, email, church };
    update_payment(cardDetails)
      .then((response) => {
        console.log("Payment method updated successfully:", response);
        history('/paymenthistorya');
      })
      .catch((error) => {
        console.error('Error updating payment method:', error);
      });
  };

  const formatDateTime = (dateTimeString) => {
    const optionsDate = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const optionsTime = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    };
    const formattedDate = new Date(dateTimeString).toLocaleString(undefined, optionsDate);
    const formattedTime = new Date(dateTimeString).toLocaleString(undefined, optionsTime);
    return [formattedDate, formattedTime];
  };

  const handlePaymentSelect = (payment) => {
    get_payment_card_details({ payment_id: payment.payment_id })
      .then((response) => {
        console.log('Card details:', response.data.cardDetails);
        setSelectedPayment({ ...payment, cardDetails: response.data.cardDetails });
        toggleCardDetailsModal();
      })
      .catch((error) => {
        console.error('Error fetching card details:', error);
      });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'auto' }}>
      {/* TopBar */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000 }}>
        <TopBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
        <div style={{ display: 'flex', flex: 1 }}>
          {/* Sidebar */}
          {isSidebarOpen && (
            <div
              style={{
                width: '0',
                backgroundColor: '#f4f4f4',
                height: '100vh',
                position: isSmallScreen ? 'fixed' : 'relative', // Fixed for small screens, relative for large screens
                top: 0,
                left: 0,
                zIndex: isSmallScreen ? 999 : 'auto', // Higher z-index for small screens
                transition: 'transform 0.3s ease', // Smooth open/close
              }}
            >
              <AppSidebar />
            </div>
          )}
        <div
          style={{
            flex: 1,
            margin: 0,
            padding: "20px", // Padding around the content
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // Center the content horizontally within available space
            marginTop:"40px",
          }}
        >
          {/* Removed the Card component */}
          <Card
            style={{
              width: isSmallScreen ? "100%" : "80%",
              minWidth: "1000px",
              maxWidth: "1400px", // Cap the width for larger screens
              boxSizing: "border-box",
              padding: "20px",
              marginLeft: isSmallScreen? "0" : "170px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between", // Space between title and button
                alignItems: "center", // Vertically align the items
                marginBottom: "20px",
              }}
            >
              <Title order={isSmallScreen ? 2 : 1} ml={10} style={{ marginBottom: "20px" }}>
              Payment History
            </Title>
              <Button mb={20} variant="filled" color="#6776ab" onClick={toggleCreatePaymentForm}>Update Payment Method</Button>
            </div>

            {isLoading ? (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Loader size="xl" />
              </div>
            ) : (
              <div>
                {payments.length === 0 && <p>No payments found.</p>}
                {payments.length > 0 && (
                  <Table striped style={{ width: "100%", borderCollapse: "collapse" }}>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Transaction ID</Table.Th>
                        <Table.Th>Church Name</Table.Th>
                        <Table.Th>Email</Table.Th>
                        <Table.Th>Date</Table.Th>
                        <Table.Th>Amount</Table.Th>
                        <Table.Th>Transaction Status</Table.Th>
                        <Table.Th>Actions</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {payments.map((payment, index) => (
                        <Table.Tr key={index}>
                          <Table.Td>{payment.transaction_id}</Table.Td>
                          <Table.Td>{payment.church_name}</Table.Td>
                          <Table.Td>{payment.email}</Table.Td>
                          <Table.Td>{formatDateTime(payment.date)}</Table.Td>
                          <Table.Td>{'$' + payment.amount}</Table.Td>
                          <Table.Td>
                            <Text color={payment.is_success ? "green" : "red"}>
                              {payment.is_success ? "Success" : "Failed"}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Button variant="light" color="blue" onClick={() => handlePaymentSelect(payment)}>Show Card Details</Button>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>

      <Modal
        title={<strong style={{ fontSize: "20px"}}>Update Payment Method</strong>}
        opened={showCreatePaymentForm}
        onClose={toggleCreatePaymentForm}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <form onSubmit={handleCreatePayment}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="card_number" style={{ display: 'block', marginBottom: '8px' }}>
              Card Details:
            </label>
            <div id="card_number" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
              <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
            </div>
          </div>
          <Group position="right">
            <Button type="submit" color="blue">
              Update Payment Method
            </Button>
          </Group>
        </form>
      </Modal>

      <Modal
        title={<strong style={{ fontSize: "20px"}}>Card Details</strong>}
        opened={showCardDetailsModal}
        onClose={toggleCardDetailsModal}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <div>
          <TextInput
            label="Card Type"
            value={selectedPayment ? selectedPayment.cardDetails.brand : ''}
            readOnly
          />
          <TextInput
            label="Last 4 Digits"
            value={selectedPayment ? `**** **** **** ${selectedPayment.cardDetails.last4}` : ''}
            readOnly
            mt="md"
          />
          <TextInput
            label="Expiration Date"
            value={selectedPayment ? `${selectedPayment.cardDetails.exp_month}/${selectedPayment.cardDetails.exp_year}` : ''}
            readOnly
            mt="md"
          />
          <Group position="right" mt="md">
            <Button color="blue" onClick={toggleCardDetailsModal}>
              Close
            </Button>
          </Group>
        </div>
      </Modal>

    </div>
  );
};

export default PaymentHistory;
