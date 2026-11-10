//setting up the scene, camera, renderer, controls, lights
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
import { planets } from './planetInformation.js'

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  37,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
document.body.appendChild(renderer.domElement);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(88, 65, 220);
camera.lookAt(88, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(88, 0, 0);
controls.enableDamping = true;
controls.update();

const flyControls = new FlyControls(camera, renderer.domElement);
flyControls.enabled = false;
flyControls.dragToLook = true;
flyControls.movementSpeed = 35;
flyControls.rollSpeed = 0.002;

const orbitModeButton = document.getElementById('orbit-mode');
const flyModeButton = document.getElementById('fly-mode');
const flyHelp = document.getElementById('fly-help');

orbitModeButton.addEventListener('click', () => {
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  controls.target.copy(camera.position).addScaledVector(direction, 80);
  controls.enabled = true;
  flyControls.enabled = false;
  controls.update();
  orbitModeButton.setAttribute('aria-pressed', 'true');
  flyModeButton.setAttribute('aria-pressed', 'false');
  flyHelp.hidden = true;
});

flyModeButton.addEventListener('click', () => {
  controls.enabled = false;
  flyControls.enabled = true;
  flyModeButton.setAttribute('aria-pressed', 'true');
  orbitModeButton.setAttribute('aria-pressed', 'false');
  flyHelp.hidden = false;
});

const pointLight = new THREE.PointLight(0xffd6a0, 8);
pointLight.position.set(0, 0, 0);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(pointLight);
scene.add(ambientLight);

const backgrounTexture = new THREE.TextureLoader().load('/textures/space.jpg');
scene.background = backgrounTexture;
scene.backgroundIntensity = 0.2;

// crating panets
const normalTexture = new THREE.TextureLoader().load('/textures/normal_map.jpg');

// sun
const sunTexture = new THREE.TextureLoader().load('/textures/sun.jpg');
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(15, 64, 48),
  new THREE.MeshBasicMaterial({ map: sunTexture })
)
scene.add(sun);

const glowCanvas = document.createElement('canvas');
glowCanvas.width = glowCanvas.height = 128;
const glowContext = glowCanvas.getContext('2d');
const glowGradient = glowContext.createRadialGradient(64, 64, 8, 64, 64, 64);
glowGradient.addColorStop(0, 'rgba(255, 190, 70, 0.8)');
glowGradient.addColorStop(0.35, 'rgba(255, 100, 15, 0.35)');
glowGradient.addColorStop(1, 'rgba(255, 60, 0, 0)');
glowContext.fillStyle = glowGradient;
glowContext.fillRect(0, 0, 128, 128);

const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({
  map: new THREE.CanvasTexture(glowCanvas),
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  transparent: true
}));
sunGlow.scale.set(48, 48, 1);
sunGlow.renderOrder = 1;
scene.add(sunGlow);

//mercury
const mercuryTexture = new THREE.TextureLoader().load('/textures/mercury.jpg');
const mercury = new THREE.Mesh(
  new THREE.SphereGeometry(2.5, 32, 16),
  new THREE.MeshStandardMaterial({ map: mercuryTexture })
)
const mercuryOrbit = new THREE.Group();
mercuryOrbit.add(mercury)
mercury.position.set(30, 0, 0);
sun.add(mercuryOrbit);

function mercuryOrbitFunc(time) {
  mercuryOrbit.rotation.y += time;
}

//venus
const venusTexture = new THREE.TextureLoader().load('/textures/venus.jpg')
const venus = new THREE.Mesh(
  new THREE.SphereGeometry(4, 32, 16),
  new THREE.MeshStandardMaterial({ map: venusTexture })
)
const venusOrbit = new THREE.Group()
venusOrbit.add(venus)
venus.position.set(50, 0, 0)
sun.add(venusOrbit)

function venusOrbitFunc(time) {
  venusOrbit.rotation.y += time;
}

//earth
const earthTexture = new THREE.TextureLoader().load('/textures/earth.jpg');
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(4, 64, 48),
  new THREE.MeshStandardMaterial({ map: earthTexture, roughness: 0.9 })
)
const earthOrbit = new THREE.Group();
earthOrbit.add(earth);
earth.position.set(70, 0, 0);
sun.add(earthOrbit);

function earthOrbitFunc(time) {
  earthOrbit.rotation.y += time;
  earth.rotation.y += time * 8;
  moonOrbitFunc(time * (365.256 / 27.322));
}

//moon
const moonTexture = new THREE.TextureLoader().load('/textures/moon.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(1.5, 32, 16),
  new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: normalTexture })
)

