import { VertexBuffer, IndexBuffer, VertexBufferLayout, VertexTypes } from '../../Renderer/Buffer';
import { Shader, ShaderProgram, ShaderType } from '../../Renderer/Shader';
import { Material, MaterialPropertyType } from '../../Renderer/Material';
import { SceneObject } from '../../Renderer/Scene';

const vertexBuffer: VertexBuffer = new VertexBuffer(
	new Float32Array([]),
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
		},
		{
			name: 'normal',
			size: 3,
			type: VertexTypes.FLOAT,
			normalized: false
		}
	])
);

const indexBuffer: IndexBuffer = new IndexBuffer(
	new Uint32Array([])
);

const vertexShader: Shader = new Shader(
	`
	precision mediump float;

	attribute vec3 position;
	attribute vec2 texCoord;

	uniform mat4 transform;
	uniform mat4 perspective;
	uniform mat4 view;

	uniform vec4 color;

	varying vec4 v_color;
	varying vec4 v_position;
	varying vec2 v_texCoord;

	void main(void) {
		v_color = color;
		v_texCoord = texCoord;
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
	varying vec2 v_texCoord;

	uniform sampler2D texture;

	void main(void) {
		gl_FragColor = texture2D(texture, v_texCoord);
	}
	`,
	ShaderType.FRAGMENT
);

const shaderProgram: ShaderProgram = new ShaderProgram(vertexShader, fragmentShader);

const material: Material = new Material('Empty Material', shaderProgram, [
	{
		type: MaterialPropertyType.VEC4,
		name: 'color',
		value: [0.86, 0.34, 0.56, 1]
	}
]);

const empty: SceneObject = new SceneObject(vertexBuffer, indexBuffer, material);
empty.name = 'Empty Scene Object';

export { empty };


