import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import * as GUI from "@babylonjs/gui";

// -------------------------
// CANVAS
// -------------------------
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

// -------------------------
// ENGINE
// -------------------------
const engine = new BABYLON.Engine(canvas, true);

// -------------------------
// SCENE
// -------------------------
const scene = new BABYLON.Scene(engine);

scene.clearColor = new BABYLON.Color4(
  0.05,
  0.05,
  0.08,
  1
);

// -------------------------
// GUI
// -------------------------
const gui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

// -------------------------
// CAMERA
// -------------------------
const camera = new BABYLON.ArcRotateCamera(
  "camera",
  Math.PI / 2,
  Math.PI / 3,
  15,
  new BABYLON.Vector3(0, 2, 0),
  scene
);

camera.attachControl(canvas, true);

// -------------------------
// LIGHT
// -------------------------
new BABYLON.HemisphericLight(
  "light",
  new BABYLON.Vector3(0, 1, 0),
  scene
);

// -------------------------
// GROUND
// -------------------------
BABYLON.MeshBuilder.CreateGround(
  "ground",
  {
    width: 12,
    height: 12
  },
  scene
);

// -------------------------
// METAL ROD
// -------------------------
const rod = BABYLON.MeshBuilder.CreateCylinder(
  "rod",
  {
    height: 8,
    diameter: 0.5
  },
  scene
);

// horizontal rod
rod.rotation.z = Math.PI / 2;

rod.position.y = 2;

const rodMat = new BABYLON.StandardMaterial(
  "rodMat",
  scene
);

rodMat.diffuseColor = new BABYLON.Color3(
  0.7,
  0.7,
  0.7
);

rod.material = rodMat;

// -------------------------
// HEATER
// -------------------------
const heater = BABYLON.MeshBuilder.CreateBox(
  "heater",
  {
    width: 1,
    height: 1,
    depth: 1
  },
  scene
);

heater.position.x = -4.5;
heater.position.y = 2;

const heaterMat = new BABYLON.StandardMaterial(
  "heaterMat",
  scene
);

heaterMat.diffuseColor = new BABYLON.Color3(
  1,
  0,
  0
);

heater.material = heaterMat;

// -------------------------
// COOLER
// -------------------------
const cooler = BABYLON.MeshBuilder.CreateBox(
  "cooler",
  {
    width: 1,
    height: 1,
    depth: 1
  },
  scene
);

cooler.position.x = 4.5;
cooler.position.y = 2;

const coolerMat = new BABYLON.StandardMaterial(
  "coolerMat",
  scene
);

coolerMat.diffuseColor = new BABYLON.Color3(
  0,
  0,
  1
);

cooler.material = coolerMat;

// -------------------------
// TITLE
// -------------------------
const title = new GUI.TextBlock();

title.text = "THERMAL CONDUCTIVITY SIMULATION";
title.color = "white";
title.fontSize = 28;
title.top = "-320px";

gui.addControl(title);

// -------------------------
// GRAPH PANEL
// -------------------------
const graphRect = new GUI.Rectangle();

graphRect.width = "300px";
graphRect.height = "220px";

graphRect.cornerRadius = 10;

graphRect.color = "white";
graphRect.thickness = 2;

graphRect.background = "black";

graphRect.top = "-40px";
graphRect.left = "-420px";

gui.addControl(graphRect);

// graph title
const graphTitle = new GUI.TextBlock();

graphTitle.text = "TEMPERATURE DATA";
graphTitle.color = "white";
graphTitle.fontSize = 20;

graphTitle.top = "-80px";

graphRect.addControl(graphTitle);

// -------------------------
// LIVE DATA TEXT
// -------------------------
const graphData = new GUI.TextBlock();

graphData.text = "";

graphData.color = "lime";

graphData.fontSize = 16;

graphData.textHorizontalAlignment =
  GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;

graphData.textVerticalAlignment =
  GUI.Control.VERTICAL_ALIGNMENT_TOP;

graphData.paddingLeft = "20px";

graphData.top = "20px";

graphRect.addControl(graphData);

// -------------------------
// SENSOR ARRAYS
// -------------------------
const sensors: BABYLON.Mesh[] = [];
const labels: GUI.TextBlock[] = [];

// temperatures
let temps = [100, 90, 80, 70, 60, 50, 40, 30, 25];

let simulationRunning = true;

// conductivity
let conductivity = 0.08;

// -------------------------
// CREATE SENSORS
// -------------------------
for (let i = 0; i < 9; i++) {

  const sensor = BABYLON.MeshBuilder.CreateSphere(
    "sensor" + i,
    {
      diameter: 0.22
    },
    scene
  );

  sensor.position.x = -4 + i;
  sensor.position.y = 2;

  const smat = new BABYLON.StandardMaterial(
    "smat" + i,
    scene
  );

  smat.diffuseColor = new BABYLON.Color3(
    1,
    1,
    0
  );

  sensor.material = smat;

  sensors.push(sensor);

  // labels
  const label = new GUI.TextBlock();

  label.text = temps[i] + "°C";
  label.color = "white";
  label.fontSize = 16;

  label.top = (-160 + i * 35) + "px";
  label.left = "350px";

  gui.addControl(label);

  labels.push(label);
}

// -------------------------
// HEAT PARTICLES
// -------------------------
const particleSystem = new BABYLON.ParticleSystem(
  "particles",
  2000,
  scene
);

particleSystem.particleTexture =
  new BABYLON.Texture(
    "https://playground.babylonjs.com/textures/flare.png",
    scene
  );

particleSystem.emitter = heater;

particleSystem.minEmitBox =
  new BABYLON.Vector3(0, 0, 0);

particleSystem.maxEmitBox =
  new BABYLON.Vector3(0, 0, 0);

