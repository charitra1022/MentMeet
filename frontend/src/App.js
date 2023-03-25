import "./App.css";
import LoginSignupMentor from "./Components/MentorSide/LoginSignupPage";
import Dashboard from "./Components/MentorSide/Dashboard";
import UpdateForm from "./Components/MentorSide/UpdateForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="login-mentor" element={<LoginSignupMentor />} />
        <Route path="dashboard-mentor" element={<Dashboard />} />
        <Route path="update-mentor" element={<UpdateForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
