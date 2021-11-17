import { vec2, vec3, vec4, mat3, mat4 } from 'gl-matrix';

class Shader {

	private _gl: WebGL2RenderingContext;
	private _source: string;
	private _shader: WebGLShader;

	constructor(gl: WebGL2RenderingContext, source: string, type: number) {
		this._gl = gl;

		this._shader = this._gl.createShader(type);

		this._gl.shaderSource(this._shader, source);
		this._gl.compileShader(this._shader);

		if (!this._gl.getShaderParameter(this._shader, this._gl.COMPILE_STATUS)) {
			throw Error(this._gl.getShaderInfoLog(this._shader));
		}
	}

	set source(source: string) {
		this._source = source;
		this._gl.shaderSource(this._shader, source);
		this._gl.compileShader(this._shader);

		if (!this._gl.getShaderParameter(this._shader, this._gl.COMPILE_STATUS)) {
			throw Error(this._gl.getShaderInfoLog(this._shader));
		}
	}

	get source(): string {
		return this._source;
	}

	get shader(): WebGLShader {
		return this._shader;
	}
}

class ShaderProgram {

	private _gl: WebGL2RenderingContext;
	private _program: WebGLProgram;

	constructor(gl: WebGL2RenderingContext, vertexShader: Shader, fragmentShader: Shader) {
		this._gl = gl;
		this._program = this._gl.createProgram();

		this._gl.attachShader(this._program, vertexShader.shader);
		this._gl.attachShader(this._program, fragmentShader.shader);

		this._gl.linkProgram(this._program);
		this._gl.useProgram(this._program);
	}

	parseObjectLayout(obj: any) {
		obj.bind();
		this.useProgram();
		obj.vertexBufferLayout.layout.forEach((vertexLayout: any) => {
			const {name, type, size, normalized, stride, offset} = vertexLayout;
			this.setAttribute(name, type, size, normalized, stride, offset)
		});
		obj.unbind();
		this._gl.linkProgram(this._program);
	}

	useProgram() {
		this._gl.useProgram(this._program);
	}

	getAttributeLocation(name: string) {
		return this._gl.getAttribLocation(this._program, name);
	}

	setAttribute(name: string, type: number, size: number, normalized: false, stride: number, offest: number) {
		this.useProgram();
		let loc = this._gl.getAttribLocation(this._program, name);
		this._gl.vertexAttribPointer(loc, size, type, normalized, stride, offest);
		this._gl.enableVertexAttribArray(loc);
	}

	setUniform1f(name: string, value: number) {
		let loc = this._gl.getUniformLocation(this._program, name);
		this._gl.uniform1f(loc, value);
	}

	setUniform2f(name: string, values: vec2) {
		let loc = this._gl.getUniformLocation(this._program, name);
		this._gl.uniform2fv(loc, values);
	}

	setUniform3f(name: string, values: vec3) {
		let loc = this._gl.getUniformLocation(this._program, name);
		this._gl.uniform3fv(loc, values);
	}

	setUniform4f(name: string, values: vec4) {
		let loc = this._gl.getUniformLocation(this._program, name);
		this._gl.uniform4fv(loc, values);
	}

	setUniform3Mat(name: string, values: mat3) {
		let loc = this._gl.getUniformLocation(this._program, name);
		this._gl.uniformMatrix3fv(loc, false, values);
	}

	setUniform4Mat(name: string, values: mat4) {
		let loc = this._gl.getUniformLocation(this._program, name);
		this._gl.uniformMatrix4fv(loc, false, values);
	}
}

export { Shader, ShaderProgram };