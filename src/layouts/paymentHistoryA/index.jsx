import React, { useEffect, useState } from "react";
import { get_all_payments, getCookie, get_payment_card_details, update_payment } from '../../api';
import AppSidebar from "../../components/appSidebar";
import TopBar from "../../components/appTopBar";
import { useNavigate } from 'react-router-dom';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Table, Button, Title, Card, TextInput, Group, Modal } from '@mantine/core';  // Importing Mantine Table

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

  useEffect(() => {
    fetchPayments();
  }, []);

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
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%" }}>
      <TopBar />
      <div style={{ display: "flex", flexGrow: 1, width: "100%" }}>
        <AppSidebar /> {/* Sidebar is a part of the layout */}
        <div
          style={{
            flex: 1,
            margin: 0,
            padding: "20px", // Padding around the content
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // Center the content horizontally within available space
            justifyContent: "flex-start", // Align the content at the top
          }}
        >
          {/* Removed the Card component */}
          <Card
            style={{
              width: "80%", // The content area takes up 80% of the available space
              maxWidth: "1400px", // Cap the width for larger screens
              boxSizing: "border-box",
              marginLeft: "170px", // Offset for sidebar width (replace with actual sidebar width)
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
              <Title order={1} ml={10} style={{ marginBottom: "20px" }}>
              Payment History
            </Title>
              <Button variant="filled" color="blue" onClick={toggleCreatePaymentForm}>Update Payment Method</Button>
            </div>

            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <div>
                {payments.length === 0 && <p>No payments found.</p>}
                {payments.length > 0 && (
                  <Table striped style={{ width: "100%" }}>
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
                          <Table.Td>{payment.is_success ? 'Success' : 'Failed'}</Table.Td>
                          <Table.Td>
                            <Button variant="filled" color="blue" onClick={() => handlePaymentSelect(payment)}>Show Card Details</Button>
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
        title="Update Payment Method"
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
        title="Card Details"
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
