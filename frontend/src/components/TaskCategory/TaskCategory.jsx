import React, { useState } from "react";

const TaskCategory = ({ title, tasks = [], isShaking, handleCardClick, category, isExpanded }) => {


  return (
    <div className="taskblock">
      <div
        onClick={() => handleCardClick(category)}
        className={`taskcards ${isShaking ? "shake" : ""}`}
      >
        <div className="bold">{title}</div>
        {tasks && tasks.length > 0 ? (
          <ul className="task-list">
            {tasks.slice(0, 3).map((task) => (
              <li key={task.id} className="task-item">
                {task.taskName}
              </li>
            ))}
            {/* Show 'Show more...' for tasks beyond 3 */}
            {!isExpanded && tasks.length > 3 && (
              <li style={{color:"blue", fontFamily:"cursive"}}>
                Show more...
              </li>
            )}
            {/* Show the remaining tasks when expanded */}
            {isExpanded &&
              tasks.slice(3).map((task) => (
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
