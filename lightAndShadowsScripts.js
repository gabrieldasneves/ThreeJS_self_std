const scene = new THREE.Scene();
scene.background = new THREE.Color("#993399");

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1, 5);
camera.lookAt(0, 0, 0);

// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // activates shadows
document.getElementById("canvas").appendChild(renderer.domElement);

// ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// directional light (sunlight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// cube 1 (green)
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
scene.add(cube);

// cube 2 (light yellow)
const geometry2 = new THREE.BoxGeometry(1, 1, 1);
const material2 = new THREE.MeshStandardMaterial({ color: 0xeeff00 });
const cube2 = new THREE.Mesh(geometry2, material2);
cube2.position.x = 2;
cube2.castShadow = true;
scene.add(cube2);

// plane (ground)
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
plane.receiveShadow = true;
scene.add(plane);

// animation loop
function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.2;

  cube2.rotation.y += 0.2;

  renderer.render(scene, camera);
}

animate();
