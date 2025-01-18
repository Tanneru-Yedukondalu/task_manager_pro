import React, { useEffect, useState } from "react";
import { fetchAllTasks } from "../../api";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Form from "../Form/Form"; // Import the form component
import "./KanbanBoard.css";


const KanbanBoard = ({ onClose }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null); // State for the selected user
  const [openTaskDialog, setOpenTaskDialog] = useState(false); // For task dialog visibility


  useEffect(() => {
    const getTasks = async () => {
      try {
        const fetchedTasks = await fetchAllTasks();

        if (Array.isArray(fetchedTasks)) {
          setTasks(fetchedTasks);
        } else {
          setTasks([]);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error loading tasks:", error);
      }
    };

    getTasks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleAddTaskClick = (username, userId) => {
    console.log(`Thanks for clicking! Will implement soon for ${username}.`);
    console.log("selected username", username);
    console.log("selected userId", userId);  // Log to make sure the userId is correct
  
    setSelectedUser(username);
    setSelectedUserId(userId);  // Set the selected userId
    setOpenTaskDialog(true);     // Open the task form dialog
  };
  

  const tasksByUser = tasks.reduce((acc, task) => {
    const { username, role, user_id } = task;  // Ensure user_id is included
    if (!acc[username]) {
      acc[username] = { role, user_id, tasks: [] };  // Store user_id here
    }
    acc[username].tasks.push(task);
    return acc;
  }, {});
  

  return (
    <div className="kanban-board-overlay">
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
       {/* Display the form to add a task for the selected user */}
       {openTaskDialog && <Form selectedUser={selectedUser} selectedUserId={selectedUserId}/>}
    </div>
  );
};

export default KanbanBoard;
