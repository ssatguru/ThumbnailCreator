import {
    Color3,
    Mesh,
    Scene,
    StandardMaterial,
    Vector3,
    Engine,
    ArcRotateCamera,
    HemisphericLight,
    SceneLoader,
    Tools,
    Light,
    AbstractMesh,
    BoundingInfo,
    MeshBuilder,
    Color4,
    LinesMesh
}
    from 'babylonjs';

declare var meshes: Array<string>;

import { Camera } from 'babylonjs/Cameras/camera';

export class Main {

    private createCamera(scene: Scene, canvas: HTMLCanvasElement): Camera {

        var camera = new ArcRotateCamera("Camera", Math.PI / 4, Math.PI / 4, 3, Vector3.Zero(), scene);
        camera.setTarget(Vector3.Zero());
        camera.attachControl(canvas, true);
        camera.inertia = 0.4;
        camera.wheelPrecision = camera.wheelPrecision * 3;
        camera.attachControl(canvas, true);
        return camera;

    }

    private createLight(scene: Scene): Light {
        let light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
        light.intensity = 0.7;
        return light;
    }

    private action(scene: Scene) {
        this.createPrimMaterial();
        //let ground = this.addGround(scene);
        this.drawAxis(scene, 3);
        //let box = this.addBox(scene);
        this.loadNextMesh();
    }

    xAxis: LinesMesh;
    yAxis: LinesMesh;
    zAxis: LinesMesh;

    public drawAxis(scene: Scene, l: number) {

        this.xAxis = Mesh.CreateLines("xAxis", [new Vector3(0, 0, 0), new Vector3(l, 0, 0)], scene);
        this.yAxis = Mesh.CreateLines("xAxis", [new Vector3(0, 0, 0), new Vector3(0, l, 0)], scene);
        this.zAxis = Mesh.CreateLines("xAxis", [new Vector3(0, 0, 0), new Vector3(0, 0, l)], scene);

        this.xAxis.color = new Color3(1, 0, 0);
        this.yAxis.color = new Color3(0, 1, 0);
        this.zAxis.color = new Color3(0, 0, 1);

        // xAxis.renderingGroupId = 1;
        // yAxis.renderingGroupId = 1;
        // zAxis.renderingGroupId = 1;
    }

    public addGround(scene): Mesh {
        let ground = Mesh.CreateGround("ground", 6, 6, 2, scene);
        let mat = new StandardMaterial("mat", scene);
        mat.diffuseColor = new Color3(0.5, 0.5, 0.5);
        mat.specularColor = Color3.Black();
        ground.material = mat;
        return ground;
    }

    public _addBox(scene): Mesh {
        let box = Mesh.CreateBox("box", 1, scene);
        let mat = new StandardMaterial("mat", scene);
        mat.diffuseColor = new Color3(1, 1, 0);
        box.material = mat;
        box.position.x = 2;
        box.position.z = 2;
        return box;
    }


    private primMaterial: StandardMaterial;
    private prim: Mesh = null;
    private primName: string;
    private createPrimMaterial() {
        this.primMaterial = new StandardMaterial("primMat", this.scene);
        this.primMaterial.diffuseColor = new Color3(1, 1, 1);
        this.primMaterial.specularColor = new Color3(0, 0, 0);
        this.primMaterial.backFaceCulling = false;
    }

    private createPrim() {
        if (this.prim != null) this.prim.dispose();
        if (this.prevMeshes != null) {
            this.prevMeshes.forEach(mesh => mesh.dispose());
        }
        let selection: string = document.getElementsByTagName("select")[0].value;
        this.primName = selection;
        switch (selection) {
            case "box":
                this.prim = Mesh.CreateBox("box", 1, this.scene);
                break;
            case "sphere":
                this.prim = Mesh.CreateSphere("sphere", 10, 1, this.scene);
                break;
            case "cylinder":
                this.prim = Mesh.CreateCylinder("cyl", 1, 1, 1, 20, 1, this.scene);
                break;
            case "cone":
                this.prim = Mesh.CreateCylinder("cone", 1, 0, 1, 20, 1, this.scene);
                break;
            case "torus":
                this.prim = Mesh.CreateTorus("torus", 1, 0.25, 20, this.scene);
                break;
            case "plane":
                this.prim = Mesh.CreatePlane("plane", 1.0, this.scene);
                break;
            case "disc":
                this.prim = Mesh.CreateDisc("disc", 0.5, 20, this.scene);
                break;
        }
        this.prim.material = this.primMaterial;

    }

    firstDone: boolean = false;

    axVisible: boolean = true;

