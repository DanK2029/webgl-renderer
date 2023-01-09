import { vec3, vec4, mat4, quat, glMatrix } from 'gl-matrix';
import * as uniqid from 'uniqid';

import { VertexBuffer, IndexBuffer } from './Buffer';
import { Material, MaterialProperty, MaterialPropertyType } from './Material';
import { Texture } from './Texture';

type UpdateFunction = (
	time: number,
	object: SceneObject | Camera
) => void | (() => undefined);

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

	deleteObject(id: string) {
		this._objectList = this._objectList.filter(
			(obj: SceneObject) => obj.id !== id
		);
	}

	tick(): void {
		this._time += this._deltaTime;
	}

	updateFunction() {
		if (this.camera && this.camera.updateFunction) {
			this.camera.updateFunction(this.time, this.camera);
		}

		this.objectList.forEach((obj: SceneObject) => {
			if (obj.updateFunction) {
				obj.updateFunction(this.time, obj);
			}
		});
		this.tick();
	}

	resetCreated(): void {
		this._objectList.forEach((obj: SceneObject) => {
			obj.resetCreated();
		});
	}
}

class SceneObject {
	private _name: string;
	private _id: string;
	private _vertexBuffer: VertexBuffer;
	private _indexBuffer: IndexBuffer;
	private _material: Material;
	private _translation: vec3;
	private _scale: vec3;
	private _rotation: vec3;
	private _transform: mat4;
	private _updateFunction: UpdateFunction;

	constructor(
		vertexBuffer: VertexBuffer,
		indexBuffer: IndexBuffer,
		material: Material
	) {
		this._id = uniqid();
		this._vertexBuffer = vertexBuffer;
		this._indexBuffer = indexBuffer;
		this._material = material;
		this._translation = [0, 0, 0];
		this._scale = [1, 1, 1];
		this._rotation = [0, 0, 0];
		this._transform = mat4.create();
		this._updateFunction = () => undefined;
	}

	get name(): string {
		return this._name;
	}

	set name(name: string) {
		this._name = name;
	}

	get id(): string {
		return this._id;
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

	get material(): Material {
		return this._material;
	}

	set shaderProgram(material: Material) {
		this._material = material;
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

	rotate(dx: number, dy: number, dz: number) {
		this._rotation = [
			this._rotation[0] + dx,
			this._rotation[1] + dy,
			this._rotation[2] + dz,
		];
	}

	updateGeometry(indexBuffer: IndexBuffer, vertexBuffer: VertexBuffer): void {
		this._indexBuffer = indexBuffer;
		this._vertexBuffer = vertexBuffer;
	}

	get transform(): mat4 {
		const rotation: quat = quat.fromEuler(
			quat.create(),
			this.rotation[0],
			this.rotation[1],
			this.rotation[2]
		);
		return mat4.fromRotationTranslationScale(
			this._transform,
			rotation,
			this.translation,
			this.scale
		);
	}

	get updateFunction(): UpdateFunction {
		return this._updateFunction;
	}

	set updateFunction(updateFunction: UpdateFunction) {
		this._updateFunction = updateFunction;
	}

	clone(): SceneObject {
		const clone = new SceneObject(
			this.vertexBuffer.clone(),
			this.indexBuffer.clone(),
			this.material.clone()
		);
		clone.name = this.name;
		clone.translation = Array.from(this.translation) as vec3;
		clone.scale = Array.from(this.scale) as vec3;
		clone.rotation = Array.from(this.rotation) as vec3;
		clone.updateFunction = this.updateFunction;
		return clone;
	}

	resetCreated(): void {
		this._indexBuffer.created = false;
		this._vertexBuffer.created = false;

		this._material.program.created = false;
		this._material.program.vertexShader.created = false;
		this._material.program.fragmentShader.created = false;

		this._material.properties.forEach((prop: MaterialProperty) => {
			switch (prop.type) {
				case MaterialPropertyType.TEXTURE: {
					const texture: Texture = prop.value as Texture;
					texture.created = false;
					texture.loaded = false;
					break;
				}
			}
		});
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
		this._perspectiveMatrix = mat4.perspective(
			mat4.create(),
			glMatrix.toRadian(fovy),
			this._aspectRatio,
			near,
			far
		);
		this._translation = vec3.create();
		this._viewMatrix = mat4.create();
		this._rotation = [0, 0, 0];
		this._transform = mat4.create();
		this._updateFunction = () => undefined;
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
		const rotation: quat = quat.fromEuler(
			quat.create(),
			this._rotation[0],
			this._rotation[1],
			this._rotation[2]
		);
		mat4.fromRotationTranslation(
			this._transform,
			rotation,
			this._translation
		);
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

	rotate(dx: number, dy: number, dz: number) {
		this._rotation = [
			this._rotation[0] + dx,
			this._rotation[1] + dy,
			this._rotation[2] + dz,
		];
	}

	get transform(): mat4 {
		const r: quat = quat.fromEuler(
			quat.create(),
			this._rotation[0],
			this._rotation[1],
			this._rotation[2]
		);
		return mat4.fromRotationTranslation(
			this._transform,
			r,
			this.translation
		);
	}

	set updateFunction(updateFuntion: UpdateFunction) {
		this._updateFunction = updateFuntion;
	}

	get updateFunction(): UpdateFunction {
		return this._updateFunction;
	}
}

export { Scene, SceneObject, Camera };
