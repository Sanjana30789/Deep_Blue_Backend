import React, { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const PostureModelComponent = () => {
  const { scene, nodes, animations } = useGLTF("/finalanimation.gltf");
  const mixerRef = useRef(null);
  const actionRefs = useRef([]);
  const indexRef = useRef(0); // Keep track of the current animation index
  const LAST_ANIMATION_DELAY = 4000; // Delay before restarting cycle

  // Define the correct order of animations (match this to your sequence)
  const animationOrder = [
    "crossed_leg_left",
    "lean_left",
    "leaning_backward",
    "leaning_forward",
    "right crossed leg",
    "right_lean",
    "sit to stand",
    "stand to sit",
    "standing idle",
    "straight",
    "stand to sit",
    "right crossed leg",
    "leaning_backward",
    "leaning_forward",
    "straight",
    "crossed_leg_left",
    "Action",
    "right_lean",
    "sit to stand"
  ];

  useEffect(() => {
    console.log("GLTF Scene:", scene);
    console.log("Nodes Available:", nodes);
    console.log("Animations Found:", animations.map((a) => a.name));

    if (animations.length > 0) {
      const modelRoot = nodes?.Armature || scene;
      mixerRef.current = new THREE.AnimationMixer(modelRoot);

      // Sort animations according to `animationOrder`
      const sortedAnimations = animationOrder
        .map(name => animations.find(a => a.name === name))
        .filter(Boolean); // Remove undefined entries if any animations are missing

      actionRefs.current = sortedAnimations.map((clip) => {
        const action = mixerRef.current.clipAction(clip);
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
        return action;
      });

      const playNextAnimation = () => {
        if (!actionRefs.current.length) return;

        // Stop all previous animations
        actionRefs.current.forEach((action) => action.stop());

        const currentIndex = indexRef.current;
        const currentAction = actionRefs.current[currentIndex];

        if (currentAction) {
          currentAction.reset().fadeIn(0.5).play();
          console.log(`✅ Playing animation: ${sortedAnimations[currentIndex].name}`);
        }

        // Move to the next animation
        indexRef.current = (currentIndex + 1) % actionRefs.current.length;

        // Set delay for next animation
        const nextDelay = sortedAnimations[currentIndex]?.duration * 1000 + 900;
        setTimeout(playNextAnimation, nextDelay);
      };

      playNextAnimation(); // Start playing animations in sequence
    }
  }, [animations, scene, nodes]);

  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 2, 2]} intensity={1} />
      <primitive object={scene} scale={1} />
      <OrbitControls />
    </>
  );
};

const PostureModel = () => {
  return (
    <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
      <PostureModelComponent />
    </Canvas>
  );
};

export default PostureModel;