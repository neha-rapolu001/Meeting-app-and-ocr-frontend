import React, { useEffect, useState } from "react";
import { Card, Title, Table, Loader, Text } from "@mantine/core";
import { get_all_payments } from "../../api";
import AppSidebar from "../../components/appSidebar";
import TopBar from "../../components/appTopBar";

const PaymentHistory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    get_all_payments()
      .then((response) => {
        const filteredPayments = response.data.payments;
        filteredPayments.sort((a, b) => new Date(b.date) - new Date(a.date));
        setPayments(filteredPayments);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching payments:", error);
      });
  }, []);

  const formatDateTime = (dateTimeString) => {
    const optionsDate = { year: "numeric", month: "long", day: "numeric" };
    const optionsTime = { hour: "numeric", minute: "numeric", hour12: true };
    const formattedDate = new Date(dateTimeString).toLocaleDateString(undefined, optionsDate);
    const formattedTime = new Date(dateTimeString).toLocaleTimeString(undefined, optionsTime);
    return `${formattedDate} at ${formattedTime}`;
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
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Card
            style={{
              width: "80%",
              maxWidth: "1400px",
              marginLeft: "170px",
              padding: "20px",
              boxSizing: "border-box",
            }}
          >
            <Title order={1} ml={10} style={{ marginBottom: "20px" }}>
              Payment History
            </Title>

            {/* Loading or Table */}
            {isLoading ? (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Loader size="xl" />
              </div>
            ) : payments.length === 0 ? (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Text>No payments found.</Text>
              </div>
            ) : (
              <Table striped >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th style={{ padding: "10px 15px" }}>Transaction ID</Table.Th>
                    <Table.Th style={{ padding: "10px 15px" }}>Church Name</Table.Th>
                    <Table.Th style={{ padding: "10px 15px" }}>Email</Table.Th>
                    <Table.Th style={{ padding: "10px 15px" }}>Date</Table.Th>
                    <Table.Th style={{ padding: "10px 15px" }}>Amount</Table.Th>
                    <Table.Th style={{ padding: "10px 15px" }}>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {payments.map((payment, index) => (
                    <Table.Tr
                      key={index}
                    >
                      <Table.Td style={{ padding: "15px 20px", lineHeight: "1.6" }}>
                        {payment.transaction_id}
                      </Table.Td>
                      <Table.Td style={{ padding: "15px 20px", lineHeight: "1.6" }}>
                        {payment.church_name}
                      </Table.Td>
                      <Table.Td style={{ padding: "15px 20px", lineHeight: "1.6" }}>
                        {payment.email}
                      </Table.Td>
                      <Table.Td style={{ padding: "15px 20px", lineHeight: "1.6" }}>
                        {formatDateTime(payment.date)}
                      </Table.Td>
                      <Table.Td style={{ padding: "15px 20px", lineHeight: "1.6" }}>
                        {`$${payment.amount}`}
                      </Table.Td>
                      <Table.Td style={{ padding: "15px 20px", lineHeight: "1.6" }}>
                        <Text color={payment.is_success ? "green" : "red"}>
                          {payment.is_success ? "Success" : "Failed"}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
