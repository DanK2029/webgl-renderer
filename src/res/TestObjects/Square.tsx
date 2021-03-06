import { VertexBuffer, IndexBuffer, VertexBufferLayout, VertexTypes } from '../../Renderer/Buffer';
import { Shader, ShaderProgram, ShaderType } from '../../Renderer/Shader';
import { Material, MaterialPropertyType } from '../../Renderer/Material';
import { SceneObject } from '../../Renderer/Scene';

const vertexBuffer: VertexBuffer = new VertexBuffer(
	new Float32Array([
		-1, 1, 0,
		0, 0,

		1, 1, 0,
		1, 0,

		1, -1, 0,
		1, 1,

		-1, -1, 0,
		0, 1
	]),
	new VertexBufferLayout([
		{
			name: 'position',
			size: 3,
			type: VertexTypes.FLOAT,
			normalized: false
		},
		{
			name: 'texCoord',
			size: 2,
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
	attribute vec2 texCoord;

	uniform mat4 transform;
	uniform mat4 perspective;
	uniform mat4 view;

	varying vec4 v_color;
	varying vec4 v_position;
	varying vec2 v_texCoord;

	void main(void) {
		v_position = perspective * view * transform * vec4(position, 1.0);
		gl_Position = v_position;
		v_texCoord = texCoord;
	}
	`,
	ShaderType.VERTEX
);

const fragmentShader: Shader = new Shader(
	`
	precision mediump float;

	varying vec4 v_color;
	varying vec4 v_position;
	varying vec2 v_texCoord;

	uniform sampler2D texture;

	void main(void) {
		gl_FragColor = texture2D(texture, v_texCoord);
		//gl_FragColor = vec4(v_texCoord.x, v_texCoord.y, 1.0, 1.0);
		//gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
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
]);

const square: SceneObject = new SceneObject(vertexBuffer, indexBuffer, material);
square.name = 'Square';

export { square };
