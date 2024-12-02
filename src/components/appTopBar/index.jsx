import React, { useEffect, useState } from 'react';
import { Text, Group } from '@mantine/core';
import { getCookie } from "../../api"; // Assuming getCookie is available

const TopBar = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = () => {
      const name = getCookie("first_name");
      console.log("Fetching first_name cookie:", name); // Debugging
      setUserName(name);
    };

    fetchUserName();
    console.log("TopBar re-rendered"); // Debugging
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#39383b', padding: '10px 20px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
      <div>
        {/* You can add a logo or menu items here if needed */}
      </div>
      <Group position="right">
        <Text size="lg" weight={500} style={{ color: '#ffffff' }}>
          {userName ? `Hello, ${userName}!` : 'Loading...'}
        </Text>
      </Group>
    </div>
  );
};

export default TopBar;
