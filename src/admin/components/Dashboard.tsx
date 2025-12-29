import React, { useEffect, useState } from 'react';
import { Box, H1, H2, Text, Button } from '@adminjs/design-system';

const Dashboard = () => {

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMeetups: 0,
    recentUsers: 0,
    recentMeetups: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Use relative URLs that work within AdminJS context
        // These will be relative to the current domain and will use AdminJS session auth
        const [usersResponse, meetupsResponse] = await Promise.all([
          fetch('/api/users/stats'),
          fetch('/api/meetups/stats')
        ]);

        if (usersResponse.ok && meetupsResponse.ok) {
          const usersData: any = await usersResponse.json();
          const meetupsData: any = await meetupsResponse.json();
          
          setStats({
            totalUsers: usersData.data?.totalUsers || 0,
            totalMeetups: meetupsData.data?.totalMeetups || 0,
            recentUsers: usersData.data?.recentUsers || 0,
            recentMeetups: meetupsData.data?.recentMeetups || 0
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box variant="grey">
      <Box variant="white" margin="md" padding="xl">
        <H1>Welcome to LocalityBay Admin Dashboard</H1>
        <Text variant="sm" color="grey60" marginBottom="xl">
          Manage your community platform from here
        </Text>

        <Box display="flex" flexDirection={['column', 'row']} gap="lg">
          {/* Total Users Card */}
          <Box 
            variant="white" 
            padding="lg" 
            borderRadius="default" 
            boxShadow="card"
            flex="1"
          >
            <Text variant="sm" color="grey60" textTransform="uppercase" fontWeight="bold">
              Total Users
            </Text>
            <H2 marginTop="sm" marginBottom="xs">
              {stats.totalUsers.toLocaleString()}
            </H2>
            <Text variant="sm" color="success">
              +{stats.recentUsers} this week
            </Text>
          </Box>

          {/* Total Meetups Card */}
          <Box 
            variant="white" 
            padding="lg" 
            borderRadius="default" 
            boxShadow="card"
            flex="1"
          >
            <Text variant="sm" color="grey60" textTransform="uppercase" fontWeight="bold">
              Total Meetups
            </Text>
            <H2 marginTop="sm" marginBottom="xs">
              {stats.totalMeetups.toLocaleString()}
            </H2>
            <Text variant="sm" color="success">
              +{stats.recentMeetups} this week
            </Text>
          </Box>
        </Box>

        
      </Box>
    </Box>
  );
};

export default Dashboard; 