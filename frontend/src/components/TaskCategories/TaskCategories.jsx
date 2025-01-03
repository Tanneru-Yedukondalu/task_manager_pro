import React from "react";
import TaskCategory from "../TaskCategory/TaskCategory";

const TaskCategories = ({ tasksByCategory, handleCardClick, isShaking }) => {
    return (
        <div className="z">
            {["Completed", "Important", "Work", "Personal"].map((category) => (
                <div className="category-wrapper" onClick={() => handleCardClick(category)} key={category}>
                    <TaskCategory
                        title={category}
                        tasks={tasksByCategory[category]}
                        isShaking={isShaking}
                    />
                </div>
            ))}
        </div>
    );
};

export default TaskCategories;
