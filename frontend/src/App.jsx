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
import uploadProfilePicture from './Components/profileupload'
import PosturePredictor from './Components/PosturePredictor'
import PostureModel from './Components/PostureModel'
// import NotificationSystem  from './Components/Notification'
import Notifications from './Components/Notification'
import AllAnalysis from './Components/Analytics'
import { div } from "three/tsl";
import Settings from "./Components/Settings";

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
        {/* <Route path="/analysis" element={<Analytics />} /> */}
        <Route path="/ai" element={<AIRecommendation />} />
        <Route path="/chair-registration" element={<ChairRegistration />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/image" element={<uploadProfilePicture />} />
        <Route path="/Posture" element={<PosturePredictor />} />
        <Route path="/analysis" element={<AllAnalysis />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/model" element={<PostureModel />} />
        <Route path="/notifications" element={<Notifications />} /> {/* ✅ Add Notifications Route */}
      </Routes>

      
           {/* <NotificationSystem />  */}
    </Router>

    
  );
}

export default App;
