import { Shader, ShaderProgram } from './Shader';
import { Scene, SceneObject } from './Scene';

class Renderer {

    protected _canvas: HTMLCanvasElement;
    protected _gl: WebGL2RenderingContext;
    
    private _shaderProgram: ShaderProgram;
    private _scene: Scene;
    
    constructor(canvas: HTMLCanvasElement, scene: Scene) {
        this.scene = scene;
        
        const vertCode = `
        precision mediump float;

        attribute vec3 position;
        attribute vec4 color;

        uniform mat4 transform;
        uniform mat4 perspective;
        uniform mat4 view;

        const int MAX_LIGHTS = 10;
        uniform vec3 lightPos[MAX_LIGHTS * 3];
        
        varying vec4 v_color;
        varying vec4 v_position;

        void main(void) {
            v_color = color;
            v_position = transform * vec4(position, 1.0);
            gl_Position = perspective * view * v_position;
        }
        `;
        
        const fragCode = `
        precision mediump float;

        varying vec4 v_color;
        varying vec4 v_position;

        void main(void) {
            gl_FragColor = v_color;
        }
        `;

        this._canvas = canvas;
        this._gl = canvas.getContext('webgl2');
        
        var vertexShader = new Shader(this._gl, vertCode, this.gl.VERTEX_SHADER);
        var fragmentShader = new Shader(this._gl, fragCode, this.gl.FRAGMENT_SHADER);
        this._shaderProgram = new ShaderProgram(this._gl, vertexShader, fragmentShader);

        this.setClearColor(0.55, 0.55, 0.95, 1);
        this.enable(this.gl.DEPTH_TEST);
        this.clear(this.gl.COLOR_BUFFER_BIT);
        this.setViewport();
    }

    get aspectRatio(): number {
        const { width, height } = this.canvas.getBoundingClientRect();
        return width / height;
    }

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    get gl(): WebGL2RenderingContext {
        return this._gl;
    }

    setClearColor(r: number, g: number, b: number, a: number) {
        this.gl.clearColor(r, g, b, a);
    }

    clear(flag: number) {
        this.gl.clear(flag);
    }

    enable(flag: number) {
        this.gl.enable(flag);
    }

    setViewport() {
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    set scene(scene: Scene) {
        this._scene = scene;
        
        this.scene.objectList.forEach((obj: SceneObject) => {
            obj.parseLayout(this.shaderProgram);
        });
    }

    get scene(): Scene {
        return this._scene;
    }

    set shaderProgram(shaderProgram: ShaderProgram) {
        this._shaderProgram = shaderProgram;
    } 

    get shaderProgram(): ShaderProgram {
        return this._shaderProgram;
    }

    addSceneObject(obj: SceneObject) {
        this.scene.addObject(obj);
        obj.parseLayout(this.shaderProgram);
    }

    drawScene(): void {
        this.clear(this.gl.COLOR_BUFFER_BIT);

        this.shaderProgram.useProgram();
        this.scene.updateScene();

        this.shaderProgram.setUniform4Mat("perspective", this.scene.camera.perspectiveMatrix);
        this.shaderProgram.setUniform4Mat("view", this.scene.camera.viewMatrix);

        this.scene.lightList.forEach((light, i) => {
            this.shaderProgram.setUniform3f(`lightPos[${i}]`, light.position);
        });

        this.scene.objectList.forEach((obj) => {
            obj.bind();
            this.shaderProgram.setUniform4f("color", obj.color);
            this.shaderProgram.setUniform4Mat("transform", obj.transform);
            this.drawElements(this._gl.TRIANGLES, obj.indicesLenth, this._gl.UNSIGNED_SHORT);
            obj.unbind();
        });

        // MAKES RENDERING LOOP
        requestAnimationFrame(this.drawScene.bind(this));
    }

    drawElements(mode: number, count: number, type: number) {
        this.gl.drawElements(mode, count, type, 0);
    }
}

export { Renderer };