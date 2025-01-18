import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import "./App.css";
import Home from './components/Home/Home';
import SignupForm from './components/SignUp/SignUp';
import LoginForm from './components/Login/Login';


//implement public and private routes later
const App = () => {
  return(
  <div className='app-main-container'>
    <BrowserRouter>
      <Routes>
        <Route
        path = "/home"
        element={
          <Home/>
        }
        />
        <Route
        path = "/signup"
        element={
          <SignupForm/>
        }
        />
        <Route
        path = "/"
        element={
          <LoginForm/>
        }
        />
      </Routes>
    </BrowserRouter>
   </div>
  )
};

export default App;