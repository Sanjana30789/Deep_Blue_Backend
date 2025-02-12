import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Dashboard from "./Components/DataDisplay";
import PieChartPage from './Components/Piechart'
import HealthPage from './Components/HealthPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/piechart" element={<PieChartPage />} />
        <Route path="/health" element={<HealthPage />} />
      </Routes>
    </Router>
  );
}

export default App;