particleSystem.color1 =
  new BABYLON.Color4(1, 0.5, 0, 1);

particleSystem.color2 =
  new BABYLON.Color4(1, 0, 0, 1);

particleSystem.colorDead =
  new BABYLON.Color4(0, 0, 1, 0);

particleSystem.minSize = 0.1;
particleSystem.maxSize = 0.3;

particleSystem.minLifeTime = 1;
particleSystem.maxLifeTime = 2;

particleSystem.emitRate = 500;

particleSystem.direction1 =
  new BABYLON.Vector3(4, 0, 0);

particleSystem.direction2 =
  new BABYLON.Vector3(6, 0, 0);

particleSystem.minEmitPower = 1;
particleSystem.maxEmitPower = 3;

particleSystem.gravity =
  new BABYLON.Vector3(0, 0, 0);

particleSystem.start();

// -------------------------
// MATERIAL TITLE
// -------------------------
const materialText = new GUI.TextBlock();

materialText.text = "SELECT MATERIAL";
materialText.color = "white";
materialText.fontSize = 22;

materialText.top = "180px";

gui.addControl(materialText);

// -------------------------
// COPPER BUTTON
// -------------------------
const copperBtn = GUI.Button.CreateSimpleButton(
  "copperBtn",
  "COPPER"
);

copperBtn.width = "120px";
copperBtn.height = "40px";

copperBtn.color = "white";
copperBtn.background = "orange";

copperBtn.top = "230px";
copperBtn.left = "-140px";

gui.addControl(copperBtn);

copperBtn.onPointerClickObservable.add(() => {

  conductivity = 0.15;

  rodMat.diffuseColor =
    new BABYLON.Color3(1, 0.5, 0);
});

// -------------------------
// IRON BUTTON
// -------------------------
const ironBtn = GUI.Button.CreateSimpleButton(
  "ironBtn",
  "IRON"
);

ironBtn.width = "120px";
ironBtn.height = "40px";

ironBtn.color = "white";
ironBtn.background = "gray";

ironBtn.top = "230px";

gui.addControl(ironBtn);

ironBtn.onPointerClickObservable.add(() => {

  conductivity = 0.08;

  rodMat.diffuseColor =
    new BABYLON.Color3(0.7, 0.7, 0.7);
});

// -------------------------
// STEEL BUTTON
// -------------------------
const steelBtn = GUI.Button.CreateSimpleButton(
  "steelBtn",
  "STEEL"
);

steelBtn.width = "120px";
steelBtn.height = "40px";

steelBtn.color = "white";
steelBtn.background = "darkblue";

steelBtn.top = "230px";
steelBtn.left = "140px";

gui.addControl(steelBtn);

steelBtn.onPointerClickObservable.add(() => {

  conductivity = 0.03;

  rodMat.diffuseColor =
    new BABYLON.Color3(0.4, 0.4, 0.5);
});

// -------------------------
// START BUTTON
// -------------------------
const startBtn = GUI.Button.CreateSimpleButton(
  "startBtn",
  "START"
);

startBtn.width = "120px";
startBtn.height = "40px";

startBtn.color = "white";
startBtn.background = "green";

startBtn.top = "300px";
startBtn.left = "-80px";

gui.addControl(startBtn);

startBtn.onPointerClickObservable.add(() => {

  simulationRunning = true;

  particleSystem.start();
});

// -------------------------
// PAUSE BUTTON
// -------------------------
const pauseBtn = GUI.Button.CreateSimpleButton(
  "pauseBtn",
  "PAUSE"
);

pauseBtn.width = "120px";
pauseBtn.height = "40px";

pauseBtn.color = "white";
pauseBtn.background = "red";

pauseBtn.top = "300px";
pauseBtn.left = "80px";

gui.addControl(pauseBtn);

pauseBtn.onPointerClickObservable.add(() => {

  simulationRunning = false;

  particleSystem.stop();
});

// -------------------------
// HEAT SIMULATION
// -------------------------
scene.onBeforeRenderObservable.add(() => {

  if (!simulationRunning) return;

  const newTemps = [...temps];

  for (let i = 1; i < temps.length - 1; i++) {

    newTemps[i] =
      temps[i] +
      conductivity *
      (
        temps[i - 1] +
        temps[i + 1] -
        2 * temps[i]
      );
  }

  // fixed temperatures
  newTemps[0] = 100;
  newTemps[8] = 25;

  temps = newTemps;

  // update sensors
  for (let i = 0; i < sensors.length; i++) {

    const t = temps[i] / 100;

    const mat =
      sensors[i].material as BABYLON.StandardMaterial;

    mat.diffuseColor = new BABYLON.Color3(
      t,
      0,
      1 - t
    );

    labels[i].text =
      "T" +
      (i + 1) +
      " : " +
      temps[i].toFixed(1) +
      "°C";
  }

  // rod color
  const mid = temps[4] / 100;

  (
    rod.material as BABYLON.StandardMaterial
  ).diffuseColor =
    new BABYLON.Color3(
      mid,
      0,
      1 - mid
    );

  // graph data
  graphData.text =
    "T1 : " + temps[0].toFixed(1) + "°C\n\n" +
    "T2 : " + temps[2].toFixed(1) + "°C\n\n" +
    "T3 : " + temps[4].toFixed(1) + "°C\n\n" +
    "T4 : " + temps[6].toFixed(1) + "°C\n\n" +
    "T5 : " + temps[8].toFixed(1) + "°C";
});

// -------------------------
// RENDER LOOP
// -------------------------
engine.runRenderLoop(() => {
  scene.render();
});

// -------------------------
// RESIZE
// -------------------------
window.addEventListener("resize", () => {
  engine.resize();
});