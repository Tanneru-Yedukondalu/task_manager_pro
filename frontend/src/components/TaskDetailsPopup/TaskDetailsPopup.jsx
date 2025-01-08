import React, { useState, useEffect } from "react";
import './TaskDetailsPopup.css';
import { updateTasks, deleteTasks } from "../../api";
import EditTaskForm from '../EditTaskForm/EditTaskForm'; // Import the EditTaskForm component

const TaskDetailsPopup = ({ category, tasks, onClose, isEditMode, fetchTasks, isDeleteMode, setIsDeleteMode }) => {
    const [editedTasks, setEditedTasks] = useState(tasks);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [selectedTaskName, setSelectedTaskName] = useState(null); // Track selected task by name
    const [selectedTask, setSelectedTask] = useState(null); // Store selected task details
    const [isEditing, setIsEditing] = useState(false); // Track whether editing is active
    const [isViewMode, setIsViewMode] = useState(false); // Track if task is in view mode
    const [selectedTaskNames, setSelectedTaskNames] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        setEditedTasks(tasks);
    }, [tasks]);

    const handleSelectTask = (taskName) => {
        const task = tasks.find(t => t.taskName === taskName);
        setSelectedTaskName(taskName); // Set the task name
        setSelectedTask(task); // Store the selected task details
    };

    const handleOpenEditForm = () => {
        setIsEditing(true); // Show edit form when the Select button is clicked
    };
    const handleCheckboxChange = (taskName) => {
        const updatedSelectedTasks = selectedTaskNames.includes(taskName)
            ? selectedTaskNames.filter(t => t !== taskName)
            : [...selectedTaskNames, taskName];
        
        setSelectedTaskNames(updatedSelectedTasks); // Update selected tasks
        console.log("Selected task names for deletion:", updatedSelectedTasks);  // Check if selected tasks are correct
    };

    const openConfirmModal = () => {
        if (selectedTaskNames.length === 0) {
            setError("No tasks selected for deletion.");
            return;
        }
        setShowConfirmModal(true);
    };
    

    const handleDeleteConfirm = async () => {
        try {
            if (selectedTaskNames.length === 0) {
                setError("No tasks selected for deletion.");
                return;
            }
    
            // Call API to delete selected tasks
            await deleteTasks(selectedTaskNames);
    
            // Fetch updated tasks list from the server
            await fetchTasks();
    
            // Reset state after deletion
            setSelectedTaskNames([]);
            setError(""); // Clear error
            setIsDeleteMode(false); // Exit delete mode
            onClose();
        } catch (error) {
            console.error("Error deleting tasks:", error);
            setError("Failed to delete tasks. Please try again.");
        }
        finally {
            setShowConfirmModal(false); // Close confirmation modal
        }
    };

    const handleDeleteCancel = () => {
        setShowConfirmModal(false); // Close confirmation modal without deleting
    };


    
    
    
    

    const handleSaveTask = async (updatedTask) => {
        try {
            setIsSaving(true);
            const updatedTasksList = editedTasks.map(task =>
                task.taskName === updatedTask.taskName ? updatedTask : task
            );
            await updateTasks(updatedTasksList);
            setEditedTasks(updatedTasksList);
            console.log("Successfully updated task");
            setIsEditing(false); // Exit edit mode after saving
            setIsViewMode(true); // Switch to view mode after save
            setSelectedTaskName(null); // Clear selected task name to remove radio button
            fetchTasks();
        } catch (error) {
            console.error("Error saving task:", error);
            setError("Failed to save task. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setSelectedTask(null); // Close the form without saving
        setIsEditing(false); // Exit edit mode
        setIsViewMode(true); // Ensure the form is in view mode after cancel
        setSelectedTaskName(null); // Clear selected task name
    };

    return (
        <div className="task-popup-overlay">
            <div className="task-popup">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <h2>{category} Tasks</h2>
                {error && <div className="error-message">{error}</div>}
                {isSaving ? (
                    <p>Saving tasks...</p>
                ) : isEditing ? ( // Display form if editing
                    <EditTaskForm
                        task={selectedTask}
                        onSave={handleSaveTask}
                        onCancel={handleCancelEdit}
                    />
                ) : (
                    tasks && tasks.length > 0 ? (
                        <>
                            <table className="task-table">
                                <thead>
                                    <tr>
                                        {isEditMode && !isDeleteMode && !isViewMode && <th>Select</th>}
                                        {!isEditMode && isDeleteMode && !isViewMode && <th>Select</th>}
                                        
                                        <th>Task Name</th>
                                        <th>Description</th>
                                        <th>Created On</th>
                                        <th>Deadline</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {editedTasks.map((task) => (
                                        <tr
                                            key={task.taskName}
                                        >

                                            {isEditMode && !isDeleteMode && !isViewMode && (
                                                <td>
                                                    <input
                                                        type="radio"
                                                        checked={task.taskName === selectedTaskName} // Check radio button based on taskName
                                                        onChange={() => handleSelectTask(task.taskName)}
                                                    />
                                                </td>
                                            )}
                                            {isDeleteMode && !isEditMode && (
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedTaskNames.includes(task.taskName)}  // If the task is selected for deletion
                                                        onChange={() => handleCheckboxChange(task.taskName)}  // Select this task for deletion
                                                    />
                                                </td>
                                            )}
                                            <td>{task.taskName}</td>
                                            <td>{task.description}</td>
                                            <td>{task.createdOn}</td>
                                            <td>{task.deadline}</td>
                                            <td>{task.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            { isDeleteMode && (
                                <div className="delete-button-container">
                                <button
                                    onClick={openConfirmModal}
                                    className="delete-task-button"
                                >
                                    Delete
                                </button>
                            </div>
                            )}
                            


                            {/* Show the "Select" button after selecting a task */}
                            {selectedTaskName && !isViewMode && (
                                <div className="select-button-container">
                                    <button
                                        onClick={handleOpenEditForm}
                                        className="select-task-button"
                                    >
                                        Select
                                    </button>
                                </div>
                            )}
                        </>
                    ):(
                        <div className="no-tasks">No tasks available</div>
                    )
                )}
            </div>

            {showConfirmModal && (
                <div className="confirm-modal-overlay">
                    <div className="confirm-modal">
                        <p>Are you sure you want to delete the selected tasks?</p>
                        <button className="confirm-button" onClick={handleDeleteConfirm}>
                            Yes
                        </button>
                        <button className="cancel-button" onClick={handleDeleteCancel}>
                            No
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskDetailsPopup;
