import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import gsap, { Circ } from "gsap";

// Debug
const gui = new dat.GUI();
gui.hide();

// Canvas
const canvas = document.querySelector("canvas.webgl");

const params = {
  bgColor: "#fcfcfc",
  //   bgColor: "#222244",
};

const animation = {
  introCompleted: false,
};

const cursor = {
  x: 0,
  y: 0,
};

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(params.bgColor);
gui
  .addColor(params, "bgColor")
  .onChange(() => {
    scene.background.set(params.bgColor);
  })
  .name("Background Color");

// Textures
// const textureLoader = new THREE.TextureLoader();
// const matcapTexture = textureLoader.load("/textures/matcaps/9.png");

const meshes = new Array();

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
      bevelThickness: 0.04,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    }
  );
  textGeometry.center();

  const material = new THREE.MeshNormalMaterial();
  //   const material = new THREE.MeshMatcapMaterial();
  //   material.matcap = matcapTexture;
  material.wireframe = false;
  gui.add(material, "wireframe").name("Wireframe");

  const text = new THREE.Mesh(textGeometry, material);
  const torus = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);
  const box = new THREE.BoxBufferGeometry(1, 1, 1);
  const amplitude = 30;

  scene.add(text);
  for (let i = 0; i < 500; i++) {
    const objectGeometry = i % 2 ? torus : box;
    const mesh = new THREE.Mesh(objectGeometry, material);

    // Position
    mesh.position.x = (Math.random() - 0.5) * amplitude;
    mesh.position.y = (Math.random() - 0.5) * amplitude;
    mesh.position.z = (Math.random() - 0.5) * amplitude;

    // Rotation
    mesh.rotation.x = Math.random() * Math.PI * 2;
    mesh.rotation.y = Math.random() * Math.PI * 2;

    // Scale
    const scale = Math.random();
    mesh.scale.set(scale, scale, scale);
    meshes.push(mesh);
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

window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = -(e.clientY / sizes.height - 0.5);
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 1;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = false;
controls.minDistance = 0.01;
controls.maxDistance = 20;
controls.enabled = false;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Introduction;
gsap.from(camera.position, {
  duration: 3,
  x: -48,
  y: 16,
  z: 50,
  ease: Circ.easeOut,
  delay: 1,
  onComplete: () => {
    animation.introCompleted = true;
    controls.enabled = true;
  },
});

const tick = () => {
  if (animation.introCompleted) {
    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 10;
    camera.position.y = Math.sin(cursor.y * Math.PI * 2) * 10;
    // Update controls
    controls.update();
  }
  meshes.map((mesh) => {
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.005;
  });

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
