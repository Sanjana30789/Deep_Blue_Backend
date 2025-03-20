import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import axios from "axios";
import "./finalPredictor.css"; 

const postureToAnimationMap = {
  straight: "straight",
  lean_forward: "leaning_forward",
  lean_backward: "leaning_backward",
  lean_left: "lean_left",
  lean_right: "right_lean",
  hunched: "leaning_forward",
  crossed_legs_left: "crossed_leg_left",
  crossed_legs_right: "right crossed leg",
};

const API_URL = "https://deep-blue-backend-2-lwms.onrender.com/data/PRAM";

const predictPosture = async (fsrData) => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/predict/", fsrData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.predicted_posture;
  } catch (error) {
    console.error("Error predicting posture:", error);
    return null;
  }
};

const PostureModelComponent = ({ animationName }) => {
  const gltf = useLoader(GLTFLoader, "/newanimation.gltf");
  const { scene, animations } = gltf;
  const mixerRef = useRef(null);
  const actionRefs = useRef([]);



  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && !child.material) {
        child.material = new THREE.MeshStandardMaterial({ color: "white" });
      }
    });

    if (animations.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(scene);
      actionRefs.current = animations.map((clip) => {
        const action = mixerRef.current.clipAction(clip);
        action.setLoop(THREE.LoopRepeat);
        return action;
      });

      const playAnimation = () => {
        if (!animationName) return;
        actionRefs.current.forEach((action) => action.stop());

        const matchedAnimation = animations.find(
          (clip) => clip.name === animationName
        );

        if (matchedAnimation) {
          const action = mixerRef.current.clipAction(matchedAnimation);
          action.reset().fadeIn(0.5).play();
          console.log(`✅ Playing animation: ${animationName}`);
        } else {
          console.warn(`⚠️ Animation "${animationName}" not found.`);
        }
      };

      playAnimation();
    }
  }, [scene, animations, animationName]);

  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[2, 3, 2]} intensity={2} />
      <primitive object={scene} position={[0, -1.2, 0]} scale={[2, 2, 2]} />
      <OrbitControls />
    </>
  );
};

const AnimePosture = () => {
  const [fsrValues, setFsrValues] = useState({
    fsr1: 0,
    fsr2: 0,
    fsr3: 0,
    fsr4: 0,
  });

  const [prediction, setPrediction] = useState("");
  const [animationName, setAnimationName] = useState("idle");
  const [showWarningPopup, setShowWarningPopup] = useState(false);
const [showSuccessPopup, setShowSuccessPopup] = useState(false);

useEffect(() => {
  if (prediction) {
    if (prediction === "straight") {
      setShowSuccessPopup(true);
      setShowWarningPopup(false);
      setTimeout(() => setShowSuccessPopup(false), 6000);
    } else {
      setShowWarningPopup(true);
      setShowSuccessPopup(false);
      setTimeout(() => setShowWarningPopup(false), 6000);
    }
  }
}, [prediction]);



  const fetchFSRValues = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      console.log("API Response:", data);

      if (Array.isArray(data) && data.length > 0) {
        const latestData = data[0];

        setFsrValues({
          fsr1: parseFloat(latestData.fsr1) || 0,
          fsr2: parseFloat(latestData.fsr2) || 0,
          fsr3: parseFloat(latestData.fsr3) || 0,
          fsr4: parseFloat(latestData.fsr4) || 0,
        });
      } else {
        console.error("FSR values not found in API response:", data);
      }
    } catch (error) {
      console.error("Error fetching FSR data:", error);
    }
  };

  const handlePredict = async () => {
    try {
      const result = await predictPosture(fsrValues);
      setPrediction(result || "Prediction failed.");
      setAnimationName(postureToAnimationMap[result] || "idle");
    } catch (error) {
      console.error("Error predicting posture:", error);
      setPrediction("Error in prediction.");
      setAnimationName("idle");
    }
  };

  useEffect(() => {
    fetchFSRValues();
    const interval = setInterval(fetchFSRValues, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (fsrValues.fsr1 || fsrValues.fsr2 || fsrValues.fsr3 || fsrValues.fsr4) {
      handlePredict();
    }
  }, [fsrValues]);


  
  

  return (
    <div className="posture-container">
      <div className="posture-content">
        {/* Animation on the Left */}
        <div className="animation-container">
          <Canvas camera={{ position: [0, 1.5, 4], fov: 50 }}>
            <PostureModelComponent animationName={animationName} />
          </Canvas>
        </div>

        {/* Posture Data on the Right */}
        <div className="info-container">
          <h2>Posture Prediction</h2>

          <div className="fsr-values">
            {["fsr1", "fsr2", "fsr3", "fsr4"].map((fsr, index) => (
              <div key={index} className="fsr-box">
                <strong>{fsr.toUpperCase()}:</strong> {fsrValues[fsr]}
              </div>
            ))}
          </div>

          {prediction && (
            <div className="prediction-text">Predicted Posture: {prediction}</div>
          )}

{/* Warning Popup for Incorrect Posture */}
{showWarningPopup && (
  <div className="popup-warning">
    ⚠️ Incorrect Posture Detected! Please correct your position.
  </div>
)}

{/* Success Popup for Straight Posture */}
{showSuccessPopup && (
  <div className="popup-success">
    ✅ Good Posture! Maintain it. 
  </div>
)}

        </div>
      </div>
    </div>
  );
};

export default AnimePosture;   