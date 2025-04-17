// Remove imports and use global THREE object
const loader = new THREE.GLTFLoader();

const scene = new THREE.Scene();
const sky = new THREE.Sky();
sky.scale.setScalar(10000);
scene.add(sky);

const sun = new THREE.Vector3();
const effectController = {
  turbidity: 10,
  rayleigh: 2,
  mieCoefficient: 0.005,
  mieDirectionalG: 0.8,
  elevation: 2,
  azimuth: 180
};

const uniforms = sky.material.uniforms;
uniforms['turbidity'].value = effectController.turbidity;
uniforms['rayleigh'].value = effectController.rayleigh;
uniforms['mieCoefficient'].value = effectController.mieCoefficient;
uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
const theta = THREE.MathUtils.degToRad(effectController.azimuth);
sun.setFromSphericalCoords(1, phi, theta);
uniforms['sunPosition'].value.copy(sun);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById("canvas").appendChild(renderer.domElement);

// Add window resize handler
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

//activates controls with mouse
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 10;

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444,1)
scene.add(hemiLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(3, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
scene.add(directionalLight);

// Adiciona um plano como chão
const planeGeometry = new THREE.PlaneGeometry(25, 25);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xc1936b,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;

plane.receiveShadow = true;
scene.add(plane);
console.log("Iniciando carregamento do modelo...");

loader.load(
  "littlefoot.glb",
  function (gltf) {
    console.log("Modelo carregado com sucesso!");
    const model = gltf.scene;

    // Ajusta o tamanho do modelo
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 3 / maxDim;
    model.scale.set(scale, scale, scale);

    // Centraliza o modelo
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center.multiplyScalar(scale));
    model.position.y = 1.4;

    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        console.log("Mesh encontrado:", child.name);
      }
    });
    scene.add(model);
    console.log("Modelo adicionado à cena com posição:", model.position);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.error("Erro ao carregar modelo:", error);
  }
);

// loader for grass
loader.load("old_tree.glb", function (gltf) {
    const gramaModel = gltf.scene;
  
    for (let i = 0; i < 10; i++) {
      const clone = gramaModel.clone();
      clone.position.set(
        Math.random() * 20 - 10, 
        0,
        Math.random() * 20 - 10 
      );
      clone.rotation.y = Math.random() * Math.PI * 2;
      clone.scale.set(1, 1, 1);
      scene.add(clone);
    }
  });


  loader.load("simple_grass_chunks.glb", function (gltf) {
    const gramaModel = gltf.scene;
  
    const spacing = 2; // Espaçamento entre cada instância
    const half = 25 / 2;
  
    for (let x = -half; x < half; x += spacing) {
      for (let z = -half; z < half; z += spacing) {
        const clone = gramaModel.clone();
        clone.position.set(x + 1 , 0, z + 1);
        clone.rotation.y = Math.random() * Math.PI * 2;
        clone.scale.set(3, 0.1, 3);
        scene.add(clone);
      }
    }
  });

// loader for fern
loader.load("fern.glb", function (gltf) {
    const gramaModel = gltf.scene;
  
    for (let i = 0; i < 20; i++) {
      const clone = gramaModel.clone();
      clone.position.set(
        Math.random() * 20 - 10, 
        0,
        Math.random() * 20 - 10 
      );
      clone.rotation.y = Math.random() * Math.PI * 2;
      clone.scale.set(0.2, 0.3, 0.2);
      scene.add(clone);
    }
  });
  

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
