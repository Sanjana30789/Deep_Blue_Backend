import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css"; // Import the custom CSS file

const Settings = () => {
    const [sittingThreshold, setSittingThreshold] = useState("");
    const [relaxationTime, setRelaxationTime] = useState("");
    const [user, setUser] = useState(null);
    const [chairId, setChairId] = useState("");
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
            </div>
        </div>
    );
};

export default Settings;
