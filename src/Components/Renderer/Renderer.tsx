import * as React from 'react';
import { vec3, vec4, mat4, quat } from 'gl-matrix';

import { VertexBuffer, IndexBuffer, VertexBufferLayout, VertexLayout, VertexTypes}  from './Buffer';
import { Shader, ShaderProgram, ShaderType } from './Shader';
import { Scene, SceneObject, Camera } from './Scene';

import { triangle } from './SceneObjects';

import './Renderer.scss'

interface RendererProps {
	/**TODO  Fill out if necessary*/
}

export class Renderer extends React.Component<RendererProps> {

	private _gl: WebGL2RenderingContext;
	private _canvas: React.RefObject<HTMLCanvasElement>;

	constructor(props: RendererProps) {
		super(props);
		this._canvas = React.createRef<HTMLCanvasElement>();
	}

	componentDidMount(): void {
		this._gl = this._canvas.current.getContext('webgl2');
		const { width, height } = this._canvas.current.getBoundingClientRect();
		const camera: Camera = new Camera(width/height, 90, 0.001, 1000);
		camera.translation = [0, 0, 1];
		camera.updateFunction = (time: number, cam: Camera) => {
			cam.translation = [0, 0, 0];
			cam.rotation = [0, 0, time * 50];
			//console.log(cam.transform);
		};

		const scene: Scene = new Scene(0.01);
		scene.camera = camera;
		scene.backgroundColor = [0.48, 0.54, 0.87, 1.0];
		triangle.translation = [0, 0, -3];
		triangle.updateFunction = (time: number, obj: SceneObject) => {
			//obj.translation = [0, 0, 1.1 * Math.sin(time) - 3];
			//obj.rotation = [time * 10, time * 50, time * 35];
		};
		scene.addObject(triangle);

		this.preprocessScene(scene);
		this.drawScene(scene);
	}

	render(): React.ReactNode {
		return (
			<canvas
				className='canvasRenderer'
				ref={this._canvas}
				width='800' height='500'
			></canvas>
		)
	}

	preprocessScene(scene: Scene): void {
		scene.objectList.forEach((obj: SceneObject) => {
			this.createVertexBuffer(obj.vertexBuffer);
			this.createIndexBuffer(obj.indexBuffer);
			this.createShaderProgram(obj.shaderProgram);

			this.setVertexAttributes(obj.shaderProgram, obj.vertexBuffer.layout);
		});

		this.setClearColor(scene.backgroundColor);
		this.enable(this._gl.DEPTH_TEST);
		this.clear(this._gl.COLOR_BUFFER_BIT);
		this.setViewport();
	}

	drawScene(scene: Scene): void {
		this.clear(this._gl.COLOR_BUFFER_BIT);

		scene.updateFunction();

		const cam: Camera = scene.camera;
		
		scene.objectList.forEach((obj: SceneObject) => {
			this.bindSceneObject(obj);

			const shader: ShaderProgram = obj.shaderProgram;
			this.setUniform4Mat(shader, 'perspective', cam.perspectiveMatrix);
			this.setUniform4Mat(shader, 'view', cam.viewMatrix);
			this.setUniform4Mat(shader, 'transform', obj.transform);

			this.drawElements(this._gl.TRIANGLES, obj.indexBuffer.length, this._gl.UNSIGNED_SHORT);
			this.unbindSceneObject();
		})

		requestAnimationFrame((() => {
			this.drawScene(scene)
		}).bind(this));
	}

	drawElements(mode: number, count: number, type: number): void {
		this._gl.drawElements(mode, count, type, 0);
	}

	createVertexBuffer(buffer: VertexBuffer): void {
		buffer.buffer = this._gl.createBuffer();
		buffer.created = true;
		this.bindVertexBuffer(buffer);
		this._gl.bufferData(this._gl.ARRAY_BUFFER, buffer.vertices, this._gl.STATIC_DRAW);
	}

