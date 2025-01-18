import React, { useState , useEffect} from "react";
import { addTask } from "../../api";
import "./Form.css"; // Import the CSS file
const Form = ({ selectedUser, selectedUserId }) => {
    const [formData, setFormData] = useState({
        taskName: "",
        description: "",
        category: "Work",
        deadline: "",
        createdOn: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
        status: "Not Started",
        user_id: selectedUserId || localStorage.getItem('userId') || '',  // Use the passed selectedUserId prop
    });

    const [error, setError] = useState(null); // For error handling
    const [success, setSuccess] = useState(false); // To show success feedback

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Basic validation
        if (!formData.taskName || !formData.description || !formData.deadline) {
            setError("All fields are required.");
            setSuccess(false);
            return;
        }

        try {
            await addTask(formData);  // Add task API call
            setSuccess(true);
            setError(null);
            console.log("Task successfully added!");
            setFormData({
                taskName: "",
                description: "",
                category: "Work",
                deadline: "",
                createdOn: new Date().toISOString().split("T")[0], // Reset today's date
                status: "Not Started",
                user_id: selectedUserId ||localStorage.getItem('userId') ||  '',  // Reset user_id
            });
        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred while saving the task.");
        }
    };

    return (
        <div className="form-container">
            <h2>TASK FORM</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">Task created successfully!</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="taskName">Task Name:</label>
                    <input
                        type="text"
                        name="taskName"
                        value={formData.taskName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="createdOn">Created On:</label>
                    <input
                        type="text"
                        name="createdOn"
                        value={formData.createdOn}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="deadline">Deadline:</label>
                    <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Status:</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                    >
                        <option value="Not Started">Not Started</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <button type="submit" className="submit-button">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Form;
