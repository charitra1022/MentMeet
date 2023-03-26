import "./App.css";
import LoginSignupMentor from "./Components/MentorSide/LoginSignupPage";
import LoginSignupMentee from "./Components/MenteeSide/LoginSignupPage";

import DashboardMentor from "./Components/MentorSide/Dashboard";
import DashboardMentee from "./Components/MenteeSide/Dashboard";

import UpdateFormMentor from "./Components/MentorSide/UpdateForm";
import UpdateFormMentee from "./Components/MenteeSide/UpdateForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="login-mentor" element={<LoginSignupMentor />} />
        <Route path="login-mentee" element={<LoginSignupMentee />} />

        <Route path="dashboard-mentor" element={<DashboardMentor />} />
        <Route path="dashboard-mentee" element={<DashboardMentee />} />

        <Route path="update-mentor" element={<UpdateFormMentor />} />
        <Route path="update-mentee" element={<UpdateFormMentee />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
