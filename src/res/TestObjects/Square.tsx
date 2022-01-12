import { VertexBuffer, IndexBuffer, VertexBufferLayout, VertexTypes } from '../../Renderer/Buffer';
import { Shader, ShaderProgram, ShaderType } from '../../Renderer/Shader';
import { Material, MaterialPropertyType } from '../../Renderer/Material';
import { SceneObject } from '../../Renderer/Scene';

const vertexBuffer: VertexBuffer = new VertexBuffer(
	new Float32Array([
		-1, 1, 0,
		1, 1, 0,
		1, -1, 0,
		-1, -1, 0,
	]),
	new VertexBufferLayout([
		{
			name: 'position',
			size: 3,
			type: VertexTypes.FLOAT,
			normalized: false
		}
	])
);

const indexBuffer: IndexBuffer = new IndexBuffer(
	new Uint32Array([
		2, 1, 0,
		3, 2, 0,
	])
);

const vertexShader: Shader = new Shader(
	`
	precision mediump float;

	attribute vec3 position;

	uniform mat4 transform;
	uniform mat4 perspective;
	uniform mat4 view;

	varying vec4 v_color;
	varying vec4 v_position;

	void main(void) {
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
		gl_FragColor = vec4(0.85, 0.45, 0.33, 1.0);
	}
	`,
	ShaderType.FRAGMENT
);

const shaderProgram: ShaderProgram = new ShaderProgram(vertexShader, fragmentShader);

const material: Material = new Material(shaderProgram, [
	{
		type: MaterialPropertyType.VEC4,
		name: 'color',
		value: [1, 0, 0, 1]
	}
])

const square: SceneObject = new SceneObject(vertexBuffer, indexBuffer, material);
square.name = 'Square';

export { square };
