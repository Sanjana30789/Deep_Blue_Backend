// // import { useState } from "react";
// // import axios from "axios";
// // import { useNavigate } from "react-router-dom";

// // export default function ChairRegistration() {
// //   const [chairDetails, setChairDetails] = useState({
// //     chair_id: "",
// //     relaxation_time: "",
// //     sitting_threshold: "",
// //     continuous_vibration: false,
// //   });

// //   const navigate = useNavigate();

// //   const handleChange = (e) => {
// //     setChairDetails({ ...chairDetails, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
  
// //     const user_id = localStorage.getItem("user_id"); // Get user ID from signup
  
// //     if (!user_id) {
// //       alert("User not logged in. Please sign up first.");
// //       return;
// //     }
  
// //     try {
// //       const chairData = { ...chairDetails, user_id }; // Add user_id to chair details
  
// //       console.log("Sending Data:", chairData); // Debugging
  
// //       await axios.post("http://localhost:5000/api/chair/register-chair", chairData);
  
// //       navigate("/login"); // Redirect to login after chair registration
// //     } catch (err) {
// //       console.error(err.response?.data?.msg || "Chair registration failed");
// //       alert(err.response?.data?.msg || "Chair registration failed");
// //     }
// //   };
  
  

// //   return (
// //     <div style={styles.pageContainer}>
// //       <div style={styles.container}>
// //         <form onSubmit={handleSubmit} style={styles.form}>
// //           <h2 style={styles.heading}>Chair Registration</h2>
// //           <input
// //             type="text"
// //             name="chair_id"
// //             placeholder="Chair ID"
// //             onChange={handleChange}
// //             required
// //             style={styles.input}
// //           />
// //           <input
// //             type="number"
// //             name="relaxation_time"
// //             placeholder="Relaxation Time (in mins)"
// //             onChange={handleChange}
// //             required
// //             style={styles.input}
// //           />
// //           <input
// //             type="number"
// //             name="sitting_threshold"
// //             placeholder="Sitting Threshold (in mins)"
// //             onChange={handleChange}
// //             required
// //             style={styles.input}
// //           />
// //           <div style={styles.checkboxContainer}>
// //             <label style={styles.checkboxLabel}>
// //               <input
// //                 type="checkbox"
// //                 name="continuous_vibration"
// //                 checked={chairDetails.continuous_vibration}
// //                 onChange={(e) => setChairDetails({ ...chairDetails, continuous_vibration: e.target.checked })}
// //                 style={styles.checkbox}
// //               />
// //               Continuous Vibration
// //             </label>
// //           </div>
// //           <button type="submit" style={styles.button}>Register Chair</button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// // const styles = {
// //   pageContainer: {
// //     display: "flex",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     height: "100vh",
// //     backgroundColor: "#f5f5f5",
// //   },
// //   container: {
// //     display: "flex",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     width: "100%",
// //     height: "80vh",
// //   },
// //   form: {
// //     display: "flex",
// //     flexDirection: "column",
// //     padding: "20px",
// //     background: "white",
// //     borderRadius: "10px",
// //     boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
// //     width: "320px",
// //   },
// //   heading: {
// //     textAlign: "center",
// //     marginBottom: "20px",
// //     color: "#333",
// //   },
// //   input: {
// //     marginBottom: "15px",
// //     padding: "10px",
// //     borderRadius: "5px",
// //     border: "1px solid #ccc",
// //     fontSize: "16px",
// //     width: "100%",
// //   },
// //   checkboxContainer: {
// //     display: "flex",
// //     alignItems: "center",
// //     marginBottom: "15px",
// //   },
// //   checkboxLabel: {
// //     fontSize: "14px",
// //     color: "#333",
// //     display: "flex",
// //     alignItems: "center",
// //     cursor: "pointer",
// //   },
// //   checkbox: {
// //     marginRight: "8px",
// //     width: "16px",
// //     height: "16px",
// //   },
// //   button: {
// //     padding: "10px",
// //     backgroundColor: "#007BFF",
// //     color: "white",
// //     border: "none",
// //     borderRadius: "5px",
// //     fontSize: "16px",
// //     cursor: "pointer",
// //   },
// // };



// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function ChairRegistration() {
//   const [chairDetails, setChairDetails] = useState({
//     chair_id: "",
//     relaxation_time: "",
//     sitting_threshold: "",
//     continuous_vibration: false,
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setChairDetails({ ...chairDetails, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const user_id = localStorage.getItem("user_id"); // Get logged-in user's ID

//     if (!user_id) {
//       alert("User not logged in. Please log in first.");
//       navigate("/login");
//       return;
//     }

//     try {
//       const chairData = { ...chairDetails, user_id }; // Link chair to user

//       await axios.post("http://localhost:5000/api/chair/register-chair", chairData);

//       alert("Chair registered successfully!");
//       navigate("/dashboard"); // Redirect to Dashboard
//     } catch (err) {
//       console.error(err.response?.data?.msg || "Chair registration failed");
//       alert(err.response?.data?.msg || "Chair registration failed");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="text" name="chair_id" placeholder="Chair ID" onChange={handleChange} required />
//       <input type="number" name="relaxation_time" placeholder="Relaxation Time (mins)" onChange={handleChange} required />
//       <input type="number" name="sitting_threshold" placeholder="Sitting Threshold (mins)" onChange={handleChange} required />
//       <label>
//         <input
//           type="checkbox"
//           name="continuous_vibration"
//           checked={chairDetails.continuous_vibration}
//           onChange={(e) => setChairDetails({ ...chairDetails, continuous_vibration: e.target.checked })}
//         />
//         Continuous Vibration
//       </label>
//       <button type="submit">Register Chair</button>
//     </form>
//   );
// }



import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ChairRegistration() {
  const [chairDetails, setChairDetails] = useState({
    chair_id: "",
    relaxation_time: "",
    sitting_threshold: "",
    continuous_vibration: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setChairDetails({ ...chairDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user_id = localStorage.getItem("user_id"); // Get logged-in user's ID

    if (!user_id) {
      alert("User not logged in. Please log in first.");
      navigate("/login");
      return;
    }

    try {
      const chairData = { ...chairDetails, user_id }; // Link chair to user

      await axios.post("http://localhost:5000/api/chair/register-chair", chairData);

      alert("Chair registered successfully!");
      navigate("/dashboard"); // Redirect to Dashboard
    } catch (err) {
      console.error(err.response?.data?.msg || "Chair registration failed");
      alert(err.response?.data?.msg || "Chair registration failed");
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.heading}>Chair Registration</h2>
          <input
            type="text"
            name="chair_id"
            placeholder="Chair ID"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="number"
            name="relaxation_time"
            placeholder="Relaxation Time (mins)"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="number"
            name="sitting_threshold"
            placeholder="Sitting Threshold (mins)"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <div style={styles.checkboxContainer}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="continuous_vibration"
                checked={chairDetails.continuous_vibration}
                onChange={(e) => setChairDetails({ ...chairDetails, continuous_vibration: e.target.checked })}
                style={styles.checkbox}
              />
              Continuous Vibration
            </label>
          </div>
          <button type="submit" style={styles.button}>Register Chair</button>
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
    background: "linear-gradient(to bottom right, #4f46e5, #9333ea)",
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
    width: "320px",
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
    width: "90%",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
  },
  checkboxLabel: {
    fontSize: "14px",
    color: "#333",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  checkbox: {
    marginRight: "8px",
    width: "16px",
    height: "16px",
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
};
