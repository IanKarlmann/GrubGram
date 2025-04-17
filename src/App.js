import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SetupProfile from "./pages/SetupProfile"; 
import MealLog from "./pages/MealLog";
import "./App.css";

function Navbar() {
  const navigate = useNavigate();

  const handleBack = () => {
    const currentPath = window.location.pathname;

    if (currentPath === "/home") {
      // Prevent navigating back to the login page
      navigate("/home");
    } else if (window.history.length > 1) {
      navigate(-1); // Go back to the previous page
    } else {
      navigate("/home"); // Fallback to the homepage
    }
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="nav-buttons">
      <button className="back-btn" onClick={handleBack}>
        Back
      </button>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("token"); // Check if JWT exists
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function ProfileSetupRoute({ children }) {
  const userId = localStorage.getItem("userId"); // Check if user has completed Step 2
  return userId ? children : <Navigate to="/setup-profile" />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, []);

  return (
    <BrowserRouter>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/setup-profile" element={<SetupProfile />} /> 

        {/* Ensure only users who have set up their profile can access protected pages */}
        <Route path="/home" element={<ProtectedRoute><ProfileSetupRoute><Home /></ProfileSetupRoute></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><ProfileSetupRoute><Account /></ProfileSetupRoute></ProtectedRoute>} />
        <Route path="/meallog" element={<ProtectedRoute><ProfileSetupRoute><MealLog /></ProfileSetupRoute></ProtectedRoute>} />

        {/* Redirect to home if authenticated, otherwise login */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;