const scene = new THREE.Scene(); // create scene
scene.background = new THREE.Color("#993399");

// create cmaera (vision field, aspect, distance near far)
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//move camera ahead of the scene
camera.position.z = 5;

// create the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("canvas").appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandarMaterial({ color: 0x00ff00 }); // Verde
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.y += 0.02;

  renderer.render(scene, camera);
}

animate();
