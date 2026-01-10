//setting up the scene, camera, renderer, controls, lights
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PlanetsInformation } from './planetsInformation.js'

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement)

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(-30, 50, -80)
renderer.render(scene, camera);


const controls = new OrbitControls(camera, renderer.domElement);

const pointLight = new THREE.AmbientLight(0xffffff);
pointLight.position.set(0, 0, 0);
pointLight.intensity = 2;
pointLight.castShadow = true;

const ambientLight = new THREE.AmbientLight(0xffffff);
const PointLightHelper = new THREE.PointLightHelper(pointLight);

scene.add(PointLightHelper);
scene.add(pointLight);
// scene.add(ambientLight);

const backgrounTexture = new THREE.TextureLoader().load('./textures/space.jpg');
scene.background = backgrounTexture;
scene.backgroundIntensity = 0.6;

// crating panets
const normalTexture = new THREE.TextureLoader().load('./textures/normal_map.jpg');

// sun
const sunTexture = new THREE.TextureLoader().load('./textures/sun.jpg');
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(15, 32, 16),
  new THREE.MeshStandardMaterial({ map: sunTexture })
)
scene.add(sun);

//mercury
const mercuryTexture = new THREE.TextureLoader().load('./textures/mercury.jpg');
const mercury = new THREE.Mesh(
  new THREE.SphereGeometry(5, 32, 16),
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
const venusTexture = new THREE.TextureLoader().load('./textures/venus.jpg')
const venus = new THREE.Mesh(
  new THREE.SphereGeometry(6, 32, 16),
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
const earthTexture = new THREE.TextureLoader().load('./textures/earth.jpeg');
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(5, 32, 16),
  new THREE.MeshStandardMaterial({ map: earthTexture })
)
const earthOrbit = new THREE.Group();
earthOrbit.add(earth);
earth.position.set(70, 0, 0);
sun.add(earthOrbit);

function earthOrbitFunc(time) {
  earthOrbit.rotation.y += time;
  earth.rotation.y += 0.003;
  moonOrbitFunc(0.01);
}

//moon
const moonTexture = new THREE.TextureLoader().load('./textures/moon.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(2, 32, 16),
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
const marsTexture = new THREE.TextureLoader().load('./textures/mars.jpg');
const mars = new THREE.Mesh(
  new THREE.SphereGeometry(4, 32, 16),
  new THREE.MeshStandardMaterial({ map: marsTexture, normalMap: normalTexture })
)
const marsOrbit = new THREE.Group();
marsOrbit.add(mars);
mars.position.set(90, 0, 0);
sun.add(marsOrbit);

function marsOrbitFunc(time) {
  marsOrbit.rotation.y += time;
}

//jupiter
const jupiterTexture = new THREE.TextureLoader().load('./textures/jupiter.jpg');
const jupiter = new THREE.Mesh(
  new THREE.SphereGeometry(7, 32, 16),
  new THREE.MeshStandardMaterial({ map: jupiterTexture })
)
const jupiterRingTexture = new THREE.TextureLoader().load('./textures/jupiter_ring.jpg');
const jupiterRing = new THREE.Mesh(
  new THREE.RingGeometry(9, 12, 32),
  new THREE.MeshStandardMaterial({
    map: jupiterRingTexture,
    side: THREE.DoubleSide
  })
)
const jupiterOrbit = new THREE.Group();
jupiterOrbit.add(jupiter);
jupiter.add(jupiterRing);
jupiter.position.set(115, 0, 0);
jupiterRing.rotation.x = Math.PI / 2;
sun.add(jupiterOrbit)

function jupiterOrbitFunc(time) {
  jupiterOrbit.rotation.y += time;
}

//saturn
const saturnTexture = new THREE.TextureLoader().load('./textures/saturn.jpg')
const saturn = new THREE.Mesh(
  new THREE.SphereGeometry(4, 32, 16),
  new THREE.MeshStandardMaterial({ map: saturnTexture })
)
const saturnOrbit = new THREE.Group();
saturnOrbit.add(saturn);
saturn.position.set(140, 0, 0);
sun.add(saturnOrbit)

function saturnOrbitFunc(time) {
  saturnOrbit.rotation.y += time;
}

//uranus
const uranusTexture = new THREE.TextureLoader().load('./textures/uranus.jpg');
const uranus = new THREE.Mesh(
  new THREE.SphereGeometry(5, 32, 16),
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
const neptuneTexture = new THREE.TextureLoader().load('./textures/neptune.jpg')
const neptune = new THREE.Mesh(
  new THREE.SphereGeometry(5, 32, 16),
  new THREE.MeshStandardMaterial({ map: neptuneTexture })
)
const neptuneOrbit = new THREE.Group();
neptuneOrbit.add(neptune)
neptune.position.set(180, 0, 0)
sun.add(neptuneOrbit)

function neptuneOrbitFunc(time) {
  neptuneOrbit.rotation.y += time;
}


function lineGenerator(lines) {
  const ul = document.createElement('ul');
  lines.forEach((line) => {
    const div = document.createElement('div');
    ul.append(div)
    div.classList.add("list-item");
    const li = document.createElement('li');
    div.append(li);
    const Content = document.createElement('li');
    Content.innerText = line
    div.append(Content)
  })
  return ul
}

function getFacts(facts) {
  const ul = document.createElement('ul');
  facts.forEach((fact) => {
    const div = document.createElement('div');
    ul.append(div)
    div.classList.add("list-item");
    const li = document.createElement('li');
    div.append(li);
    const Content = document.createElement('li');
    Content.innerText = fact
    div.append(Content)
  })
  return ul
}


const planetInformationCard = document.getElementById('information-box-container');

function displayCard(planetName) {
  planetInformationCard.innerHTML = `
  <div class='card' style="background-image: url('/planets/${planetName}.jpg')">
  <h1 class='planet_name'> ${planetName} </h1>
  <div class='card-discription'>
  <div class='lines'></div>
  <h2>Facts</h2>
  <div class='facts'></div>
  </div>
  </div>`

  const quickInformation = lineGenerator(PlanetsInformation[planetName].lines)
  document.querySelector('.lines').appendChild(quickInformation)
  const facts = getFacts(PlanetsInformation[planetName].facts)
  document.querySelector('.facts').appendChild(facts)
}


// created raycaster 
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function myfnc(e) {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObjects(scene.children, true)
  
 function planetClickedFunc (planet){
      displayCard(planet)
    }
    
  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;

   

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

window.addEventListener('click', myfnc, false)

function orbitRingsFunc(radius, orbit) {
  const orbitRing = new THREE.Mesh(
    new THREE.TorusGeometry(radius, 0, 1, radius ** 2),
    new THREE.MeshBasicMaterial({
      color: 0x444444,
      wireframe: true,
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

async function animate(time) {
  requestAnimationFrame(animate);

  mercuryOrbitFunc(0.003);
  venusOrbitFunc(0.002);
  earthOrbitFunc(0.001);
  marsOrbitFunc(0.0008);
  jupiterOrbitFunc(0.0006);
  saturnOrbitFunc(0.0004);
  uranusOrbitFunc(0.0003);
  neptuneOrbitFunc(0.0002);

  controls.update();
  renderer.render(scene, camera);

}

animate();