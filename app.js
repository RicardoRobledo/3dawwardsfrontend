/* global THREE */
const canvas = document.querySelector("#webgl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1, 6);
scene.add(camera);

const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);
const keyLight = new THREE.PointLight(0x8b5cf6, 1.2);
keyLight.position.set(4, 4, 6);
scene.add(keyLight);

const rimLight = new THREE.PointLight(0x22d3ee, 1.1);
rimLight.position.set(-5, 2, -2);
scene.add(rimLight);

const orbGeometry = new THREE.IcosahedronGeometry(1.2, 2);
const orbMaterial = new THREE.MeshStandardMaterial({
  color: 0x8b5cf6,
  emissive: 0x2d0d6a,
  metalness: 0.6,
  roughness: 0.2,
});
const orb = new THREE.Mesh(orbGeometry, orbMaterial);
scene.add(orb);

const ringGeometry = new THREE.TorusKnotGeometry(1.8, 0.08, 160, 12);
const ringMaterial = new THREE.MeshStandardMaterial({
  color: 0x38bdf8,
  metalness: 0.4,
  roughness: 0.3,
  emissive: 0x0c4a6e,
});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotation.x = Math.PI / 2;
scene.add(ring);

const shardGroup = new THREE.Group();
for (let i = 0; i < 12; i += 1) {
  const geometry = new THREE.ConeGeometry(0.12, 0.4, 5);
  const material = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    emissive: 0x9d174d,
    roughness: 0.4,
  });
  const shard = new THREE.Mesh(geometry, material);
  shard.position.set(
    Math.sin(i) * 2.4,
    Math.cos(i * 0.5) * 0.8,
    Math.cos(i) * 2.4
  );
  shard.rotation.set(Math.random(), Math.random(), Math.random());
  shardGroup.add(shard);
}
scene.add(shardGroup);

const starGeometry = new THREE.BufferGeometry();
const starCount = 600;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i += 1) {
  starPositions[i * 3] = (Math.random() - 0.5) * 40;
  starPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
  starPositions[i * 3 + 2] = (Math.random() - 0.5) * 40;
}
starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.05,
  opacity: 0.6,
  transparent: true,
});
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

const mouse = { x: 0, y: 0 };
window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
  mouse.y = (event.clientY / window.innerHeight - 0.5) * 2;
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("active", entry.isIntersecting);
    });
  },
  { threshold: 0.35 }
);

document.querySelectorAll("section, .hero-stats, .panel, .contact-card").forEach((el) => {
  el.classList.add("reveal");
  observer.observe(el);
});

const clock = new THREE.Clock();

const animate = () => {
  const elapsed = clock.getElapsedTime();
  orb.rotation.y = elapsed * 0.4 + mouse.x * 0.4;
  orb.rotation.x = elapsed * 0.2 + mouse.y * 0.4;

  ring.rotation.z = elapsed * 0.3 - mouse.x * 0.2;
  ring.rotation.x = Math.PI / 2 + mouse.y * 0.2;

  shardGroup.rotation.y = elapsed * 0.35;
  shardGroup.rotation.x = elapsed * 0.15;

  stars.rotation.y = elapsed * 0.02;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
