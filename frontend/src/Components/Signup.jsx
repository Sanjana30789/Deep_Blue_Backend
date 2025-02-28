import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    profilePhoto: null, // ✅ Match backend field name
  });
  
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setUser({ ...user, profilePhoto: e.target.files[0] }); // ✅ Change profilePic to profilePhoto
  };
  

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("password", user.password);
    if (user.profilePhoto) formData.append("profilePhoto", user.profilePhoto); // ✅ Append file
  
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (res.data.profilePhoto) {
        localStorage.setItem("profilePhoto", res.data.profilePhoto); // ✅ Store URL in localStorage
      }
  
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data?.msg || "Signup failed");
      alert(err.response?.data?.msg || "Signup failed");
    }
  };
  

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <form onSubmit={handleSubmit} style={styles.form} encType="multipart/form-data">
          <h2 style={styles.heading}>Sign Up</h2>
          <input type="text" name="name" placeholder="Name" onChange={handleChange} required style={styles.input} />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required style={styles.input} />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={styles.input} />
          <input type="file" accept="image/*" onChange={handleFileChange} required /> {/* ✅ File upload */}
          <button type="submit" style={styles.button}>Sign Up</button>
          <p style={styles.loginText}>
            Already have an account?{" "}
            <span style={styles.loginLink} onClick={() => navigate("/login")}>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "80vh",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    width: "300px",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  input: {
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
  loginText: {
    textAlign: "center",
    marginTop: "10px",
    color: "#333",
    fontSize: "14px",
  },
  loginLink: {
    color: "#007BFF",
    cursor: "pointer",
    textDecoration: "underline",
  },
};
