import { ShaderProgram } from './Shader'

enum MaterialPropertyType {
	SCALAR,
	VEC2,
	VEC3,
	VEC4,
	MAT4,
	TEXTURE
}

interface MaterialProperty {
	type: MaterialPropertyType,
	name: string,
	value: any
}

class Material {

	private _program: ShaderProgram;
	private _properties: MaterialProperty[];

	constructor(shaderProgram: ShaderProgram, properties: MaterialProperty[]) {
		this._program = shaderProgram;
		this._properties = properties;
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
		let clone: Material = new Material(this.program.clone(), this._properties);
		return clone;
	}
}

export { Material, MaterialProperty, MaterialPropertyType };