    private setControls() {

        let ax: HTMLButtonElement = <HTMLButtonElement>document.getElementById("ax");
        let cl: HTMLButtonElement = <HTMLButtonElement>document.getElementById("cl");
        let ss: HTMLButtonElement = <HTMLButtonElement>document.getElementById("ss");
        let n: HTMLButtonElement = <HTMLButtonElement>document.getElementById("n");
        let p: HTMLButtonElement = <HTMLButtonElement>document.getElementById("p");
        let prims: HTMLSelectElement = <HTMLSelectElement>document.getElementById("prims");
        let primShot: HTMLButtonElement = <HTMLButtonElement>document.getElementById("primShot");


        ax.onclick = () => {
            if (this.axVisible) {
                this.xAxis.visibility = 0;
                this.yAxis.visibility = 0;
                this.zAxis.visibility = 0;
            } else {
                this.xAxis.visibility = 1;
                this.yAxis.visibility = 1;
                this.zAxis.visibility = 1;
            }
            this.axVisible = !this.axVisible;

        }

        cl.onclick = () => {
            if (!this.firstDone) {
                alert("please take initial snapshot first");
                return;
            }
            this.prevMeshes.forEach(mesh => mesh.dispose());
            this.meshNum = 1;
            window.setTimeout(this.loadAllMesh, 0);
        }
        ss.onclick = (e) => {
            Tools.CreateScreenshotUsingRenderTarget(this.engine, this.camera, 128, null, this.mimeType, null, true, meshes[this.meshNum] + this.mimeExt);
            this.firstDone = true;
        }

        primShot.onclick = (e) => {
            Tools.CreateScreenshotUsingRenderTarget(this.engine, this.camera, 128, null, this.mimeType, null, true, this.primName + this.mimeExt);
            this.firstDone = true;
        }
        n.onclick = (e) => {
            this.meshNum++;
            this.loadNextMesh();
        }
        p.onclick = (e) => {
            this.meshNum--;
            this.loadNextMesh();
        }

        prims.onchange = (e) => {
            this.createPrim();
        }

    }

    prevMeshes: AbstractMesh[];

    loadNextMesh = () => {
        if (this.meshNum >= meshes.length) {
            this.meshNum = 0;
        }
        if (this.meshNum < 0) {
            this.meshNum = meshes.length - 1;
        }

        if (this.prevMeshes != null) {
            this.prevMeshes.forEach(mesh => mesh.dispose());
        }
        if (this.prim != null) this.prim.dispose();

        console.log(this.meshNum);
        SceneLoader.ImportMesh("", "assets/", meshes[this.meshNum], this.scene, (mshes, particleSystems, skeletons) => {
            let r: number = this.getBoundingRadius(mshes);
            // console.log("r ", r);
            (<ArcRotateCamera>this.camera).radius = r < 1 ? r + 1 : 2.5 * r;
            this.prevMeshes = mshes;
        });
    }

    meshNum: number = 0;
    mimeType: string = "image/png";
    mimeExt: string = ".png";
    loadAllMesh = () => {
        if (this.meshNum >= meshes.length) return;
        //if (this.meshNum >= 30) return;
        console.log("loading next mesh " + this.meshNum + " " + meshes[this.meshNum]);

        SceneLoader.ImportMesh("", "assets/", meshes[this.meshNum], this.scene, (mshes, particleSystems, skeletons) => {
            let r: number = this.getBoundingRadius(mshes);
            // console.log("radius = " + r);
            (<ArcRotateCamera>this.camera).radius = r < 1 ? r + 1 : 2.5 * r;
            Tools.CreateScreenshotUsingRenderTarget(this.engine, this.camera, 128, null, this.mimeType, null, true, meshes[this.meshNum] + this.mimeExt);
            mshes.forEach(mesh => mesh.dispose());
            this.meshNum++;
            window.setTimeout(this.loadAllMesh, 0)
        });
    }


    /**
     * finds the bounding sphere radius for a set of meshes. for each mesh gets
     * bounding radius from the local center. this is the bounding world radius
     * for that mesh plus the distance from the local center. takes the maximum
     * of these
     * 
     * @param meshes
     * @return
     */
    private getBoundingRadius(meshes: AbstractMesh[]): number {
        var maxRadius: number = 0;
        for (let mesh of meshes) {
            console.log("mn ", mesh.name);
            var bi: BoundingInfo = mesh.getBoundingInfo();
            var rw: number = bi.boundingSphere.radiusWorld;
            // if (rw > 0) {
            //     let s: Mesh = MeshBuilder.CreateSphere("bs", { diameter: rw * 2, segments: 10 });
            //     s.position = bi.boundingSphere.centerWorld;
            //     s.visibility = 0.5;
            // }
            if (isFinite(rw)) {
                //var r: number = rw + mesh.absolutePosition.length();
                var r: number = rw + bi.boundingSphere.centerWorld.length();
                if (maxRadius < r) maxRadius = r;
            }

        }
        return maxRadius;
    }

    canvas: HTMLCanvasElement;
    engine: Engine;
    camera: Camera;
    scene: Scene;

    public main() {

        this.canvas = <HTMLCanvasElement>document.getElementById("renderCanvas");
        this.engine = new Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
        this.scene = new Scene(this.engine);
        this.scene.clearColor = new Color4(1, 1, 1, 0);
        let light = this.createLight(this.scene);
        this.camera = this.createCamera(this.scene, this.canvas);
        this.action(this.scene);

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener("resize", () => {
            //this.engine.resize();
        });


        this.setControls();

    }
}
