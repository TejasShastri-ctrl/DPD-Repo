import React, { useRef, useEffect, useState } from 'react';
import *                           as THREE from 'three';
import { STLLoader }               from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls }           from 'three/examples/jsm/controls/OrbitControls';

const STLViewer = ({ filePath, onClose }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const meshRef = useRef(null);
  const animationIdRef = useRef(null);
  const observerRef = useRef(null);
  const controlsRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    sceneRef.current = new THREE.Scene();
    sceneRef.current.background = new THREE.Color(0xf8fafc);

    cameraRef.current = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    cameraRef.current.position.z = 5;

    rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(rendererRef.current.domElement);

    controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
    controlsRef.current.enableDamping = true;
    controlsRef.current.dampingFactor = 0.05;
    controlsRef.current.screenSpacePanning = false;
    controlsRef.current.minDistance = 1;
    controlsRef.current.maxDistance = 100;

    sceneRef.current.add(new THREE.AmbientLight(0x404040, 2));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(1, 1, 1).normalize();
    sceneRef.current.add(directionalLight);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight2.position.set(-1, -1, -1).normalize();
    sceneRef.current.add(directionalLight2);

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      controlsRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    const resizeRenderer = () => {
      if (mount && rendererRef.current && cameraRef.current) {
        const width = mount.clientWidth;
        const height = mount.clientHeight;
        rendererRef.current.setSize(width, height);
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
      }
    };

    observerRef.current = new ResizeObserver(resizeRenderer);
    observerRef.current.observe(mount);

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      if (sceneRef.current) {
        sceneRef.current.traverse(object => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
        while(sceneRef.current.children.length > 0){
            sceneRef.current.remove(sceneRef.current.children[0]);
        }
      }
      if (rendererRef.current) {
        if (rendererRef.current.domElement && mount && mount.contains(rendererRef.current.domElement)) {
          mount.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      sceneRef.current = null;
      cameraRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!filePath || !sceneRef.current || !cameraRef.current) {
        if (meshRef.current && sceneRef.current) {
            sceneRef.current.remove(meshRef.current);
            meshRef.current.geometry?.dispose();
            meshRef.current.material?.dispose();
            meshRef.current = null;
        }
        return;
    }

    const loader = new STLLoader();
    setIsLoading(true);
    setError(null);

    const abortController = new AbortController();

    const loadModel = async () => {
      try {
        if (meshRef.current) {
          sceneRef.current.remove(meshRef.current);
          meshRef.current.geometry?.dispose();
          meshRef.current.material?.dispose();
          meshRef.current = null;
        }

        const geometry = await loader.loadAsync(filePath);

        if (abortController.signal.aborted) {
            geometry.dispose();
            return;
        }

        const material = new THREE.MeshPhongMaterial({
          color: 0x0ea5e9,
          specular: 0x111111,
          shininess: 50,
        });

        const newMesh = new THREE.Mesh(geometry, material);
        meshRef.current = newMesh;

        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox;
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        const size = boundingBox.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 2.0 / maxDim;

        newMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
        newMesh.position.sub(center.multiplyScalar(scaleFactor));
        
        sceneRef.current.add(newMesh);

        const camera = cameraRef.current;
        const modelRadius = Math.max(
            boundingBox.max.x - boundingBox.min.x,
            boundingBox.max.y - boundingBox.min.y,
            boundingBox.max.z - boundingBox.min.z
        ) * scaleFactor / 2;

        const distance = modelRadius / Math.tan(THREE.MathUtils.degToRad(camera.getEffectiveFOV() / 2));
        camera.position.set(0, 0, distance * 1.5);
        camera.lookAt(new THREE.Vector3(0,0,0));
        
        if (controlsRef.current) {
            controlsRef.current.target.set(0,0,0);
            controlsRef.current.update();
        }

      } catch (err) {
        if (err.name === 'AbortError') {
            // do nothing
        } else {
            setError('Failed to load STL file. Check path or file format.');
        }
        if (meshRef.current) {
            sceneRef.current?.remove(meshRef.current);
            meshRef.current.geometry?.dispose();
            meshRef.current.material?.dispose();
            meshRef.current = null;
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadModel();

    return () => {
      abortController.abort();
    };
  }, [filePath]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-[90vw] h-[90vh] flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-2xl z-10"
          aria-label="Close STL Viewer"
        >
          ×
        </button>

        <div className="p-4 bg-white shadow-md border-b">
          <h1 className="text-2xl font-bold text-slate-800">STL Viewer</h1>
          <div className="mt-2 text-sm text-slate-600">
            {filePath ? (
              <span>
                File: <code>{filePath.split('/').pop()}</code>
              </span>
            ) : (
              "No file selected."
            )}
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

        <div className="flex-1 bg-slate-100 relative">
          <div
            ref={mountRef}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default STLViewer;
