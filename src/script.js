import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

// door textures
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

// bricks textures
const bricksColorTexture = textureLoader.load("/textures/bricks/color.jpg");
const bricksAmbientOcclusionTexture = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);
const bricksNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
const bricksRoughnessTexture = textureLoader.load(
  "/textures/bricks/roughness.jpg"
);

// grass textures
const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
const grassAmbientOcclusionTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const grassRoughnessTexture = textureLoader.load(
  "/textures/grass/roughness.jpg"
);

// Repeat grass textures for better results
grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

/**
 * House
 */
// Temporary sphere
// House Group
const houseWidth = 4;
const houseHeight = 2.5;
const houseDepth = 4;
const roofSides = 4;
const roofHeight = 1;
const house = new THREE.Group();
scene.add(house);

// House walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(houseWidth, houseHeight, houseDepth),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
);
walls.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
); // necessary for Ambient Occlusion
walls.position.y = houseHeight / 2;
house.add(walls);

// House roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(houseHeight + roofHeight, roofHeight, roofSides),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);
roof.position.y = houseHeight + 0.5;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// House door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(houseWidth / 2 + 0.2, houseWidth / 2 + 0.2, 500, 500), // adding 100, 100 is necessary for displacementMap
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
); // necessary for Ambient Occlusion
door.position.y = houseWidth / 4;
door.position.z = houseDepth / 2 + 0.01;
house.add(door);

// House bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(1.2, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 1.5, 0.25);
bush2.position.set(1.7, 0.6, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.6, 0.4, 0.6);
bush3.position.set(-1.5, 0.1, 2.1);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.2, 0.2, 0.2);
bush4.position.set(-1.1, 0.1, 2.5);

const bush5 = new THREE.Mesh(bushGeometry, bushMaterial);
bush5.scale.set(0.2, 0.2, 0.2);
bush5.position.set(-1.4, 0.05, 2.6);

const bush6 = new THREE.Mesh(bushGeometry, bushMaterial);
bush6.scale.set(0.3, 0.3, 0.3);
bush6.position.set(-1.7, 0.05, 2.5);

house.add(bush1, bush2, bush3, bush4, bush5, bush6);

// Graveyard
const graveyard = new THREE.Group();
scene.add(graveyard);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, 0.3, z);
  grave.rotation.x = (Math.random() - 0.5) * 0.3;
  grave.rotation.y = (Math.random() - 0.5) * 0.8;
  grave.rotation.z = (Math.random() - 0.5) * 0.3;
  grave.castShadow = true;
  grave.receiveShadow = true;
  graveyard.add(grave);
}

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);
floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
); // necessary for Ambient Occlusion
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Fog
const fog = new THREE.Fog("#262837", 1, 15);
scene.fog = fog;

// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.125);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.125);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

// Light over door
const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, houseWidth / 2 + 0.2, houseDepth / 2 + 0.7);
house.add(doorLight);

const doorLightHelper = new THREE.PointLightHelper(doorLight, 0.01);
doorLightHelper.visible = false;
house.add(doorLightHelper);

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
// ghost1.position.set(2, 2, 2);
scene.add(ghost1);
const ghost1Helper = new THREE.PointLightHelper(ghost1, 0.1);
ghost1Helper.visible = true;
scene.add(ghost1Helper);

const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
// ghost2.position.set(3, 2, 3);
scene.add(ghost2);
const ghost2Helper = new THREE.PointLightHelper(ghost2, 0.1);
ghost2Helper.visible = true;
scene.add(ghost2Helper);

const ghost3 = new THREE.PointLight("#ffff00", 2, 3);
// ghost3.position.set(4, 2, 4);
scene.add(ghost3);
const ghost3Helper = new THREE.PointLightHelper(ghost3, 0.1);
ghost3Helper.visible = true;
scene.add(ghost3Helper);

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#262837");

/**
 * Shadows
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true;
doorLight.castShadow = true;

ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
walls.receiveShadow = true;

bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;
bush5.castShadow = true;

graveyard.castShadow = true;
graveyard.receiveShadow = true;

floor.receiveShadow = true;

// optimize shadows for each light
doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.y = houseHeight / 2 + Math.sin(elapsedTime * 3);
  ghost1.position.z = Math.sin(ghost1Angle) * 4;

  const ghost2Angle = -elapsedTime * 0.2;
  ghost2.position.x = Math.cos(ghost2Angle) * 8;
  ghost2.position.y =
    houseHeight / 1.2 + Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);
  ghost2.position.z = Math.sin(ghost2Angle) * 8;

  const ghost3Angle = elapsedTime * 0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (6 + Math.sin(elapsedTime * 0.32));
  ghost3.position.y =
    houseHeight / 1.2 + Math.sin(elapsedTime * 4) - Math.sin(elapsedTime * 2.5);
  ghost3.position.z = Math.sin(ghost3Angle) * (6 + Math.sin(elapsedTime * 0.5));
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
