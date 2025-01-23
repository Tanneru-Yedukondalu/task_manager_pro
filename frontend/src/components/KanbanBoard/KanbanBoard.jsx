import React, { useEffect, useState } from "react";
import { fetchAllTasks, fetchTasksFromBackend } from "../../api";
import { Button } from "@mui/material";
import Modal from "../Modal/Modal"; // Import Modal
import AddIcon from "@mui/icons-material/Add";
import "./KanbanBoard.css";

const KanbanBoard = ({ onClose , onTaskAdded }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false); // For modal visibility

  // Function to fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const fetchedTasks = await fetchAllTasks();
      setTasks(Array.isArray(fetchedTasks) ? fetchedTasks : []);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);


//   const allTasks = async () => {
//     try{
//     const allTasks = await fetchTasksFromBackend();
// console.log("aaaaaaaaaaaaaaaaaaaaaaaa",allTasks);
//     }catch (error) {
//       console.error("Error loading tasks:", error);
//     }
//   }

//   useEffect(() => {
//     allTasks();
//   }, []);



 

  const handleAddTaskClick = (username, userId) => {
    setSelectedUser(username);
    setSelectedUserId(userId); // Set the selected userId
    setIsFormOpen(true); // Open the modal
  };

  // Handle closing the modal and refreshing the KanbanBoard
  const closeForm = () => {
    setIsFormOpen(false); // Close the modal
    fetchTasks(); 
    // onTaskAdded();
  // Refresh the tasks list
  };

  // Group tasks by user
  const tasksByUser = tasks.reduce((acc, task) => {
    const { username, role, user_id } = task;
    if (!acc[username]) {
      acc[username] = { role, user_id, tasks: [] };
    }
    acc[username].tasks.push(task);
    return acc;
  }, {});

  return (
    <div className="kanban-board-overlay">
      {/* Conditionally render Modal */}
      <Modal
        isFormOpen={isFormOpen}
        closeForm={closeForm}
        selectedUser={selectedUser}
        selectedUserId={selectedUserId}
      />
      
      {/* Show Kanban board only if form is not open */}
      {!isFormOpen && (
        <div className="kanban-board">
          <button className="closing-btn" onClick={onClose}>X</button>
          <h2>Tasks</h2>
          {Object.keys(tasksByUser).length === 0 ? (
            <div>No tasks found.</div>
          ) : (
            <table className="kanban-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Tasks</th>
                  <th>Deadlines</th>
                  <th>Add Task</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(tasksByUser).map(([username, data]) => (
                  <tr key={username}>
                    <td>{username}</td>
                    <td>{data.role || "Unknown Role"}</td>
                    <td>
                      <ul>
                        {data.tasks.map((task) => (
                          <li key={task.task_id}>
                            <strong>{task.taskName}</strong>: {task.description}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      <ul>
                        {data.tasks.map((task) => (
                          <li key={task.task_id}>{task.deadline}</li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      <Button
                        startIcon={<AddIcon />}
                        onClick={() => handleAddTaskClick(username, data.user_id)}
                      >
                        Add
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
