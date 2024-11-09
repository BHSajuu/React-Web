import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import FormPage from "./pages/FormPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ShowPage from "./pages/ShowPage";
import Signup from "./pages/Signup";
function App() {
  return (
    <main>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/show" element={<ShowPage />} />
        <Route path="/form" element={<FormPage />} />
      </Routes>
    </main>
  );
}

export default App;
