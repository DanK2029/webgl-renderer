import { vec2, vec3, vec4, mat4 } from 'gl-matrix';
import * as uniqid from 'uniqid';

import { ShaderProgram } from './Shader';
import { Texture } from './Texture';

enum MaterialPropertyType {
	SCALAR,
	VEC2,
	VEC3,
	VEC4,
	MAT4,
	TEXTURE
}

type MaterialPropertyValue = number | vec2 | vec3 | vec4 | mat4 | Texture;

interface MaterialProperty {
	type: MaterialPropertyType,
	name: string,
	value: MaterialPropertyValue
}

class Material {

	private _id: string;
	private _name: string;
	private _program: ShaderProgram;
	private _properties: MaterialProperty[];

	constructor(name: string, shaderProgram: ShaderProgram, properties: MaterialProperty[]) {
		this._id = uniqid();
		this._name = name;
		this._program = shaderProgram;
		this._properties = properties;
	}

	get id(): string {
		return this._id;
	}

	get name(): string {
		return this._name;
	}

	set name(name: string) {
		this._name = name;
	}

	get program(): ShaderProgram {
		return this._program;
	}

	set program(shaderProgram: ShaderProgram) {
		this._program = shaderProgram;
	}

	get properties(): MaterialProperty[] {
		return this._properties;
	}

	set properties(properties: MaterialProperty[]) {
		this._properties = properties;
	}

	addProperty(property: MaterialProperty): void {
		this._properties.push(property);
	}

	clone(): Material {
		const clone: Material = new Material(this.name, this.program.clone(), this._properties);
		return clone;
	}
}

export { Material, MaterialProperty, MaterialPropertyType };