const moonOrbit = new THREE.Group();
moonOrbit.add(moon)
moonOrbit.position.set(70, 0, 0)
moon.position.set(10, 0, 0)
earthOrbit.add(moonOrbit)

function moonOrbitFunc(time) {
  moonOrbit.rotation.y += time;
  // moon.rotation.y += 0.01;
}

//mars
const marsTexture = new THREE.TextureLoader().load('/textures/mars.jpg');
const mars = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 16),
  new THREE.MeshStandardMaterial({ map: marsTexture, normalMap: normalTexture })
)
const marsOrbit = new THREE.Group();
marsOrbit.add(mars);
mars.position.set(90, 0, 0);
sun.add(marsOrbit);

function marsOrbitFunc(time) {
  marsOrbit.rotation.y += time;
}

const asteroidBelt = new THREE.Group();
const asteroidCount = 240;
const asteroidsTexture = new THREE.TextureLoader().load('/textures/asteroids.jpg');
const asteroids = new THREE.InstancedMesh(
  new THREE.IcosahedronGeometry(1, 0),
  new THREE.MeshStandardMaterial({ map: asteroidsTexture, roughness: 1 }),
  asteroidCount
);
const asteroidTransform = new THREE.Object3D();

for (let i = 0; i < asteroidCount; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 95 + Math.random() * 25;
  const size = 0.35 + Math.random() * 1.5;

  asteroidTransform.position.set(
    Math.cos(angle) * radius,
    (Math.random() - 0.5) * 4,
    Math.sin(angle) * radius
  );
  asteroidTransform.rotation.set(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  );
  asteroidTransform.scale.setScalar(size);
  asteroidTransform.updateMatrix();
  asteroids.setMatrixAt(i, asteroidTransform.matrix);
}

asteroidBelt.add(asteroids);
sun.add(asteroidBelt);

//jupiter
const jupiterTexture = new THREE.TextureLoader().load('/textures/jupiter.jpg');
const jupiter = new THREE.Mesh(
  new THREE.SphereGeometry(10, 32, 16),
  new THREE.MeshStandardMaterial({ map: jupiterTexture })
)
const jupiterOrbit = new THREE.Group();
jupiterOrbit.add(jupiter);
jupiter.position.set(115, 0, 0);
sun.add(jupiterOrbit)

function jupiterOrbitFunc(time) {
  jupiterOrbit.rotation.y += time;
}

//saturn
const saturnTexture = new THREE.TextureLoader().load('/textures/saturn.jpg')
const saturn = new THREE.Mesh(
  new THREE.SphereGeometry(7, 32, 16),
  new THREE.MeshStandardMaterial({ map: saturnTexture })
)
const saturnRing = new THREE.Mesh(
  new THREE.RingGeometry(9, 14, 96),
  new THREE.MeshBasicMaterial({
    color: 0xc3a77e,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85
  })
);
saturnRing.rotation.x = -Math.PI / 2 + 0.1;
saturnRing.rotation.z = -0.15;
saturn.add(saturnRing);
const saturnOrbit = new THREE.Group();
saturnOrbit.add(saturn);
saturn.position.set(140, 0, 0);
sun.add(saturnOrbit)

function saturnOrbitFunc(time) {
  saturnOrbit.rotation.y += time;
}

//uranus
const uranusTexture = new THREE.TextureLoader().load('/textures/uranus.jpg');
const uranus = new THREE.Mesh(
  new THREE.SphereGeometry(4.5, 32, 16),
  new THREE.MeshStandardMaterial({ map: uranusTexture })
);
const uranusOrbit = new THREE.Group();
uranusOrbit.add(uranus)
uranus.position.set(160, 0, 0)
sun.add(uranusOrbit)

function uranusOrbitFunc(time) {
  uranusOrbit.rotation.y += time;
}

//neptune
const neptuneTexture = new THREE.TextureLoader().load('/textures/neptune.jpg')
const neptune = new THREE.Mesh(
  new THREE.SphereGeometry(4.5, 32, 16),
  new THREE.MeshStandardMaterial({ map: neptuneTexture })
)
const neptuneOrbit = new THREE.Group();
neptuneOrbit.add(neptune)
neptune.position.set(180, 0, 0)
sun.add(neptuneOrbit)
mercuryOrbit.rotation.y = 0.8;
venusOrbit.rotation.y = 2.2;
earthOrbit.rotation.y = 4.7;
moonOrbit.rotation.y = 1.2;
marsOrbit.rotation.y = 1.4;
jupiterOrbit.rotation.y = 3.5;
saturnOrbit.rotation.y = 5.3;
uranusOrbit.rotation.y = 2.9;
neptuneOrbit.rotation.y = 0.2;

