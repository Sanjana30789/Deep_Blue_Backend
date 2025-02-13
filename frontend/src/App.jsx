import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Dashboard from "./Components/DataDisplay";
import PieChartPage from './Components/Piechart';
import LandingPage from './Components/landing';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/piechart" element={<PieChartPage />} />
      </Routes>
    </Router>
  );
}

export default App;
