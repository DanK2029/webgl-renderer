import { VertexBuffer, IndexBuffer, VertexBufferLayout, VertexTypes } from "../Buffer";
import { Shader, ShaderProgram, ShaderType } from "../Shader";
import { SceneObject } from "../Scene";

const vertexBuffer: VertexBuffer = new VertexBuffer(
	new Float32Array([
		-1, -1, 0,
		1.0, 0.67, 0.67, 1.0,

		-1, 1, 0,
		1.0, 0.84, 0.65, 1.0,

		1, 1, 0,
		0.99, 1.0, 0.71, 1.0,

		1, -1, 0,
		0.79, 1.0, 0.75, 1.0,

		1, -1, -1,
		0.61, 0.96, 1.0, 1.0,

		1.0,  -1.0,  1.0,
		0.63, 0.77, 1.0, 1.0,

		1.0,  1.0,  -1.0,
		0.74, 0.70, 1.0, 1.0,

		1.0,  1.0,  1.0,
		1.0, 0.77, 1.0, 1.0,
	]),
	new VertexBufferLayout([
		{
			name: 'position',
			size: 3,
			type: VertexTypes.FLOAT,
			normalized: false
		},
		{
			name: 'color',
			size: 4,
			type: VertexTypes.FLOAT,
			normalized: false
		},
	])
);

const indexBuffer: IndexBuffer = new IndexBuffer(
	new Uint32Array([
		2, 1, 0,
		3, 2, 1,
		4, 3, 2,
		5, 4, 3,
		6, 5, 4,
	])
);

const vertexShader: Shader = new Shader(
	`
	precision mediump float;

	attribute vec3 position;
	attribute vec4 color;

	uniform mat4 transform;
	uniform mat4 perspective;
	uniform mat4 view;

	varying vec4 v_color;
	varying vec4 v_position;

	void main(void) {
		v_color = color;
		v_position = perspective * view * transform * vec4(position, 1.0);
		gl_Position = v_position;
	}
	`,
	ShaderType.VERTEX
);

const fragmentShader: Shader = new Shader(
	`
	precision mediump float;

	varying vec4 v_color;
	varying vec4 v_position;

	void main(void) {
		gl_FragColor = v_color;
	}
	`,
	ShaderType.FRAGMENT
);

const shaderProgram: ShaderProgram = new ShaderProgram(vertexShader, fragmentShader);

const cube: SceneObject = new SceneObject(vertexBuffer, indexBuffer, shaderProgram);
cube.name = 'Cube';

export { cube };


