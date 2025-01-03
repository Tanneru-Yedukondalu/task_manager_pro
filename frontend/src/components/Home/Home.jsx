import React, { useState, useEffect } from "react";
import './Home.css';
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import TaskCategory from "../TaskCategory/TaskCategory";
import Modal from "../Modal/Modal";
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FlagIcon from '@mui/icons-material/Flag';
import ChatIcon from '@mui/icons-material/Chat';
import TaskDetailsPopup from "../TaskDetailsPopup/TaskDetailsPopup";
import { fetchTasksFromBackend } from "../../api";


const Home = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [tasksByCategory, setTasksByCategory] = useState({});
    const [isSettingsClicked, setIsSettingsClicked] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [isShaking, setIsShaking] = useState(false);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);



    const openForm = () => {
        console.log("button clicked");
        setIsFormOpen(true);
        console.log("Form opened");
    };

    const closeForm = () => {
        setIsFormOpen(false);
        console.log("Form Closed");
        fetchTasks();
    };

    const handleSettingsClick = () => {
        console.log("Settings button clicked!");
        setIsSettingsClicked(!isSettingsClicked);
    }
    const handleEditClick = () => {
        console.log("edit mode turned on")
        setIsEditMode(true);
        setIsShaking(true);

    }

    const handleDeleteClick = () => {
        console.log("Delete mode turned on")
        setIsDeleteMode(true);
        setIsShaking(true);

    }
    const handleCardClick = (category) => {
        console.log("Card is selected")
        setSelectedCategory(category);
        setSelectedTasks(tasksByCategory[category] || []);
        setIsShaking(false)
    };
    const closePopup = () => {
        setSelectedCategory(null);
        setSelectedTasks([]);
        setIsEditMode(false);
        setIsDeleteMode(false);
        fetchTasks();
    };

    



    const fetchTasks = async () => {
        console.log("Fetching tasks...");
        try {
            const data = await fetchTasksFromBackend();
            const categorizedTasks = data.reduce((acc, task) => {
                const statusCategory = task.status || "Uncategorized";
                acc[statusCategory] = acc[statusCategory] || [];
                acc[statusCategory].push(task);
    
                acc[task.category] = acc[task.category] || [];
                acc[task.category].push(task);
                return acc;
            }, {});
            setTasksByCategory(categorizedTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

  
    
    

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="app">
            <Header />

            <div className={`body ${isFormOpen ? "blur-background" : ""}`}>
                <div className="y">
                    <div className="z">
                        <div className="ea">
                            <div className="fa">
                                <div className="bold">Welcome To Task Manager Pro</div>
                            </div>
                        </div>

                        <div className="ea">
                            <div className="fa" onClick={openForm}>
                                <div className="bold">Create a TASK</div>
                                <div>
                                    <AddIcon className="mui-icons" fontSize="" />
                                </div>
                            </div>
                        </div>

                        <div className="category-wrap" onClick={() => handleCardClick("Completed")}>
                            <TaskCategory
                                title="Completed"
                                tasks={tasksByCategory["Completed"]}

                            />
                        </div>
                    </div>

                    <div className="z">
                        <div className="category-wrapper" onClick={() => handleCardClick("Important")}>
                            <TaskCategory
                                title="Important"
                                tasks={tasksByCategory["Important"]}
                                isShaking={isShaking}
                            />
                        </div>
                        <div className="category-wrapper" onClick={() => handleCardClick("Work")}>
                            <TaskCategory
                                title="Work"
                                tasks={tasksByCategory["Work"]}
                                isShaking={isShaking}
                            />
                        </div>
                        <div className="category-wrapper" onClick={() => handleCardClick("Personal")}>
                            <TaskCategory
                                title="Personal"
                                tasks={tasksByCategory["Personal"]}
                                isShaking={isShaking}
                            />
                        </div>
                    </div>


                    <div className="z">
                        <div className="ea">
                            <div className="fa">
                                <div>Think think ....</div>
                            </div>
                        </div>
                        <div className="ea">
                            <div className="fa">
                                <div>All the best</div>
                            </div>
                        </div>
                        <div className="ea">
                            <div className="fa" >
                                <div
                                    style={{ position: "relative", borderRadius: "30px" }}
                                    onClick={handleSettingsClick}
                                >
                                    <SettingsIcon className="mui-icons" fontSize="" />
                                </div>

                                {/* Render the four blocks if the SettingsIcon is clicked */}
                                {isSettingsClicked && (
                                    <>
                                        <div className="block top-left" onClick={handleEditClick}>
                                            <EditIcon fontSize="large" />
                                        </div>
                                        <div className="block top-right" onClick={handleDeleteClick}>
                                            <DeleteIcon fontSize="large" />
                                        </div>
                                        <div className="block bottom-left">
                                            <ChatIcon fontSize="large" />
                                        </div>
                                        <div className="block bottom-right">
                                            <FlagIcon fontSize="large" />
                                        </div>

                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            <Modal isFormOpen={isFormOpen} closeForm={closeForm} />

            {/* Popup for displaying tasks */}
            {selectedCategory && (
                <TaskDetailsPopup
                    category={selectedCategory}
                    tasks={selectedTasks}
                    onClose={closePopup}
                    isEditMode={isEditMode}
                    fetchTasks={fetchTasks}
                    isDeleteMode={isDeleteMode}
                    setSelectedTasks={setSelectedTasks}
                    setIsDeleteMode = {setIsDeleteMode}


                />
            )}

         


        </div>
    );
};

export default Home;
