import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", userDetails.name);
    formData.append("email", userDetails.email);
    formData.append("password", userDetails.password);
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.user_id) {
        navigate("/login");
      } else {
        setError("Signup successful but user_id missing!");
      }
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);
      setError(err.response?.data?.msg || "Signup failed");
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
        
        <h2 style={styles.heading}>Create Account</h2>
        
        {error && <div style={styles.errorContainer}>
          <p style={styles.error}>{error}</p>
        </div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
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
                placeholder="Create a password"
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Profile Picture</label>
              <div style={styles.fileInputContainer}>
                <button type="button" style={styles.fileButton}>
                  Choose File
                </button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={styles.fileInput}
                />
                <span style={styles.fileName}>
                  {profilePic ? profilePic.name.substring(0, 15) + '...' : "No file chosen"}
                </span>
              </div>
            </div>
          </div>
          
          {preview && (
            <div style={styles.previewContainer}>
              <img
                src={preview}
                alt="Profile Preview"
                style={styles.previewImage}
              />
            </div>
          )}
          
          <button type="submit" style={loading ? {...styles.button, ...styles.buttonLoading} : styles.button}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        
        <div style={styles.loginPrompt}>
          Already have an account? <a href="/login" style={styles.loginLink}>Sign in</a>
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
    padding: "10px",
  },
  formContainer: {
    width: "100%",
    maxWidth: "420px",
    padding: "25px",
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
    marginBottom: "15px",
  },
  logo: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    background: "#764ba2",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "14px",
    marginRight: "8px",
  },
  logoText: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
    color: "#333",
  },
  heading: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "15px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  formGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  inputGroup: {
    textAlign: "left",
  },
  label: {
    display: "block",
    marginBottom: "4px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid #e1e1e1",
    borderRadius: "8px",
    fontSize: "14px",
    transition: "border-color 0.3s, box-shadow 0.3s",
    outline: "none",
    boxSizing: "border-box",
  },
  fileInputContainer: {
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  fileButton: {
    padding: "8px 12px",
    backgroundColor: "#764ba2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    marginRight: "8px",
  },
  fileInput: {
    opacity: 0,
    position: "absolute",
    top: 0,
    left: 0,
    width: "110px",
    height: "100%",
    cursor: "pointer",
  },
  fileName: {
    fontSize: "13px",
    color: "#666",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "140px",
  },
  previewContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
    marginBottom: "15px",
  },
  previewImage: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    objectFit: "cover",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    border: "2px solid white",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#764ba2",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
    marginTop: "15px",
  },
  buttonLoading: {
    opacity: "0.8",
    cursor: "not-allowed",
  },
  errorContainer: {
    padding: "8px",
    marginBottom: "15px",
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    borderRadius: "6px",
    borderLeft: "3px solid #f44336",
  },
  error: {
    color: "#f44336",
    fontSize: "13px",
    margin: 0,
    textAlign: "left",
  },
  loginPrompt: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#666",
  },
  loginLink: {
    color: "#764ba2",
    fontWeight: "600",
    textDecoration: "none",
    transition: "color 0.3s",
  }
};