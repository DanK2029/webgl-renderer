import { vec4, mat4 } from 'gl-matrix';

import { VertexBuffer, IndexBuffer, VertexBufferLayout, VertexLayout, VertexTypes}  from './Buffer';
import { Shader, ShaderProgram, ShaderType } from './Shader';
import { Texture } from './Texture';
import { Material, MaterialProperty, MaterialPropertyType } from './Material';
import { Scene, SceneObject, Camera } from './Scene';


class Renderer {

	private _gl: WebGL2RenderingContext;
	private _curAnimationRequestId: number;

	constructor(gl: WebGL2RenderingContext) {
		this._gl = gl;
	}

	preprocessScene(scene: Scene): void {
		scene.objectList.forEach((obj: SceneObject) => {
			if (!obj.vertexBuffer.created) {
				this.createVertexBuffer(obj.vertexBuffer);
			}

			if (!obj.indexBuffer.created) {
				this.createIndexBuffer(obj.indexBuffer);
			}
			
			if (!obj.material.program.created) {
				this.createShaderProgram(obj.material.program);
			}

			if (!obj.vertexBuffer.layout.created) {
				this.setVertexAttributes(obj.material.program, obj.vertexBuffer.layout);
			}

			obj.material.properties.forEach((prop: MaterialProperty) => {
				switch (prop.type) {
					case MaterialPropertyType.TEXTURE: {
						const texture: Texture = prop.value as Texture;
						if (!texture.created) {
							this.createTexture(texture);
						}

						if (!texture.loaded) {
							this.loadTexture(texture);
						}

						break;
					}
				}
			});
		});

		this.setClearColor(scene.backgroundColor);
		this.enable(this._gl.DEPTH_TEST);
		this.clear(this._gl.COLOR_BUFFER_BIT);
	}

	// ~~~~~~~~~~ DRAW SCENE ~~~~~~~~~~
	drawScene(scene: Scene): void {
		this.clear(this._gl.COLOR_BUFFER_BIT);

		scene.updateFunction();

		this.preprocessScene(scene);

		const cam: Camera = scene.camera;
		
		scene.objectList.forEach((obj: SceneObject) => {
			this.bindSceneObject(obj);

			const shaderProgram: ShaderProgram = obj.material.program;
			this.setUniform4Mat(shaderProgram, 'perspective', cam.perspectiveMatrix);
			this.setUniform4Mat(shaderProgram, 'view', cam.viewMatrix);
			this.setUniform4Mat(shaderProgram, 'transform', obj.transform);

			this.drawElements(this._gl.TRIANGLES, obj.indexBuffer.length, this._gl.UNSIGNED_INT);
			this.unbindSceneObject();
		});

		this._curAnimationRequestId = requestAnimationFrame((() => {
			this.drawScene(scene);
		}).bind(this));
	}

	drawElements(mode: number, count: number, type: number): void {
		this._gl.drawElements(mode, count, type, 0);
	}

	stopDrawingScene(): void {
		cancelAnimationFrame(this._curAnimationRequestId);
	}

