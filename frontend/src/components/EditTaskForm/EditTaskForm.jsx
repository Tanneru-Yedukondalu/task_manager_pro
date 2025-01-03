import React, { useState, useEffect } from 'react';
import "./EditTaskForm.css";

const EditTaskForm = ({ task, onSave, onCancel }) => {
    const [editedTask, setEditedTask] = useState(task);
    const [error, setError] = useState("");

    useEffect(() => {
        setEditedTask(task);
    }, [task]);

    const handleInputChange = (field, value) => {
        setEditedTask({ ...editedTask, [field]: value });
    };

    const handleSave = () => {
        const { taskName, description, deadline, status } = editedTask;

        // Validation: Check for empty fields
        if (!taskName || !description || !deadline || !status) {
            setError("All fields are required.");
            return;
        }

        setError(""); // Clear error if validation passes
        onSave(editedTask);
    };

    return (
        <div className="task-form">
            <h3>Edit Task</h3>
            {error && <div className="error-message">{error}</div>}
            <form>
                <label>Task Name:</label>
                <input
                    type="text"
                    value={editedTask.taskName || ''}
                    onChange={(e) => handleInputChange('taskName', e.target.value)}
                    readOnly
                />
                <label>Description:</label>
                <textarea
                    value={editedTask.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                />
                <label>Deadline:</label>
                <input
                    type="date"
                    value={editedTask.deadline || ''}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                />
                <label>Status:</label>
                <select
                    value={editedTask.status || ''}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
            </form>
            <div className="form-actions">
                <button onClick={handleSave} className="save-button">Save</button>
                <button onClick={onCancel} className="cancel-button">Cancel</button>
            </div>
        </div>
    );
};

export default EditTaskForm;
