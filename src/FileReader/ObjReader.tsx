import { vec2, vec3 } from 'gl-matrix';

import { IndexBuffer, VertexBuffer, VertexBufferLayout, VertexTypes } from '../Renderer/Buffer';
import { SceneObject } from '../Renderer/Scene';
import { Material } from '../Renderer/Material';

import { cube } from '../res/TestObjects/Cube';

const enum OBJ_FILE_KEYWORDS {
	COMMENT = '#',
	VERTEX = 'v',
	VERTEX_NORMAL = 'vt',
	VERTEX_PARAMETER = 'vp',
	FACE = 'f',
	LINE = 'l',
	DEFINE_MATERIAL = 'mtllib',
	USE_MATERIAL = 'usemtl',
	OBJECT = 'o',
	GROUP = 'g',
	SMOOTHING = 's'
}

interface FaceVertex {
	vertexIndex: number;
	vertexData: vec3;
	textureCoordIndex: number;
	textureCoordData: vec2;
	normalIndex: number;
	normalData: vec3;
	newCreated?: boolean;
}

interface FaceTriangle {
	v0: FaceVertex;
	v1: FaceVertex;
	v2: FaceVertex;
}

class ObjFileReader {

	private _sceneObject: SceneObject;
	private _vertexBuffer: VertexBuffer;
	private _indexBuffer: IndexBuffer;
	private _material: Material;

	private _vertices: number[];
	private _layout: VertexBufferLayout;
	private _indices: number[];

	constructor() {
		this.reset()
	}

	reset() {
		this._vertices = [];
		this._indices = [];
	}

	toSceneObject(data: string, name: string = 'New OBJ Model'): SceneObject {
		console.log('In To scene object function');
		data.split('\n').forEach((line: string) => {
			line && this.parseLine(line.trim());
		})
		console.log(this._vertices);
		console.log(this._indices);

		const vertexLayout: VertexBufferLayout = new VertexBufferLayout([{
			name: 'position',
			size: 3,
			type: VertexTypes.FLOAT,
			normalized: false
		}]);
		let sceneObject: SceneObject = cube.clone();
		sceneObject.vertexBuffer = new VertexBuffer(new Float32Array(this._vertices), vertexLayout);
		sceneObject.indexBuffer = new IndexBuffer(new Uint32Array(this._indices));
		return sceneObject;
	}

	parseLine(line: string) {
		let tokens: string[] = line.replace(/\s\s+/g, ' ').split(' ');
		tokens.forEach(token => token.trim());
		const lineType = tokens[0];
		
		switch(lineType) {
			case OBJ_FILE_KEYWORDS.COMMENT:
				console.log('Parsing comment...');
				break;
			
			case OBJ_FILE_KEYWORDS.VERTEX:
				console.log('Parsing vertex...');
				this.addVertex(tokens[1], tokens[2], tokens[3])
				break;
			
			case OBJ_FILE_KEYWORDS.VERTEX_NORMAL:
				console.log('Parsing normal...');
				break;
			
			case OBJ_FILE_KEYWORDS.VERTEX_PARAMETER:
				console.log('Parsing parameter...');
				break;
			
			case OBJ_FILE_KEYWORDS.FACE:
				console.log('Parsing face...');
				this.addFace(tokens.slice(1))
				break;
			
			case OBJ_FILE_KEYWORDS.LINE:
				console.log('Parsing line...');
				break;
	
			case OBJ_FILE_KEYWORDS.DEFINE_MATERIAL:
				console.log('Parsing define material...');
				break;
	
			case OBJ_FILE_KEYWORDS.USE_MATERIAL:
				console.log('Parsing use material...');
				break;
			
			case OBJ_FILE_KEYWORDS.OBJECT:
				console.log('Parsing object...');
				break;
	
			case OBJ_FILE_KEYWORDS.GROUP:
				console.log('Parsing group...');
				break;
	
			case OBJ_FILE_KEYWORDS.SMOOTHING:
				console.log('Parsing smoothing...');
				break;
		}
	}

	addVertex(x: string, y: string, z: string) {
		this._vertices.push(Number.parseFloat(x), Number.parseFloat(y), Number.parseFloat(z));
	}

	addFace(indices: string[]): void {
		const numIndices: number = indices.length;
		let faceVertices: FaceVertex[] = indices.map((token: string) => {
			return this.parseFaceToken(token)
		})
		console.log(faceVertices)
		let triangles: FaceTriangle[] = [];
		if (numIndices < 3) {
			console.error('Face has less than 3 vertices!');
		} else if (numIndices === 3) {
			console.log('Is a triangle');
			triangles.push({
				v0: faceVertices[0],
				v1: faceVertices[1],
				v2: faceVertices[2],
			});
		} else {
			console.log(`Needs triangularization: ${numIndices}`);
			triangles = this.triangulate(faceVertices);
		}

		triangles.forEach((tri: FaceTriangle) => {
			const v0: number = tri.v0.vertexIndex;
			const v1: number = tri.v1.vertexIndex;
			const v2: number = tri.v2.vertexIndex;
			this._indices.push(v0, v1, v2);
		});
	}

	triangulate(faceVertices: FaceVertex[]): FaceTriangle[] {
		/**
		 * TODO:
		 * 	- decide which triangluarization method we want to use
		 * 		- adding center point and create triangles from center point
		 * 		- triangle fan from one vertex
		 */
		let trianlges: FaceTriangle[] = [];
		const rootVertex = faceVertices[0];
		for (let i = 2; i < faceVertices.length; i++) {
			trianlges.push({
				v2: faceVertices[i],
				v1: faceVertices[i-1],
				v0: rootVertex,
			})
		}
		return trianlges;
	}

	parseFaceToken(token: string): FaceVertex {
		console.log(token);
		const values: string[] = token.split('/');
		if (values.length < 3) {
			throw new Error('Face token not enough values to parse correctly!');
		}
		
		const vertex: number = Number.parseFloat(values[0]);
		const texture: number = Number.parseFloat(values[1]);
		const normal: number = Number.parseFloat(values[2]);

		return {
			vertexIndex: vertex,
			vertexData: undefined,
			textureCoordIndex: texture,
			textureCoordData: undefined,
			normalIndex: normal,
			normalData: undefined
		};
	}

}


export { ObjFileReader }