	// ~~~~~~~~~~ BUFFER ~~~~~~~~~~

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
		this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, buffer.indices, this._gl.STATIC_DRAW);
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

	// ~~~~~~~~~~ SHADER ~~~~~~~~~~

	createShader(shader: Shader): void {
		const shaderType: ShaderType = shader.type === ShaderType.FRAGMENT 
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

	setUniform1i(shaderProgram: ShaderProgram, name: string, int: number): void {
		const location: WebGLUniformLocation = this._gl.getUniformLocation(shaderProgram.program, name);
		this._gl.uniform1i(location, int);
	}

	setUniform4f(shaderProgram: ShaderProgram, name: string, vec4: vec4): void {
		const location: WebGLUniformLocation = this._gl.getUniformLocation(shaderProgram.program, name);
		this._gl.uniform4fv(location, vec4);
	}

	setUniform4Mat(shaderProgram: ShaderProgram, name: string, mat4: mat4): void {
		const location: WebGLUniformLocation = this._gl.getUniformLocation(shaderProgram.program, name);
		this._gl.uniformMatrix4fv(location, false, mat4);
	}

	setVertexAttributes(shaderProgram: ShaderProgram, vertexLayout: VertexBufferLayout): void {
		this.useProgram(shaderProgram);
		let offset = 0;
		const stride: number = vertexLayout.layout.map((attribute: VertexLayout) => {
			return this.getTypeSize(attribute.type) * attribute.size;
		}).reduce((total: number, cur: number) => (total += cur));

		vertexLayout.layout.forEach((attribute: VertexLayout) => {
			const { name, size, type, normalized } = attribute;
			const glType: number = this.toGLType(type);
			const location: number = this._gl.getAttribLocation(shaderProgram.program, name);

			if (location >= 0) {
				this._gl.vertexAttribPointer(location, size, glType, normalized, stride, offset);
				this._gl.enableVertexAttribArray(location);
			}

			offset += this.getTypeSize(type) * size;
		});
		vertexLayout.created = true;
	}

	// ~~~~~~~~~~ TEXTURE ~~~~~~~~~~

	createTexture(texture: Texture): void {
		texture.texture = this._gl.createTexture();
		texture.created = true;
	}

	bindTexture(texture: Texture): void {
		this._gl.bindTexture(this._gl.TEXTURE_2D, texture.texture);
	}

	loadTexture(texture: Texture): void {
		const level = 0;
		const internalFormat = this._gl.RGBA;
		const width = texture.width;
		const height = texture.height;
		const border = 0;
		const srcFormat = this._gl.RGBA;
		const srcType = this._gl.UNSIGNED_BYTE;
		const data = texture.data;

		this._gl.bindTexture(this._gl.TEXTURE_2D, texture.texture);
		this._gl.texImage2D(this._gl.TEXTURE_2D, level, internalFormat, 
			width, height, border, srcFormat, srcType, data);
		this._gl.generateMipmap(this._gl.TEXTURE_2D);
		texture.loaded = true;
	}

	// ~~~~~~~~~~ MATERIAL ~~~~~~~~~~

	setMaterial(material: Material) {
		const shaderProgram: ShaderProgram = material.program;
		this.useProgram(shaderProgram);

		material.properties.forEach((property: MaterialProperty) => {
			const { name, value } = property;
			switch (property.type) {
				case MaterialPropertyType.VEC4:
					this.setUniform4f(shaderProgram, name, value as vec4);
					break;

				case MaterialPropertyType.MAT4:
					this.setUniform4Mat(shaderProgram, name, value as mat4);
					break;

				case MaterialPropertyType.TEXTURE:
					this._gl.activeTexture(this._gl.TEXTURE0);
					this.bindTexture(value as Texture);
					this.setUniform1i(shaderProgram, name, 0);
					break;
			}
		});
	}

	// ~~~~~~~~~~ RENDERER ~~~~~~~~~~

	setClearColor(color: vec4): void {
		this._gl.clearColor(color[0], color[1], color[2], color[3]);
	}

	clear(flag: number): void {
		this._gl.clear(flag);
	}

	enable(flag: number): void {
		this._gl.enable(flag);
	}

	setViewport(width: number, height: number): void {
		this._gl.viewport(0, 0, width, height);
	}

	// ~~~~~~~~~~ SCENE ~~~~~~~~~~

	bindSceneObject(obj: SceneObject): void {
		this.bindVertexBuffer(obj.vertexBuffer);
		this.setVertexAttributes(obj.material.program, obj.vertexBuffer.layout);
		this.bindIndexBuffer(obj.indexBuffer);
		this.setMaterial(obj.material);
	}

	unbindSceneObject(): void {
		this.unbindVertexBuffer();
		this.unbindIndexBuffer();
		this.dropProgram();
	}

	// ~~~~~~~~~~ UTILS ~~~~~~~~~~

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
}

export { Renderer };