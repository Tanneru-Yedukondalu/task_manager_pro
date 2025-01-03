import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import "./App.css";
import Home from './components/Home/Home';

//implement public and private routes later
const App = () => {
  return(
  <div className='app-main-container'>
    <BrowserRouter>
      <Routes>
        <Route
        path = "/"
        element={
          <Home/>
        }
        />
      </Routes>
    </BrowserRouter>
   </div>
  )
};

export default App;