	bindVertexBuffer(buffer: VertexBuffer): void {
		if (!buffer.created) {
			throw new Error('Trying to bind vertex buffer that hasn\'t been created yet');
		}

		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer.buffer);
	}

	unbindVertexBuffer(): void {
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
	}

	createIndexBuffer(buffer: IndexBuffer): void {
		buffer.buffer = this._gl.createBuffer();
		buffer.created = true;
		this.bindIndexBuffer(buffer);
		this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, buffer.vertices, this._gl.STATIC_DRAW);
	}

	bindIndexBuffer(buffer: IndexBuffer): void {
		if (!buffer.created) {
			throw new Error('Trying to bind index buffer that hasn\'t been created yet');
		}

		this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, buffer.buffer);
	}

	unbindIndexBuffer(): void {
		this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, null);
	}

	createShader(shader: Shader): void {
		const shaderType = shader.type === ShaderType.FRAGMENT 
			? this._gl.FRAGMENT_SHADER
			: this._gl.VERTEX_SHADER;

		shader.shader = this._gl.createShader(shaderType);
		this._gl.shaderSource(shader.shader, shader.source);
		this._gl.compileShader(shader.shader);

		shader.created = true;
	}

	createShaderProgram(shaderProgram: ShaderProgram): void {
		if (!shaderProgram.vertexShader.created) {
			this.createShader(shaderProgram.vertexShader);
		}

		if (!shaderProgram.fragmentShader.created) {
			this.createShader(shaderProgram.fragmentShader);
		}
		
		shaderProgram.program = this._gl.createProgram();

		this._gl.attachShader(shaderProgram.program, shaderProgram.vertexShader.shader);
		this._gl.attachShader(shaderProgram.program, shaderProgram.fragmentShader.shader);

		this._gl.linkProgram(shaderProgram.program);
		this._gl.useProgram(shaderProgram.program);

		shaderProgram.created = true;
	}

	useProgram(shaderProgram: ShaderProgram): void {
		this._gl.useProgram(shaderProgram.program);
	}

	dropProgram(): void {
		this._gl.useProgram(null);
	}

	setUniform4f(shaderProgram: ShaderProgram, name: string, vec4: vec4): void {
		const location: WebGLUniformLocation = this._gl.getUniformLocation(shaderProgram.program, name);
		this._gl.uniform4fv(location, vec4);
	}

	setUniform4Mat(shaderProgram: ShaderProgram, name: string, mat4: mat4): void {
		const location: WebGLUniformLocation = this._gl.getUniformLocation(shaderProgram.program, name);
		this._gl.uniformMatrix4fv(location, false, mat4);
	}

	setClearColor(color: vec4): void {
		this._gl.clearColor(color[0], color[1], color[2], color[3]);
	}

	clear(flag: number): void {
		this._gl.clear(flag);
	}

	enable(flag: number): void {
		this._gl.enable(flag);
	}

	setViewport(): void {
		this._gl.viewport(0, 0, this._canvas.current.width, this._canvas.current.height);
	}

	bindSceneObject(obj: SceneObject): void {
		this.bindVertexBuffer(obj.vertexBuffer);
		this.bindIndexBuffer(obj.indexBuffer);
		this.useProgram(obj.shaderProgram);
	}

	unbindSceneObject(): void {
		this.unbindVertexBuffer();
		this.unbindIndexBuffer();
		this.dropProgram();
	}

	toGLType(type: VertexTypes): number {
		switch(type) {
			case VertexTypes.FLOAT:
				return this._gl.FLOAT;
			default:
				throw new Error('Unidentified VertexType!');
		}
	}

	getTypeSize(type: VertexTypes): number {
		switch(type) {
			case VertexTypes.FLOAT:
				return 4;
			default:
				throw new Error('Unidentified VertexType!');
		}
	}

	setVertexAttributes(shaderProgram: ShaderProgram, vertexLayout: VertexBufferLayout): void {
		this.useProgram(shaderProgram);
		let offset: number = 0;
		const stride: number = vertexLayout.layout.map((attribute: VertexLayout) => {
			return this.getTypeSize(attribute.type) * attribute.size
		}).reduce((total: number, cur: number) => (total += cur));

		vertexLayout.layout.forEach((attribute: VertexLayout) => {
			const { name, size, type, normalized } = attribute;
			const glType: number = this.toGLType(type);
			const location: number = this._gl.getAttribLocation(shaderProgram.program, name);

			this._gl.vertexAttribPointer(location, size, glType, normalized, stride, offset);
			this._gl.enableVertexAttribArray(location);

			offset += this.getTypeSize(type) * size;
		});
	}
}