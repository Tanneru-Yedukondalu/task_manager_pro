const API_URL = "http://localhost:5000"; // Change the base URL as per your backend

// Register user (signup)
export const signup = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      
    });
    console.log("Sending data: ", userData); // Add this for debugging


    if (!response.ok) {
      throw new Error('Error during signup');
    }

    return await response.json(); // Assuming the response is in JSON format
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    console.log("Response data:", data);  // Debugging: check the structure of the response

    // Ensure access_token is available in the response
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
    }

    if (data.user_id) {
      localStorage.setItem('userId', data.user_id);
  }
    // Store username for the user
    if (data.username) {
      localStorage.setItem('username', data.username);  // Store username
    }
  

    return data; // Return the whole data object (or just the access_token if needed)
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};


// Create a task
export const addTask = async (taskData) => {
  try {
      const response = await fetch(`${API_URL}/tasks`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify(taskData), // Ensure user_id is included here
      });
      console.log("Response:", response); 

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);  // Log the error response
        throw new Error('Failed to create task');
    }

      return await response.json();
  } catch (error) {
      console.error("Error:", error);
      throw error;
  }
};

// Fetch tasks
export const fetchTasksFromBackend = async () => {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};


// Function to update existing tasks
export const updateTasks = async (tasks) => {
    try {
        const response = await fetch(`${API_URL}/tasks/update`, {
            method: "PUT", // Use PUT for updating
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tasks }), // Send the updated tasks array
        });

        if (!response.ok) {
            throw new Error("Failed to update tasks.");
        }

        return await response.json(); // Assuming the response is in JSON format
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

export const deleteTasks = async (taskNames) => {
  try {
    const userId = localStorage.getItem('userId'); // Fetch user ID from localStorage

    const response = await fetch(`${API_URL}/tasks/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ userId, taskNames }), // Include userId in the request body
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData); // Log the error response
      throw new Error("Failed to delete tasks");
    }

    return await response.json(); // Assuming the response is in JSON format
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};


// api.js

export const fetchUserProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};




export const fetchAllTasks = async () => {
  try {
    const response = await fetch(`${API_URL}/kanban`);
    // Check if the response is valid and parse it
    const data = await response.json();
    if (Array.isArray(data.tasks)) {
      return data.tasks;  // Return all tasks if 'tasks' is an array
    } else {
      throw new Error("Expected an array of tasks.");
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;  // Re-throw the error after logging it
  }
};



