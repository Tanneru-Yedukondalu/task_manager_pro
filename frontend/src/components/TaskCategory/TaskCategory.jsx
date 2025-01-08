import React from "react";

const TaskCategory = ({ title, tasks, isShaking, handleCardClick, category }) => {
  return (
    <div className="taskblock" >
       <div  onClick={() => handleCardClick(category)} className={`taskcards ${isShaking ? "shake" : ""}`}>
        <div className="bold">{title}</div>
        {tasks && tasks.length > 0 ? (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task-item">
                {task.taskName}
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-tasks">No tasks available</div>
        )}
      </div>
    </div>
  );
};

export default TaskCategory;