function neptuneOrbitFunc(time) {
  neptuneOrbit.rotation.y += time;
}


const planetInformationCard = document.getElementById('information-box-container');
function displayCard(e) {
  planetInformationCard.innerHTML = `
  <div class='card' style="background-image: url('/planets/${e}.jpg')">
  <h1 class='planet_name'> ${e} </h1>
      <div class="card-discription">
        ${planets[e].overall}
        <h2>Facts</h2>
        ${planets[e].disc}
      </div>
  </div>`
}

function displayAsteroidCard() {
  planetInformationCard.innerHTML = `
  <div class="card asteroid-card" style="background-image: url('/textures/asteroids.jpg')">
    <h1 class="planet_name">Asteroid Belt</h1>
    <div class="card-discription">
      <ul>
        <div class="list-item"><li></li><li><span>Location:</span> Between Mars and Jupiter</li></div>
        <div class="list-item"><li></li><li><span>Orbit:</span> Around the Sun</li></div>
        <div class="list-item"><li></li><li><span>Composition:</span> Rock, metal, and ice</li></div>
      </ul>
      <h2>Facts</h2>
      <ul>
        <div class="list-item"><li></li><li>The belt contains millions of objects, from dust-sized grains to dwarf planets.</li></div>
        <div class="list-item"><li></li><li>Most of its total mass is in the dwarf planet Ceres.</li></div>
        <div class="list-item"><li></li><li>Asteroids are spread across a vast region, so the belt is mostly empty space.</li></div>
      </ul>
    </div>
  </div>`;
}


// created raycaster 
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const selectableBodies = [sun, mercury, venus, earth, moon, mars, jupiter, saturn, uranus, neptune, asteroids];

function myfnc(e) {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObjects(selectableBodies, false)

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;

    if (clickedObject === asteroids) {
      displayAsteroidCard();
      return;
    }

    switch (clickedObject) {
      case sun: displayCard('sun');
        break;
      case mercury: displayCard('mercury');
        break;
      case venus: displayCard('venus');
        break;
      case earth: displayCard('earth');
        break;
      case moon: displayCard('moon');
        break;
      case mars: displayCard('mars');
        break;
      case jupiter: displayCard('jupiter');
        break;
      case saturn: displayCard('saturn');
        break;
      case uranus: displayCard('uranus');
        break;
      case neptune: displayCard('neptune');
        break;
      default:
        console.log('nothing')
        break;
    }
  }
  if (intersects.length < 1) {
    planetInformationCard.innerHTML = ''

  }
}

renderer.domElement.addEventListener('click', myfnc, false)

const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');
let speedMultiplier = Number(speedSlider.value);

speedSlider.addEventListener('input', () => {
  speedMultiplier = Number(speedSlider.value);
  speedValue.value = `${speedMultiplier.toFixed(1)}×`;
});

function orbitRingsFunc(radius, orbit) {
  const orbitRing = new THREE.Mesh(
    new THREE.RingGeometry(radius - 0.1, radius + 0.1, 256),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    })
  )
  orbitRing.rotation.x = Math.PI / 2;
  orbit.add(orbitRing);
}


orbitRingsFunc(30, mercuryOrbit)
orbitRingsFunc(50, venusOrbit)
orbitRingsFunc(70, earthOrbit)
orbitRingsFunc(90, marsOrbit)
orbitRingsFunc(10, moonOrbit)
orbitRingsFunc(115, jupiterOrbit)
orbitRingsFunc(140, saturnOrbit)
orbitRingsFunc(160, uranusOrbit)
orbitRingsFunc(180, neptuneOrbit)

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const frameTime = clock.getDelta();
  const deltaTime = frameTime * speedMultiplier;
  const earthOrbitRate = deltaTime * 0.01;

  sun.rotation.y += deltaTime * 0.025;
  mercuryOrbitFunc(earthOrbitRate * (365.256 / 87.969));
  venusOrbitFunc(earthOrbitRate * (365.256 / 224.701));
  earthOrbitFunc(earthOrbitRate);
  marsOrbitFunc(earthOrbitRate * (365.256 / 686.98));
  asteroidBelt.rotation.y += earthOrbitRate / 4.44;
  jupiterOrbitFunc(earthOrbitRate * (365.256 / 4332.59));
  saturnOrbitFunc(earthOrbitRate * (365.256 / 10759.2));
  uranusOrbitFunc(earthOrbitRate * (365.256 / 30688.5));
  neptuneOrbitFunc(earthOrbitRate * (365.256 / 60182));

  if (flyControls.enabled) flyControls.update(frameTime);
  else controls.update();
  renderer.render(scene, camera);

}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();