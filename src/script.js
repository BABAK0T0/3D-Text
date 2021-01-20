import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

const params = {
  bgColor: "#fcfcfc",
  //   bgColor: "#152959",
};

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(params.bgColor);
gui.addColor(params, "bgColor").onChange(() => {
  scene.background.set(params.bgColor);
});

// Textures
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/9.png");

// Fonts
const fontLoader = new THREE.FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new THREE.TextBufferGeometry(
    "Creative\nDeveloper\nBased in Paris",
    {
      font: font,
      size: 0.5,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    }
  );
  textGeometry.center();

  //   const material = new THREE.MeshNormalMaterial();
  const material = new THREE.MeshMatcapMaterial();
  material.matcap = matcapTexture;
  material.wireframe = false;
  gui.add(material, "wireframe");

  const text = new THREE.Mesh(textGeometry, material);
  const torus = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);
  const box = new THREE.BoxBufferGeometry(1, 1, 1);
  const amplitude = 30;

  scene.add(text);
  for (let i = 0; i < 500; i++) {
    const objectGeometry = i % 2 === 1 ? torus : box;
    const mesh = new THREE.Mesh(objectGeometry, material);

    // Position
    mesh.position.x = (Math.random() - 0.5) * amplitude;
    mesh.position.y = (Math.random() - 0.5) * amplitude;
    mesh.position.z = (Math.random() - 0.5) * amplitude;

    // Rotation
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;

    // Scale
    const scale = Math.random();
    mesh.scale.set(scale, scale, scale);

    scene.add(mesh);
  }
});

// Sizes
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

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update camera
  camera.position.x = Math.sin(elapsedTime * 0.5);
  camera.position.y = Math.cos(elapsedTime * 0.5);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
