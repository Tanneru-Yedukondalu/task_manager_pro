import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import userImage from "../../assets/welcome.png"
import star from "../../assets/star.png"
import ChatBox from "../ChatBox/ChatBox";


const Home = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [tasksByCategory, setTasksByCategory] = useState({});
    const [isSettingsClicked, setIsSettingsClicked] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [isShaking, setIsShaking] = useState(false);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const loggedInUsername = localStorage.getItem("username");
    const [isKanbanOpen, setIsKanbanOpen] = useState(false);
    // const navigate = useNavigate();


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

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);  // Toggle chatbox open/close
    };


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



    const refreshTasks = () => {
        fetchTasks(); // Re-fetch tasks after a new task is added
      };

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        console.log("Fetching tasks...");
        try {
            const data = await fetchTasksFromBackend();
            const categorizedTasks = data.reduce((acc, task) => {
                // Group tasks by status first
                const statusCategory = task.status || "Uncategorized";
                acc[statusCategory] = acc[statusCategory] || [];
                acc[statusCategory].push(task);

                // Then group tasks by category
                acc[task.category] = acc[task.category] || [];
                acc[task.category].push(task);

                return acc;
            }, {});

            setTasksByCategory(categorizedTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };








    return (
        <div className="app">
            <Header />

            <div className={`body ${isFormOpen ? "blur-background" : ""}`}>
                <div className="y">
                    <div className="z">
                        <div className="ea">
                            <div className="fa">
                                <div className="bold">Welcome To Task Manager Pro</div>
                                <img
                                    src={userImage} // Replace with your image path
                                    alt="User"
                                    className="user-image"
                                />
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

                        <div className="category-wrap" >
                            <TaskCategory
                                handleCardClick={handleCardClick}
                                category="Completed"
                                title="Completed"
                                tasks={tasksByCategory["Completed"]}

                            />
                        </div>
                    </div>

                    <div className="z">
                        <div className="category-wrapper" >
                            <TaskCategory
                                handleCardClick={handleCardClick}
                                category="Important"
                                title="Important"
                                tasks={tasksByCategory["Important"]}
                            // isShaking={isShaking}
                            />
                        </div>
                        <div className="category-wrapper" >
                            <TaskCategory
                                title="Work"
                                handleCardClick={handleCardClick}

                                category="Work"
                                tasks={tasksByCategory["Work"]}
                                isShaking={isShaking}
                            />
                        </div>
                        <div className="category-wrapper" >
                            <TaskCategory
                                title="Personal"
                                handleCardClick={handleCardClick}
                                category="Personal"
                                tasks={tasksByCategory["Personal"]}
                                isShaking={isShaking}
                            />
                        </div>
                    </div>


                    <div className="z">
                        <div className="category-wrap" >
                            <TaskCategory
                                handleCardClick={handleCardClick}
                                category="Others"
                                title="Others"
                                tasks={tasksByCategory["Others"]}
                                isShaking={isShaking}

                            />
                        </div>
                        <div className="ea">
                            <div className="fa">
                                <div className="bold">All the best...🎉✨</div>
                                <img
                                    src={star} // Replace with your image path
                                    alt="User"
                                    className="user-image"
                                />
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
                                        <div className="block bottom-left" onClick={toggleChat}>
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
                    setIsDeleteMode={setIsDeleteMode}


                />
            )}

            {/* Chatbox component */}
            <ChatBox isOpen={isChatOpen} toggleChat={toggleChat} username={loggedInUsername} />


            {isKanbanOpen && (
          <KanbanBoard onClose={toggleKanban} onTaskAdded={refreshTasks} />
        )}


        </div>
    );
};

export default Home;
