import { mat4, vec3, quat, glMatrix, vec4 } from 'gl-matrix';

import { VertexBuffer, VertexBufferLayout, IndexBuffer } from './Buffer';
import { ShaderProgram } from './Shader';
import { Camera } from './Camera';

import { UpdateFunction } from './Types.d';

class Scene {

    private _dt: number;
    private _time: number;

    private _objectList: SceneObject[];
    private _lightList: Light[];

    private _camera: Camera;

    constructor(dt: number = 0.01) {
        this._dt = dt;
        this._time = 0;

        this._objectList = [];
        this._lightList = [];
    }

    addObject(object: SceneObject) {
        this._objectList.push(object);
    }

    addObjects(objects: SceneObject[]) {
        this._objectList = this._objectList.concat(objects);
    }

    addLight(light: Light) {
        this._lightList.push(light);
    }

    addLights(lights: Light[]) {
        this._lightList = this._lightList.concat(lights);
    }

    get lightList(): Light[] {
        return this._lightList;
    }

    set lightList(lightList: Light[]) {
        this._lightList = lightList;
    }

    get objectList(): SceneObject[] {
        return this._objectList;
    }

    set camera(camera: Camera) {
        this._camera = camera;
    }

    get camera(): Camera {
        return this._camera;
    }

    get dt(): number {
        return this._dt;
    }

    get time(): number {
        return this._time;
    }

    updateScene() {
        this._time += this._dt;
        
        this.camera.updateFunction && this.camera.updateFunction(this._time, this.camera);

        this.objectList.forEach((obj) => {
            obj.updateFuntion && obj.updateFuntion(this._time, obj);
        });
    }
}

class SceneObject {

    private _gl: WebGL2RenderingContext;
    private _name: string;
    private _color: vec4;

    private _vertexArrayBuffer: WebGLVertexArrayObject;
    private _vertexBuffer: VertexBuffer;
    private _vertexBufferLayout: VertexBufferLayout;

    private _indexBuffer: IndexBuffer;
    private _indicesLenth: number;

    private _translation: vec3;
    private _scale: vec3;
    private _rotation: quat;
    private _transform: mat4;

    _updateFunction: UpdateFunction;

    constructor(gl: WebGL2RenderingContext, vertices: Float32Array, layout: any,  indices: Uint32Array, color: vec4) {
        this._gl = gl;
        this._color = color;
        this._indicesLenth = indices.length;
        this._updateFunction = () => {};

        this._vertexArrayBuffer = gl.createVertexArray();
        gl.bindVertexArray(this._vertexArrayBuffer);

        this._vertexBuffer = new VertexBuffer(this._gl, vertices);
        this._vertexBufferLayout = new VertexBufferLayout(this._gl, layout);
        this._indexBuffer = new IndexBuffer(this._gl, indices);

        this._translation = [0, 0, 0];
        this._scale = [1, 1, 1];
        this._rotation = quat.create();
        this._transform = mat4.create();
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get vertexBuffer(): VertexBuffer {
        return this._vertexBuffer;
    }

    get indexBuffer(): IndexBuffer {
        return this._indexBuffer;
    }

    get vertexBufferLayout(): VertexBufferLayout {
        return this._vertexBufferLayout;
    }

    parseLayout(shaderProgram: ShaderProgram) {
        shaderProgram.parseObjectLayout(this);
    }

    set updateFuntion(updateFuntion: UpdateFunction) {
        this._updateFunction = updateFuntion;
    }

    get updateFuntion(): UpdateFunction {
        return this._updateFunction;
    }

    bind() {
        this._gl.bindVertexArray(this._vertexArrayBuffer);
        this.indexBuffer.bind();
        this.vertexBuffer.bind();
    }

    unbind() {
        this._gl.bindVertexArray(null);
        this.indexBuffer.unbind();
        this.vertexBuffer.unbind();
    }

    get color(): vec4 {
        return this._color;
    }

    set color(color: vec4) {
        this._color = color;
    }

    get indicesLenth(): number {
        return this._indicesLenth;
    }

    set translation(vec: vec3) {
        this._translation = vec;
    }

    get translation(): vec3 {
        return this._translation;
    }

    set scale(vec: vec3) {
        this._scale = vec;
    }

    get scale(): vec3 {
        return this._scale;
    }

    set rotation(vec: vec3 | quat) {
        let x = vec[0], y = vec[1], z = vec[2];

        glMatrix.toRadian(x);
        glMatrix.toRadian(y);
        glMatrix.toRadian(z);

        quat.rotateX(this._rotation, this._rotation, x);
        quat.rotateY(this._rotation, this._rotation, y);
        quat.rotateZ(this._rotation, this._rotation, z);
    }

    get rotation(): quat {
        return this._rotation;
    }

    get transform() {
        return mat4.fromRotationTranslationScale(this._transform, this.rotation, this.translation, this.scale);
    }
}

class Light {

    _position: vec3;
    _color: vec4;

    constructor(position: vec3, color: vec4) {
        this._position = position;
        this._color = color;
    }

    get position() {
        return this._position;
    }

    get color() {
        return this._color;
    }
}

export { Scene, SceneObject, Light };