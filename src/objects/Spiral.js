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

        this.scale.setScalar(0.015);
        // this.position.y = -2.5;
        this.position.z = 5;
        this.rotation.x = Math.PI * -0.5;

        const spiral = preloader.get("spiral");
        const envMap = preloader.get("env");
        // envMap.mapping = EquirectangularReflectionMapping
        envMap.mapping = EquirectangularReflectionMapping;

        let mat = new MeshLambertMaterial({ color: 0xffffff });
        mat.roughness = 0;
        mat.metalness = 1;
        // mat.wireframe = true;
        mat.envMap = preloader.get("env");
        mat.envMapIntensity = 1;

        spiral.scene.children[0].material = mat;
        spiral.scene.name = "Spiral";
        spiral.scene.isCustomObject = true;

        this.add(spiral.scene);
    }
}
