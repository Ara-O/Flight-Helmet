import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from "lil-gui";

export default function renderBurger(canvas: HTMLElement) {
  const gltfLoader = new GLTFLoader();
  const cubeTextureLoader = new THREE.CubeTextureLoader();
  /**
   * Base
   */
  // Debug
  const gui = new dat.GUI();
  const debugObject = { envMapIntensity: 0 };

  // Scene
  const scene = new THREE.Scene();

  const updateAllMaterials = () => {
    scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        // child.material.envMap = environmentMap;
        child.material.envMapIntensity = debugObject.envMapIntensity;
        child.material.needsUpdate = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  };

  //Load environment
  const environmentMap = cubeTextureLoader.load([
    "../static/images/px.jpg",
    "../static/images/nx.jpg",
    "../static/images/py.jpg",
    "../static/images/ny.jpg",
    "../static/images/pz.jpg",
    "../static/images/nz.jpg",
  ]);

  scene.background = environmentMap;
  scene.environment = environmentMap;
  debugObject.envMapIntensity = 5;
  gui
    .add(debugObject, "envMapIntensity")
    .min(0)
    .max(10)
    .step(0.001)
    .name("Env map intensity")
    .onChange(updateAllMaterials);
  //   Models
  gltfLoader.load("../static/images/FlightHelmet/FlightHelmet.gltf", (gltf) => {
    gltf.scene.scale.set(10, 10, 10);
    gltf.scene.position.set(0, -4, 0);
    gltf.scene.rotation.y = Math.PI * 0.5;
    scene.add(gltf.scene);
    gui
      .add(gltf.scene.rotation, "y")
      .min(-Math.PI)
      .max(Math.PI)
      .step(0.001)
      .name("Rotation");
  });

  //   Light
  const directionalLight = new THREE.DirectionalLight();
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.set(1024, 1024);
  directionalLight.shadow.camera.far = 15;
  directionalLight.position.set(0.25, 3, -2.25);
  scene.add(directionalLight);

  gui
    .add(directionalLight, "intensity")
    .min(0)
    .max(10)
    .step(0.001)
    .name("Light intensity");

  gui
    .add(directionalLight.position, "x")
    .min(-5)
    .max(5)
    .step(0.001)
    .name("Light intensity X");
  gui
    .add(directionalLight.position, "y")
    .min(-5)
    .max(5)
    .step(0.001)
    .name("Light intensity Y");
  gui
    .add(directionalLight.position, "z")
    .min(-5)
    .max(5)
    .step(0.001)
    .name("Light intensity Z");

  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  /**
   * Camera
   */
  // Base camera
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.set(4, 1, -4);
  scene.add(camera);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  /**
   *
   * Animate
   */
  function tick() {
    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  }

  tick();
}
