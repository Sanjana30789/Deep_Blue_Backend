import React, { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const PostureModelComponent = () => {
  const { scene, nodes, animations } = useGLTF("/humanposture1.gltf");
  const mixerRef = useRef(null);
  const actionRefs = useRef([]);
  const LAST_ANIMATION_DELAY = 4000; // Delay (in ms) before restarting animations

  useEffect(() => {
    console.log("GLTF Scene:", scene);
    console.log("Nodes Available:", nodes);
    console.log("Animations Found:", animations.map(a => a.name));

    if (animations.length > 0) {
      const modelRoot = nodes?.Armature || scene;
      mixerRef.current = new THREE.AnimationMixer(modelRoot);

      actionRefs.current = animations.map((clip) => {
        const action = mixerRef.current.clipAction(clip);
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
        return action;
      });

      let index = 0;
      const playNextAnimation = () => {
        if (index >= actionRefs.current.length) {
          index = 0; // Restart animations
          setTimeout(playNextAnimation, LAST_ANIMATION_DELAY); // Delay before restarting
          return;
        }

        actionRefs.current.forEach((action) => action.stop());
        const currentAction = actionRefs.current[index];

        if (currentAction) {
          currentAction.reset().fadeIn(0.5).play();
          console.log(`✅ Playing animation: ${animations[index].name}`);
        }

        index++;
        const delay = animations[index - 1]?.duration * 1000 + 900;
        setTimeout(playNextAnimation, delay);
      };

      playNextAnimation();
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