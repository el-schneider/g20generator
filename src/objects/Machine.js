import {
    Object3D,
    EquirectangularReflectionMapping,
    MeshLambertMaterial,
    MeshStandardMaterial,
    LineDashedMaterial,
} from "three";
import { preloader } from "../loader";

export default class Torus extends Object3D {
    constructor() {
        super();

        // this.scale.setScalar(0.25);
        // this.position.y = -2.5;
        // this.position.z = 5;
        // this.rotation.x = Math.PI * -0.5;

        const machine = preloader.get("machine");
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

        let wireframeMat = new LineDashedMaterial({
            color: 0xff0000,
            linewidth: 100,
            // scale: 0.11,
            // dashSize: 3,
            // gapSize: 3,
        });
        // mat.roughness = 0;
        // mat.metalness = 1;
        wireframeMat.wireframe = true;

        console.log(machine.scene.children);

        head.scene.children[0].material = mat;
        machine.scene.children.forEach((el) => {
            el.material = wireframeMat;
        });
        machine.scene.name = "machine";
        machine.scene.isCustomObject = true;

        this.add(machine.scene);
        this.add(head.scene);
    }
}
