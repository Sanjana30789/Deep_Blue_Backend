import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginDetails({ ...loginDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        loginDetails
      );

      if (response.data.user_id) {
        localStorage.setItem("user_id", response.data.user_id);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("profilePic", response.data.profilePic || "default.jpg");
        localStorage.setItem("isChairRegistered", response.data.isChairRegistered);

        alert("Login successful!");

        // Redirect based on chair registration status
        if (response.data.isChairRegistered) {
          navigate("/dashboard"); // Redirect to dashboard if registered
        } else {
          navigate("/chair-registration"); // Redirect to chair registration page if not registered
        }
      } else {
        setError("Login failed, user_id missing!");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.containers}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.heading}>Login</h2>
          {error && <p style={styles.error}>{error}</p>}
          {profilePic && (
            <img src={profilePic} alt="Profile" style={styles.profilePic} />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #4f46e5, #9333ea)",
  },
  containers: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: "400px",
    padding: "20px",
    background: "white",
    borderRadius: "15px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    flexDirection: "column",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  input: {
    width: "90%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#9333ea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
  },
  profilePic: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    marginBottom: "15px",
  },
};
