import {
    Object3D,
    EquirectangularReflectionMapping,
    MeshLambertMaterial,
    MeshStandardMaterial,
    LineDashedMaterial,
    // MeshNormalMaterial,
} from "three";
import { preloader } from "../loader";

export default class Torus extends Object3D {
    constructor() {
        super();

        // this.scale.setScalar(0.125);
        this.position.y = -2;
        // this.rotation.y = -1
        this.rotation.y = Math.PI * -0.5;

        const crab = preloader.get("crab");
        const envMap = preloader.get("env");
        // envMap.mapping = EquirectangularReflectionMapping
        envMap.mapping = EquirectangularReflectionMapping;

        let mat = new LineDashedMaterial({
            color: 0xff0000,
            // linewidth: 0.01,
            // scale: 0.11,
            // dashSize: 3,
            // gapSize: 3,
        });
        // mat.roughness = 0;
        // mat.metalness = 1;
        mat.wireframe = true;
        // mat.envMap = preloader.get("env");
        // mat.envMapIntensity = 1;

        crab.scene.children[0].material = mat;
        crab.scene.name = "Crab";
        crab.scene.isCustomObject = true;

        this.add(crab.scene);
    }
}
