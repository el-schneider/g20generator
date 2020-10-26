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

        this.scale.setScalar(2.0);
        // this.position.y = -2.5;
        // this.position.z = 1;
        // this.rotation.x = Math.PI * -0.5;

        const wall = preloader.get("wall");
        const envMap = preloader.get("env");
        // envMap.mapping = EquirectangularReflectionMapping
        envMap.mapping = EquirectangularReflectionMapping;

        let mat = new MeshLambertMaterial({ color: 0xffffff });
        mat.roughness = 0;
        mat.metalness = 1;
        // mat.wireframe = true;
        mat.envMap = preloader.get("env");
        mat.envMapIntensity = 1;

        wall.scene.children[0].material = mat;
        wall.scene.name = "Wall";
        wall.scene.isCustomObject = true;

        this.add(wall.scene);
    }
}
