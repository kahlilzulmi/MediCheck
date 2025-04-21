import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import SignUp from "./pages/signup";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Tambahkan route lain sesuai kebutuhan */}
      </Routes>
    </Router>
  );
}

export default App;
