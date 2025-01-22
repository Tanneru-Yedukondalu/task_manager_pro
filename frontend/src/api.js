// const API_URL = "http://localhost:5000"; // Change the base URL as per your backend
const API_URL = "https://10.50.48.11:5000"; // Replace 'localhost' with your machine's network IP

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
    const data = await response.json();
    console.log("Fetched tasks:", data);  // Log the entire response for debugging

    if (data && Array.isArray(data.tasks)) {
      return data.tasks;  // Return all tasks if 'tasks' is an array
    } else {
      throw new Error("Expected an array of tasks.");
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;  // Re-throw the error after logging it
  }
};




// Fetch all users
export const fetchAllUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    return data; // Return the full user data array
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};



// Fetch messages
export const fetchMessages = async (receiver, group = null) => {
  try {
    let url = `${API_URL}/messages?receiver=${receiver}`;
    if (group) {
      url += `&group=${group}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Fetching messages for:", receiver); // For debugging

    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }

    const data = await response.json();
    return data.messages; // Return the list of messages from the response
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};



