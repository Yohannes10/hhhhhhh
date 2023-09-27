import axios from 'axios';

async function fetchAllUsers(token) {
  try {
    const response = await axios.get('http://localhost:8080/admin/all-users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

async function fetchUserTasks(token, userId) {
  try {
    const response = await axios.get(`http://localhost:8080/tasks/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('User Tasks:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    return [];
  }
}

export { fetchAllUsers, fetchUserTasks };