// Importa o GLTFLoader
const loader = new THREE.GLTFLoader();

const scene = new THREE.Scene();
scene.background = new THREE.Color("#000");
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1, 3);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById("canvas").appendChild(renderer.domElement);

// Aumenta a intensidade da luz ambiente
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// Adiciona mais luzes direcionais
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight1.position.set(5, 5, 5);
directionalLight1.castShadow = true;
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(-5, 5, -5);
directionalLight2.castShadow = true;
scene.add(directionalLight2);

// Adiciona um plano como chão
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
plane.receiveShadow = true;
scene.add(plane);

console.log("Iniciando carregamento do modelo...");

loader.load(
  "toon_tree.glb",
  function (gltf) {
    console.log("Modelo carregado com sucesso!");
    const model = gltf.scene;

    // Ajusta o tamanho do modelo
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim; // Aumentou o tamanho do modelo
    model.scale.set(scale, scale, scale);

    // Centraliza o modelo
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center.multiplyScalar(scale));
    model.position.y = 0;

    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(model);
    console.log("Modelo adicionado à cena");
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.error("Erro ao carregar modelo:", error);
  }
);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
