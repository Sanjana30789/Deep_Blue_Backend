import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

Modal.setAppElement("#root"); // Prevents accessibility warning

const SittingPopup = ({ isOpen, onClose, relaxationTime }) => {
  const [timeLeft, setTimeLeft] = useState(relaxationTime);

  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, timeLeft]);

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="modal">
      <div className="popup-container">
        <h2>Time to Stretch!</h2>
        <p>Perform the following exercises to relax:</p>
        <ul>
          <li>Neck Rolls</li>
          <li>Shoulder Shrugs</li>
          <li>Back Stretches</li>
          <li>Leg Extensions</li>
        </ul>

        <div className="countdown-container">
          <CircularProgressbar
            value={(timeLeft / relaxationTime) * 100}
            text={`${timeLeft}s`}
            styles={buildStyles({
              textColor: "#fff",
              pathColor: "red",
              trailColor: "grey",
              strokeLinecap: "round",
            })}
          />
        </div>

        <button onClick={onClose} className="close-btn">
          Close
        </button>
      </div>
    </Modal>
  );
};

export default SittingPopup;
