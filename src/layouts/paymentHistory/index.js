import React, { useEffect, useState } from "react";

import { Container, Title, Card, Button, NavLink, Text } from "@mantine/core";
import { get_all_payments } from '../../../src/api';
import AppSidebar from "../../components/appSidebar";

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
        console.error('Error fetching payments:', error);
      });
  });

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
    return [formattedDate,formattedTime];
  };

  return (
    <div style={{ display: "flex" }}>
      <AppSidebar />
      <div style={{position: "relative", left: "15%",width:"100%", height:"94vh"}} className="my-3">
      <Card className="my-card  my-card-height schedule-card" style={{width:"80%"}}>
          <div className="full-screen-calendar">
            {isLoading && <p>Loading...</p>}
            {!isLoading && payments.length === 0 && <p>No payments found.</p>}
            {!isLoading && payments.length > 0 && (
              <div>
                <h3>Payment History!</h3>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ width: "10%" }}>Transaction ID</th>
                      <th style={{ width: "15%" }}>Church Name</th>
                      <th style={{ width: "15%" }}>Email</th>
                      <th style={{ width: "15%" }}>Date</th>
                      <th style={{ width: "15%" }}>Amount</th>
                      <th style={{ width: "10%" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment, index) => (
                      <tr key={index}>
                        <td>{payment.transaction_id}</td>
                        <td>{payment.church_name}</td>
                        <td>{payment.email}</td>
                        <td>{formatDateTime(payment.date)}</td>
                        <td>{'$'+payment.amount}</td>
                        <td>{payment.is_success ? 'Success' : 'Failed'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentHistory;
