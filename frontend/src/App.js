import "./App.css";
import LoginSignupComponent from "./Components/MentorSide/LoginSignupPage";
import Dashboard from "./Components/MentorSide/Dashboard";
import UpdateForm from "./Components/MentorSide/UpdateForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="login" element={<LoginSignupComponent />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="update" element={<UpdateForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
