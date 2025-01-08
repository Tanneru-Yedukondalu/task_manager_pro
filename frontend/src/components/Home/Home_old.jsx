// import React, { useState, useEffect } from "react";
// import './Home.css';
// import HomeIcon from '@mui/icons-material/Home';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import SettingsIcon from '@mui/icons-material/Settings';
// import LogoutIcon from '@mui/icons-material/Logout';
// import AddIcon from '@mui/icons-material/Add';
// import AddBoxIcon from '@mui/icons-material/AddBox';
// import Form from "../Form/Form";


// const Home = () => {
//     const [isFormOpen, setIsFormOpen] = useState(false)
//     const [tasksByCategory, setTasksByCategory] = useState({})

//     const openForm = () => {
//         console.log("button clicked")
//         setIsFormOpen(true);
//         console.log("Form opened");
//     };
//     const closeForm = () => {
//         setIsFormOpen(false);
//         console.log("Form Closed");
//         fetchTasks();
//     };

//     const fetchTasks = async () => {
//         try {
//             const response = await fetch('http://localhost:5000/tasks');
//             const data = await response.json();
//             const categorizedTasks = data.reduce((acc, task) => {
//                 acc[task.category] = acc[task.category] || [];
//                 acc[task.category].push(task);
//                 return acc;
//             }, {});
//             setTasksByCategory(categorizedTasks);
//         } catch (error) {
//             console.error("Error fetching tasks:", error);
//         }
//     };

//     useEffect(() => {
//         fetchTasks();
//     }, []);

//     return (


//         <div className="app">
//             {/* make it a component */}
//             <div className="header">
//                 <div className="a">
//                     <div className="ab">
//                         <HomeIcon />
//                         <div> Login</div>
//                     </div>
//                 </div>

//                 <div className="b">TASK MANAGER PRO</div>

//                 <div className="c">
//                     <div className="d">
//                         <AccountCircleIcon />
//                         <div> Profile</div>
//                     </div>
//                     <div className="d">
//                         <SettingsIcon />
//                         <div> Settings </div>
//                     </div>
//                     <div className="d">
//                         <LogoutIcon />
//                         <div> Logout</div>
//                     </div>
//                 </div>
//             </div>






//             {/* make it a component */}
//             <div className={`body ${isFormOpen ? "blur-background" : ""}`}>
//                 {/* <div className="body"> */}
//                 <div className="y">
//                     <div className="z">
//                         <div className="ea">
//                             <div className="fa">
//                                 <div> Welcome To Task Manager Pro</div>
//                             </div>
//                         </div>
//                         <div className="ea">
//                             <div className="fa" onClick={openForm}>
//                                 <div> Create a TASK</div>
//                                 <div>
//                                     <AddIcon />
//                                     {/* <AddBoxIcon /> */}
//                                 </div>

//                             </div>
//                         </div>

//                         <div className="e">
//                             <div className="f">
//                                 <div className="bold">Completed</div>
//                                 {tasksByCategory["Completed"] && tasksByCategory["Completed"].length > 0 ? (
//                                     <ul className="task-list">
//                                         {tasksByCategory["Completed"].map((task) => (
//                                             <li key={task.id} className="task-item">
//                                                 {task.taskName}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 ) : (
//                                     <div className="no-tasks">No tasks Completed yet.</div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                     <div className="z">
//                     <div className="e">
//                             <div className="f">
//                                 <div className="bold">Important</div>
//                                 {tasksByCategory["Important"] && tasksByCategory["Important"].length > 0 ? (
//                                     <ul className="task-list">
//                                         {tasksByCategory["Important"].map((task) => (
//                                             <li key={task.id} className="task-item">
//                                                 {task.taskName}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 ) : (
//                                     <div className="no-tasks">No tasks available</div>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="e">
//                             <div className="f">
//                                 <div className="bold">Work</div>
//                                 {tasksByCategory["Work"] && tasksByCategory["Work"].length > 0 ? (
//                                     <ul className="task-list">
//                                         {tasksByCategory["Work"].map((task) => (
//                                             <li key={task.id} className="task-item">
//                                                 {task.taskName}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 ) : (
//                                     <div className="no-tasks">No tasks available</div>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="e">
//                             <div className="f">
//                                 <div className="bold">Personal</div>
//                                 {tasksByCategory["Personal"] && tasksByCategory["Personal"].length > 0 ? (
//                                     <ul className="task-list">
//                                         {tasksByCategory["Personal"].map((task) => (
//                                             <li key={task.id} className="task-item">
//                                                 {task.taskName}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 ) : (
//                                     <div className="no-tasks">No tasks available</div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                     <div className="z">
//                         <div className="ea">
//                             <div className="fa">
//                                 <div> Think think ....</div>
//                             </div>
//                         </div>
//                         <div className="ea">
//                             <div className="fa">
//                                 <div> All the best</div>
//                             </div>
//                         </div>
//                         <div className="ea">
//                             <div className="fa">
//                                 <div> <SettingsIcon /> </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {/* </div> */}


//             </div>
//             {/* make it a component */}
//             <div className="footer">
//                 <h3>Credits @ Tanneru Yedukondalu</h3>
//             </div>

//             {isFormOpen && (
//                 <div className="modal">
//                     <div className="modal-content">
//                         <button className="close-button" onClick={closeForm}>
//                             &times;
//                         </button>
//                         <Form />
//                     </div>
//                 </div>
//             )}


//         </div>






//     )
// }

// export default Home;

