import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SettingsPage from "./ExercisePopup"; 
import "./Settings.css"; // Import the CSS file

const Settings = () => {
    const [sittingThreshold, setSittingThreshold] = useState(0);
    const [relaxationTime, setRelaxationTime] = useState(0);
    const [user, setUser] = useState(null);
    const [chairId, setChairId] = useState("");
    const [sittingTime, setSittingTime] = useState(0);
    const [showExercise, setShowExercise] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found, user not logged in.");
                    return;
                }

                const response = await fetch("http://localhost:5000/api/auth/user", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                });

                const userData = await response.json();

                if (response.ok) {
                    setUser(userData);
                    if (userData?.chair_id) {
                        setChairId(userData.chair_id);
                        fetchChairData(userData.chair_id);
                    }
                } else {
                    console.error("Error fetching user:", userData.msg);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        const fetchChairData = async (chair_id) => {
            if (!chair_id) {
                console.error("Chair ID is missing.");
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/api/chair/chair-data/${chair_id}`);
                if (!response.ok) throw new Error(`API Error: ${response.status}`);

                const data = await response.json();

                setSittingThreshold(data.sitting_threshold || 0);
                setRelaxationTime(data.relaxation_time || 0);
            } catch (error) {
                console.error("Error fetching chair data:", error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        let timer;
        if (sittingThreshold > 0) {
            timer = setInterval(() => {
                setSittingTime((prev) => {
                    if (prev + 1 >= sittingThreshold) {
                        clearInterval(timer);
                        setShowExercise(true);
                    }
                    return prev + 1;
                });
            }, 5000);
        }

        return () => clearInterval(timer);
    }, [sittingThreshold]);

    const handleUpdate = async () => {
        if (!chairId) {
            console.error("Chair ID not found, cannot update settings.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/api/chair/chair-settings/${chairId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sitting_threshold: Number(sittingThreshold),
                    relaxation_time: Number(relaxationTime)
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error updating chair settings:", errorData);
                return;
            }

            console.log("Chair settings updated successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error updating chair settings:", error);
        }
    };

    return (
        <div className="settings-container">
            <div className="settings-box">
                <h2 className="settings-title">Settings</h2>

                <div className="input-group">
                    <label className="input-label">Sitting Threshold (mins)</label>
                    <input
                        type="number"
                        className="input-field"
                        value={sittingThreshold}
                        onChange={(e) => setSittingThreshold(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Relaxation Time (mins)</label>
                    <input
                        type="number"
                        className="input-field"
                        value={relaxationTime}
                        onChange={(e) => setRelaxationTime(e.target.value)}
                    />
                </div>

                <button onClick={handleUpdate} className="update-button">
                    Update Settings
                </button>

                {showExercise && <SettingsPage onClose={() => setShowExercise(false)} />}
            </div>
        </div>
    );
};

export default Settings;
