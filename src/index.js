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
import { sample } from "lodash";
import BasicLights from "./objects/Lights.js";

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");
require("three/examples/js/loaders/GLTFLoader");

const canvasSketch = require("canvas-sketch");

const settings = {
    // Make the loop animated
    animate: true,
    // Get a WebGL canvas rather than 2D
    context: "webgl",
    dimensions: "a5",
    pixelsPerInch: 300,
    units: "cm",
};

const SETTINGS = {
    useComposer: true,
};
const DEVELOPMENT = false;
let renderer;
let isVisible = false;
let composer;
let stats;
let camera;
let scene;
let controls;
let lights;
let container;
let customObjects = [];
let customObjectsCounter = 0;

const sketch = ({ context }) => {
    /* Custom settings */
    window.addEventListener("mousemove", onMousemove);
    window.addEventListener("dblclick", cycleObject);

    /* Init renderer and canvas */
    container = document.body;
    renderer = new THREE.WebGLRenderer({
        canvas: context.canvas,
    });
    container.style.overflow = "hidden";
    container.style.margin = 0;
    container.appendChild(renderer.domElement);

    // WebGL background color

    renderer.setClearColor("#000", 1);

    // Setup a camera

    /* Main scene and camera */
    scene = new Scene();
    // camera = new PerspectiveCamera(
    //     15,
    //     window.innerWidth / window.innerHeight,
    //     0.1,
    //     1000
    // );

    camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
    camera.position.set(0, 0, -4);
    camera.lookAt(new THREE.Vector3());

    // camera.position.set(-3, 0, 0);
    // camera.lookAt(new Vector3(-1, 0, 0));

    controls = new OrbitControls(camera);
    camera.position.z = 10;
    // camera.position.x = -5;
    // camera.lookAt(new Vector3(-5, 0, 0));
    controls.enableDamping = true;
    controls.dampingFactor = 0.5;
    controls.start();
    // controls.target.set(-5, 0, 0);

    initPostProcessing();

    /* Lights */
    lights = new BasicLights();
    let head, crab, spiral;

    /* Preloader */
    preloader.init(
        new ImageResolver(),
        new GLTFResolver(),
        new TextureResolver()
    );
    preloader
        .load([
            {
                id: "head",
                type: "gltf",
                url: "src/assets/models/head.gltf",
            },
            {
                id: "crab",
                type: "gltf",
                url: "src/assets/models/mr-crabs.gltf",
            },
            {
                id: "spiral",
                type: "gltf",
                url: "src/assets/models/spiral.gltf",
            },
            {
                id: "env",
                type: "texture",
                url: "src/assets/textures/g20-experimente_texture_3.jpg",
            },
        ])
        .then(() => {
            /* Actual content of the scene */

            customObjects.push(new Head());
            customObjects.push(new Crab());
            customObjects.push(new Spiral());

            customObjectsCounter = Math.floor(
                Math.random() * customObjects.length
            );

            scene.add(customObjects[customObjectsCounter], lights);
            setSceneRandomRotation()
        });

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

            if (SETTINGS.useComposer) {
                composer.render();
            } else {
                renderer.clear();
                renderer.render(scene, camera);
            }
        },
        // Dispose of events & renderer for cleaner hot-reloading
        unload() {
            controls.dispose();
            renderer.dispose();
        },
    };
};

function cycleObject() {
    scene.children
        .filter((el) => el.children[0].isCustomObject)
        .forEach((el) => {
            scene.remove(el);
        });
    customObjectsCounter++;

    if (customObjectsCounter >= customObjects.length) customObjectsCounter = 0;

    scene.add(customObjects[customObjectsCounter]);
}

canvasSketch(sketch, settings);

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
  UPDATE
*/
function setSceneRandomRotation() {
    //
    // scene.rotation.x = Math.random * Math.PI * 2;
    scene.rotation.y = Math.random() * Math.PI * 2;
    // scene.rotation.z = Math.random * Math.PI * 2;
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

function degrees_to_radians(degrees) {
    return degrees * (Math.PI / 180);
}
