// api.js
const API_URL = "http://127.0.0.1:5001"; // Your backend base URL


// api.js
export const fetchTasksFromBackend = async () => {
    try {
        const response = await fetch('http://localhost:5001/tasks');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error; // Re-throw the error so it can be handled by the caller
    }
};


// Function to send a POST request to add a new task
export const addTask = async (taskData) => {
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
        });

        if (!response.ok) {
            throw new Error("Failed to save task.");
        }

        return response.json(); // Assuming the response is in JSON format
    } catch (error) {
        console.error("Error:", error);
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

        return response.json(); // Assuming the response is in JSON format
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};


// api.js
export const deleteTasks = async (taskNames) => {
    try {
        const response = await fetch(`${API_URL}/tasks/delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskNames })
        });
        if (!response.ok) {
            throw new Error("Failed to delete tasks");
        }
        return response.json();
    } catch (error) {
        console.error(error);
    }
};

