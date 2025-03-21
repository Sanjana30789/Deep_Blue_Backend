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
      <div style={styles.formContainer}>
        <div style={styles.logoContainer}>
          <div style={styles.logo}>SC</div>
          <h1 style={styles.logoText}>SmartChair</h1>
        </div>
        
        <h2 style={styles.heading}>Welcome Back</h2>
        <p style={styles.subheading}>Sign in to continue your comfort journey</p>
        
        {error && <div style={styles.errorContainer}>
          <p style={styles.error}>{error}</p>
        </div>}
        
        {profilePic && (
          <div style={styles.profileContainer}>
            <img src={profilePic} alt="Profile" style={styles.profilePic} />
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          
          <div style={styles.forgotPassword}>
            <a href="#" style={styles.forgotLink}>Forgot password?</a>
          </div>
          
          <button type="submit" style={loading ? {...styles.button, ...styles.buttonLoading} : styles.button}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        <div style={styles.registerPrompt}>
          Don't have an account? <a href="/signup" style={styles.registerLink}>Sign up</a>
        </div>
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
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    padding: "20px",
  },
  formContainer: {
    width: "100%",
    maxWidth: "360px", // Decreased width for a more compact form
    padding: "30px 20px", // Adjusted padding
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    backdropFilter: "blur(10px)",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px", // Reduced margin
  },
  logo: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "#764ba2",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "16px",
    marginRight: "10px",
  },
  logoText: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "700",
    color: "#333",
  },
  heading: {
    fontSize: "24px", // Decreased font size
    fontWeight: "700",
    color: "#333",
    marginBottom: "8px",
  },
  subheading: {
    fontSize: "14px", // Decreased font size
    color: "#666",
    marginBottom: "20px", // Adjusted margin
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  inputGroup: {
    marginBottom: "15px", // Adjusted margin
    textAlign: "left",
  },
  label: {
    display: "block",
    marginBottom: "6px", // Adjusted margin
    fontSize: "14px",
    fontWeight: "600",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px 14px", // Adjusted padding
    border: "1.5px solid #e1e1e1",
    borderRadius: "10px",
    fontSize: "16px",
    transition: "border-color 0.3s, box-shadow 0.3s",
    outline: "none",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px", // Adjusted padding
    marginTop: "10px",
    backgroundColor: "#764ba2",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
  },
  buttonLoading: {
    opacity: "0.8",
    cursor: "not-allowed",
  },
  errorContainer: {
    padding: "10px",
    marginBottom: "20px",
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    borderRadius: "8px",
    borderLeft: "4px solid #f44336",
  },
  error: {
    color: "#f44336",
    fontSize: "14px",
    margin: 0,
    textAlign: "left",
  },
  forgotPassword: {
    textAlign: "right",
    marginBottom: "15px", // Adjusted margin
  },
  forgotLink: {
    color: "#764ba2",
    fontSize: "14px",
    textDecoration: "none",
    transition: "color 0.3s",
  },
  profileContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  profilePic: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    border: "3px solid white",
  },
  registerPrompt: {
    marginTop: "20px", // Adjusted margin
    fontSize: "15px",
    color: "#666",
  },
  registerLink: {
    color: "#764ba2",
    fontWeight: "600",
    textDecoration: "none",
    transition: "color 0.3s",
  }
};