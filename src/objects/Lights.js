import {
    Group,
    SpotLight,
    PointLight,
    AmbientLight,
    HemisphereLight,
    Color,
} from "three";

export default class BasicLights extends Group {
    constructor(...args) {
        super(...args);

        const mouseLight1 = new PointLight("white", 3, 20, 0.2);
        const dir = new SpotLight(0xffffff, 1, 7, 0.8, 1, 1);
        // const ambi = new AmbientLight(0x404040, 0.5);
        // const ambi = new AmbientLight(0xff0000, 1);
        // const hemi = new HemisphereLight(0xffffbb, 0x080820, 1.15);

        dir.position.set(5, 1, 2);
        dir.target.position.set(0, 0, 0);

        mouseLight1.position.set(0, 1, 5);
        mouseLight1.name = "MouseLight1";

        // this.add(ambi, hemi, dir)
        this.add(mouseLight1, dir);
    }
}
