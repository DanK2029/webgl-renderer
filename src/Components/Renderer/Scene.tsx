import { vec3, vec4, mat4, quat, glMatrix } from 'gl-matrix';

import { VertexBuffer, IndexBuffer, VertexBufferLayout } from './Buffer';
import { ShaderProgram } from './Shader';

type UpdateFunction = (time: number, object: SceneObject | Camera) => void;

class Scene {

	private _objectList: SceneObject[];
	private _camera: Camera;
	private _backgroundColor: vec4;
	private _deltaTime: number;
	private _time: number;

	constructor(deltaTime: number) {
		this._objectList = [];
		this._deltaTime = deltaTime;
		this._time = 0;
	}

	get objectList(): SceneObject[] {
		return this._objectList;
	}

	set objectList(objectList: SceneObject[]) {
		this._objectList = objectList;
	}

	get camera(): Camera {
		return this._camera;
	}

	set camera(camera: Camera) {
		this._camera = camera;
	}

	get backgroundColor(): vec4 {
		return this._backgroundColor;
	}

	set backgroundColor(color: vec4) {
		this._backgroundColor = color;
	}

	get deltaTime(): number {
		return this._deltaTime;
	}

	set deltaTime(deltaTime: number) {
		this._deltaTime = deltaTime;
	}

	get time(): number {
		return this._time;
	}

	addObject(object: SceneObject) {
		this._objectList.push(object);
	}

	tick(): void {
		this._time += this._deltaTime;
	}

	updateFunction() {
		this.camera.updateFunction(this.time, this.camera);

		this.objectList.forEach((obj: SceneObject) => {
			obj.updateFunction(this.time, obj);
		});
		this.tick();
	}
}

class SceneObject {

	private _name: string;
	private _vertexBuffer: VertexBuffer;
	private _indexBuffer: IndexBuffer;
	private _shaderProgram: ShaderProgram;
	private _translation: vec3;
	private _scale: vec3;
	private _rotation: vec3;
	private _transform: mat4;
	private _updateFunction: UpdateFunction;

	constructor(vertexBuffer: VertexBuffer, indexBuffer: IndexBuffer, shader: ShaderProgram) {
		this._vertexBuffer = vertexBuffer;
		this._indexBuffer = indexBuffer;
		this._shaderProgram = shader;
		this._translation = [0, 0, 0];
		this._scale = [1, 1, 1];
		this._rotation = [0, 0, 0];
		this._transform = mat4.create();
		this._updateFunction = (time: number, obj: SceneObject) => {};
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

	set vertexBuffer(vertexBuffer: VertexBuffer) {
		this._vertexBuffer = vertexBuffer;
	}

	get indexBuffer(): IndexBuffer {
		return this._indexBuffer;
	}

	set indexBuffer(vertexBuffer: IndexBuffer) {
		this._indexBuffer = vertexBuffer;
	}

	get shaderProgram(): ShaderProgram {
		return this._shaderProgram;
	}

	set shaderProgram(shaderProgram: ShaderProgram) {
		this._shaderProgram = shaderProgram;
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

	set rotation(vec: vec3) {
		this._rotation = vec;
	}

	get rotation(): vec3 {
		return this._rotation;
	}

	get transform(): mat4 {
		let rotation: quat = quat.fromEuler(quat.create(), this.rotation[0], this.rotation[1], this.rotation[2]);
		return mat4.fromRotationTranslationScale(this._transform, rotation, this.translation, this.scale);
	}

	get updateFunction(): UpdateFunction {
		return this._updateFunction;
	}

	set updateFunction(updateFunction: UpdateFunction) {
		this._updateFunction = updateFunction;
	}

	clone(): SceneObject {
		let clone = new SceneObject(this.vertexBuffer, this.indexBuffer, this.shaderProgram);
		clone.name = this.name;
		clone.translation = this.translation;
		clone.scale = this.scale;
		clone.rotation = this.rotation;
		clone.updateFunction = this.updateFunction;
		return clone;
	}
}

class Camera {

	private _aspectRatio: number;
	private _perspectiveMatrix: mat4;
	private _viewMatrix: mat4;
	private _translation: vec3;
	private _rotation: vec3;
	private _transform: mat4;
	private _updateFunction: UpdateFunction;

	constructor(aspectRatio: number, fovy: number, near: number, far: number) {
		this._aspectRatio = aspectRatio;
		this._perspectiveMatrix = mat4.perspective(mat4.create(), glMatrix.toRadian(fovy), this._aspectRatio, near, far);
		this._translation = vec3.create();
		this._viewMatrix = mat4.create();
		this._rotation = [0, 0, 0];
		this._transform = mat4.create();
		this._updateFunction = (time: number, cam: Camera) => {};
	}

	get aspectRatio(): number {
		return this._aspectRatio;
	}

	set aspectRatio(aspectRatio: number) {
		this._aspectRatio = aspectRatio;
	}

	get perspectiveMatrix(): mat4 {
		return this._perspectiveMatrix;
	}

	get viewMatrix(): mat4 {
		let rotation: quat = quat.fromEuler(quat.create(), this._rotation[0], this._rotation[1], this._rotation[2]);
		mat4.fromRotationTranslation(this._transform, rotation, this._translation);
		return mat4.invert(this._viewMatrix, this._transform);
	}

	get translation(): vec3 {
		return this._translation;
	}

	set translation(vec: vec3) {
		this._translation = vec;
	}

	get rotation(): vec3 {
		return this._rotation;
	}

	set rotation(vec: vec3) {
		this._rotation = vec;
	}

	get transform(): mat4 {
		let r: quat = quat.fromEuler(quat.create(), this._rotation[0], this._rotation[1], this._rotation[2]);
		return mat4.fromRotationTranslation(this._transform, r, this.translation);
	}

	set updateFunction(updateFuntion: UpdateFunction) {
		this._updateFunction = updateFuntion;
	}

	get updateFunction(): UpdateFunction {
		return this._updateFunction;
	}
}

export { Scene, SceneObject, Camera };