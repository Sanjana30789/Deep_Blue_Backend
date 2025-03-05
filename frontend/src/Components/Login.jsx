import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginDetails({ ...loginDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", loginDetails);

      if (response.data.user_id) {
        localStorage.setItem("user_id", response.data.user_id);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("isChairRegistered", response.data.isChairRegistered ? "true" : "false");
 // Store chair status

        alert("Login successful!");

        // Redirect based on chair registration status
        if (response.data.isChairRegistered) {
          navigate("/dashboard"); // Go to dashboard if chair is registered
        } else {
          navigate("/chair-registration"); // Go to chair registration if not registered
        }
      } else {
        alert("Login failed, user_id missing!");
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.containers}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.heading}>Login</h2>
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
          <button type="submit" style={styles.button}>Login</button>
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
};
