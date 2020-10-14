import {
    Object3D,
    EquirectangularReflectionMapping,
    MeshLambertMaterial,
    MeshStandardMaterial,
} from "three";
import { preloader } from "../loader";

export default class Torus extends Object3D {
    constructor() {
        super();

        // this.scale.setScalar(0.125);
        this.position.y = -2;
        this.rotation.y = Math.PI * -0.5;

        const head = preloader.get("head");
        const envMap = preloader.get("env");
        // envMap.mapping = EquirectangularReflectionMapping
        envMap.mapping = EquirectangularReflectionMapping;

        let mat = new MeshLambertMaterial({ color: 0xffffff });
        mat.roughness = 0;
        mat.metalness = 1;
        // mat.wireframe = true;
        mat.envMap = preloader.get("env");
        mat.envMapIntensity = 1;

        head.scene.children[0].material = mat;
        head.scene.name = "Head";
        head.scene.isCustomObject = true;

        this.add(head.scene);
    }
}
