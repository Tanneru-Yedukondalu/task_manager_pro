import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import "./App.css";
import Home from './components/Home/Home';
import SignupForm from './components/SignUp/SignUp';
import LoginForm from './components/Login/Login';
import TimeAddingCalculator from './components/TimeCalculator/TimeCalculator';

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
        path = "/login"
        element={
          <LoginForm/>
        }
        />

<Route
        path = "/time"
        element={
          <TimeAddingCalculator/>
        }
        />
      </Routes>
    </BrowserRouter>
   </div>
  )
};

export default App;