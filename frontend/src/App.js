import "./App.css";
import LoginSignupComponent from "./Components/LoginSignupPage";
import Dashboard from "./Components/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UpdateForm from "./Components/UpdateForm";

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
