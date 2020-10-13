// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
global.THREE = require("three");

const bla = require("three/examples/js/loaders/GLTFLoader");

console.log(bla);

export class GLTFResolver {
    constructor() {
        this.type = "gltf";
        this.loader = new THREE.GLTFLoader();
    }

    resolve(item) {
        return new Promise((resolve) => {
            this.loader.load(item.url, (scene) => {
                resolve(Object.assign(item, { scene }));
            });
        });
    }

    get(item) {
        return item.scene;
    }
}
