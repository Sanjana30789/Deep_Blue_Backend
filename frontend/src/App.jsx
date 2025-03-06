import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Dashboard from "./Components/DataDisplay";
import PieChartPage from './Components/Piechart';
import LandingPage from './Components/landing';
import HealthPage from './Components/HealthPage';
import Analytics from './Components/Analytics';
import AIRecommendation from './Components/AI'

import ChairRegistration from './Components/chairRegister'
import UserProfile from './Components/UserProfile';
import AboutUs from './Components/AboutUs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/piechart" element={<PieChartPage />} />
        <Route path="/health" element={<HealthPage />} />
        <Route path="/analysis" element={<Analytics />} />
        <Route path="/ai" element={<AIRecommendation />} />
        <Route path="/chair-registration" element={<ChairRegistration />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </Router>
  );
}

export default App;
