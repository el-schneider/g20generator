// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

import {
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    PointLight,
    AmbientLight,
    Vector3,
} from "three";

import {
    EffectComposer,
    BloomEffect,
    // SMAAEffect,
    RenderPass,
    EffectPass,
} from "postprocessing";

import Spiral from "./objects/Spiral";
import Crab from "./objects/Crab";
import Head from "./objects/Head";
import OrbitControls from "./controls/OrbitControls";
import { preloader } from "./loader";
import { TextureResolver } from "./loader/resolvers/TextureResolver";
import { ImageResolver } from "./loader/resolvers/ImageResolver";
import { GLTFResolver } from "./loader/resolvers/GLTFResolver";

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");
require("three/examples/js/loaders/GLTFLoader");

const canvasSketch = require("canvas-sketch");

const settings = {
    // Make the loop animated
    animate: true,
    // Get a WebGL canvas rather than 2D
    context: "webgl",
};

const sketch = ({ context }) => {
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: context.canvas,
    });

    // WebGL background color
    renderer.setClearColor("#000", 1);

    // Setup a camera
    const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
    camera.position.set(0, 0, -4);
    camera.lookAt(new THREE.Vector3());

    // Setup camera controller
    const controls = new THREE.OrbitControls(camera, context.canvas);

    // Setup your scene
    const scene = new THREE.Scene();

    // Setup a geometry
    const geometry = new THREE.SphereGeometry(1, 32, 16);

    // Setup a material
    const material = new THREE.MeshBasicMaterial({
        color: "red",
        wireframe: true,
    });

    // Setup a mesh with geometry + material
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // draw each frame
    return {
        // Handle resize events here
        resize({ pixelRatio, viewportWidth, viewportHeight }) {
            renderer.setPixelRatio(pixelRatio);
            renderer.setSize(viewportWidth, viewportHeight, false);
            camera.aspect = viewportWidth / viewportHeight;
            camera.updateProjectionMatrix();
        },
        // Update & render your scene here
        render({ time }) {
            controls.update();
            renderer.render(scene, camera);
        },
        // Dispose of events & renderer for cleaner hot-reloading
        unload() {
            controls.dispose();
            renderer.dispose();
        },
    };
};

canvasSketch(sketch, settings);

// import "./style.css";
import BasicLights from "./objects/Lights.js";

/* Custom settings */
const SETTINGS = {
    useComposer: true,
    maxResolutionLongSide: 1280,
};
const DEVELOPMENT = false;

let isVisible = false;
let composer;
let stats;

/* Init renderer and canvas */
const leftCanvas = document.getElementById("g20-left");
const container = document.body;
const renderer = new WebGLRenderer({ canvas: leftCanvas });

renderer.setClearColor(0x000000, 1);

/* Main scene and camera */
const scene = new Scene();
let camera = new PerspectiveCamera(
    15,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// camera.position.set(-3, 0, 0);
// camera.lookAt(new Vector3(-1, 0, 0));

const controls = new OrbitControls(camera);
camera.position.z = 10;
// camera.position.x = -5;
// camera.lookAt(new Vector3(-5, 0, 0));
controls.enableDamping = true;
controls.dampingFactor = 0.5;
controls.start();
// controls.target.set(-5, 0, 0);

/* Lights */
const lights = new BasicLights();
let head, crab, spiral;

/* Various event listeners */
window.addEventListener("resize", onResize);
window.addEventListener("mousemove", onMousemove);
window.addEventListener("deviceorientation", onOrientation, true);

/* Preloader */
preloader.init(new ImageResolver(), new GLTFResolver(), new TextureResolver());
preloader
    .load([
        // {
        //     id: "searchImage",
        //     type: "image",
        //     url: SMAAEffect.searchImageDataURL,
        // },
        // { id: "areaImage", type: "image", url: SMAAEffect.areaImageDataURL },
        {
            id: "head",
            type: "gltf",
            url: "assets/models/head.gltf",
        },
        {
            id: "crab",
            type: "gltf",
            url: "assets/models/mr-crabs.gltf",
        },
        {
            id: "spiral",
            type: "gltf",
            url: "assets/models/spiral.gltf",
        },
        {
            id: "env",
            type: "texture",
            url: "assets/textures/g20-experimente_texture_3.jpg",
        },
    ])
    .then(() => {
        initPostProcessing();
        onResize();
        animate();

        /* Actual content of the scene */

        head = new Head();
        crab = new Crab();
        spiral = new Spiral();
        scene.add(_.sample([head]), lights);
    });

/* some stuff with gui */
if (DEVELOPMENT) {
    const guigui = require("guigui");
    guigui.add(SETTINGS, "useComposer");

    const Stats = require("stats.js");
    stats = new Stats();
    stats.showPanel(0);
    container.appendChild(stats.domElement);
    stats.domElement.style.position = "absolute";
    stats.domElement.style.top = 0;
    stats.domElement.style.left = 0;
}

/* -------------------------------------------------------------------------------- */
function initPostProcessing() {
    composer = new EffectComposer(renderer);
    const bloomEffect = new BloomEffect();
    bloomEffect.intensity = 3;

    // const smaaEffect = new SMAAEffect(preloader.get('searchImage'), preloader.get('areaImage'))
    // const effectPass = new EffectPass(camera, smaaEffect, bloomEffect)
    const effectPass = new EffectPass(camera, bloomEffect);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    composer.addPass(effectPass);
    effectPass.renderToScreen = true;
}

/**
  Resize canvas
*/
function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

/**
  Mousemouve
*/
function onMousemove(e) {
    // lights.point.position.y = e.pageY
    const mouseLight1 = lights.children.find((l) => (l.name = "MouseLight1"));
    const lightPosY = (e.pageY / window.innerHeight) * -8;
    mouseLight1.position.y = lightPosY;
    const lightPosX = (e.pageX / window.innerWidth) * 8;
    mouseLight1.position.x = lightPosX;
}

/**
  UPDATE
*/
function updateScene() {
    //
    scene.rotation.y += 0.005;
}

/**
  RAF
*/
function animate() {
    window.requestAnimationFrame(animate);
    updateScene();
    render();
}

/**
  Render loop
*/
function render() {
    if (DEVELOPMENT) {
        stats.begin();
    }

    if (isVisible) {
        if (SETTINGS.useComposer) {
            composer.render();
        } else {
            renderer.clear();
            renderer.render(scene, camera);
        }
    }

    if (DEVELOPMENT) {
        stats.end();
    }
}

function checkIfIsHomepage() {
    //remove the trailing slash
    let currentUrl = window.location.href.replace(/\/+$/, "");

    if (
        currentUrl === window.location.origin ||
        currentUrl === window.location.origin + "/de"
    ) {
        // console.log("is_home")

        if (window.EventBus != undefined) {
            window.EventBus.dispatchEvent("to-home");
        }
    }
}

function degrees_to_radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}
