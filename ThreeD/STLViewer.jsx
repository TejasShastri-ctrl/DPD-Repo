import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const STLViewer = ({ filePath }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const meshRef = useRef(null);
  const animationIdRef = useRef(null);
  const observerRef = useRef(null);
  const controlsRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize scene once
  useEffect(() => {
    const mount = mountRef.current;

    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0xf8fafc);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 100;
    controlsRef.current = controls;

    sceneRef.current.add(new THREE.AmbientLight(0x404040));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    sceneRef.current.add(directionalLight);

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      controls.update();
      if (meshRef.current) {
        meshRef.current.rotation.x += 0.005;
        meshRef.current.rotation.y += 0.005;
      }
      renderer.render(sceneRef.current, camera);
    };

    animate();

    const resizeRenderer = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    observerRef.current = new ResizeObserver(resizeRenderer);
    observerRef.current.observe(mount);

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      observerRef.current.disconnect();
      if (renderer.domElement) mount.removeChild(renderer.domElement);
      controls.dispose();
    };
  }, []);

  // Load STL file when filePath changes
  useEffect(() => {
    if (!filePath) return;

    const loader = new STLLoader();
    setIsLoading(true);
    setError(null);

    const loadModel = async () => {
      try {
        if (meshRef.current) {
          sceneRef.current.remove(meshRef.current);
          meshRef.current.geometry?.dispose();
          meshRef.current.material?.dispose();
          meshRef.current = null;
        }

        const geometry = await loader.loadAsync(filePath);

        const material = new THREE.MeshPhongMaterial({
          color: 0x0ea5e9,
          specular: 0x111111,
          shininess: 200,
        });

        const mesh = new THREE.Mesh(geometry, material);
        meshRef.current = mesh;

        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        const size = boundingBox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.0 / maxDim;

        mesh.scale.set(scale, scale, scale);
        mesh.position.sub(center.multiplyScalar(scale));
        sceneRef.current.add(mesh);

        const radius = geometry.boundingSphere ? geometry.boundingSphere.radius * scale : maxDim * scale;
        cameraRef.current.position.z = radius * 2.5;
        cameraRef.current.lookAt(0, 0, 0);
      } catch (err) {
        console.error('STL Load Error:', err);
        setError('Failed to load STL file. Check path or file format.');
      } finally {
        setIsLoading(false);
      }
    };

    loadModel();
  }, [filePath]);

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Status bar */}
      <div className="p-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-slate-800">STL Viewer</h1>
        <div className="mt-2 text-sm text-slate-600">
          {filePath ? <span>Loading from: <code>{filePath}</code></span> : "No file path provided."}
        </div>
        {isLoading && (
          <div className="mt-2 text-sky-600 flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading model...
          </div>
        )}
        {error && <div className="mt-2 text-red-500">{error}</div>}
      </div>

      {/* 3D Viewer */}
      <div className="flex justify-center items-center flex-1">
        <div
          ref={mountRef}
          className="w-[500px] h-[500px] bg-slate-100 border-4 border-grey-400 rounded-lg shadow-inner"
        />
      </div>
    </div>
  );
};

export default STLViewer;
