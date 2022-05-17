import { vec2, vec3 } from 'gl-matrix';

import { IndexBuffer, VertexBuffer, VertexBufferLayout, VertexTypes, VertexLayout } from '../Renderer/Buffer';
import { SceneObject } from '../Renderer/Scene';
import { Material } from '../Renderer/Material';

import { cube } from '../res/TestObjects/Cube';

const enum OBJ_FILE_KEYWORDS {
	COMMENT = '#',
	VERTEX = 'v',
	TEXTURE_COORD = 'vt',
	VERTEX_NORMAL = 'vn',
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
	index: number;
}

interface FaceTriangle {
	v0: FaceVertex;
	v1: FaceVertex;
	v2: FaceVertex;
}

interface VertexList extends VertexLayout {
	list: number[][];
}

interface ObjVertexLists {
	[key: string]: VertexList;
	position: VertexList;
	texCoord: VertexList;
	normal: VertexList;
}

class ObjFileReader {

	private _layout: VertexBufferLayout;
	private _indices: number[];

	private _vertexLists: ObjVertexLists;
	private _globalVertexMap: Record<string, FaceVertex>;
	private _vertexCounter: number;

	constructor() {
		this._globalVertexMap = {};
		this._vertexCounter = 0;

		this._vertexLists = {
			position: {
				name: 'position',
				size: 3,
				type: VertexTypes.FLOAT,
				normalized: false,
				list: [],
			},
			texCoord: {
				name: 'texCoord',
				size: 2,
				type: VertexTypes.FLOAT,
				normalized: false,
				list: [],
			},
			normal: {
				name: 'normal',
				size: 3,
				type: VertexTypes.FLOAT,
				normalized: false,
				list: [],
			},
		};

		this._layout = new VertexBufferLayout(
			Object.keys(this._vertexLists).map((vertexAttribute: string) => {
				const layout: VertexLayout = this._vertexLists[vertexAttribute];
				return {
					name: layout.name,
					size: layout.size,
					type: layout.type,
					normalized: layout.normalized
				};
			}
		));

		this.reset()
	}

	public reset() {
		this._indices = [];
	}

	public toSceneObject(data: string, name: string = 'New OBJ Model'): SceneObject {
		data.split('\n').forEach((line: string) => {
			line && this.parseLine(line.trim());
		});
		
		let sceneObject: SceneObject = cube.clone();
		sceneObject.vertexBuffer = this.createVertexBuffer();
		sceneObject.indexBuffer = new IndexBuffer(new Uint32Array(this._indices));

		return sceneObject;
	}

	private createVertexBuffer(): VertexBuffer {
		const vertices: number[] = Object.values(this._globalVertexMap)
			.sort((v1: FaceVertex, v2: FaceVertex) => v1.index < v2.index ? -1 : 1)
			.flatMap((v: FaceVertex) => {
				let vertexData: number[] = [];

				const positionData = v.vertexData as number[];
				const textureCoordData = v.textureCoordData as number[];
				const normalData = v.normalData as number[];

				positionData ? vertexData.push(...positionData) : [0, 0, 0];
				textureCoordData ? vertexData.push(...textureCoordData) : [0, 0];
				normalData ? vertexData.push(...normalData) : [0, 0, 0];

				return vertexData;
			});

		return new VertexBuffer(new Float32Array(vertices), this._layout);
	}

	public parseLine(line: string) {
		let tokens: string[] = line.replace(/\s\s+/g, ' ').split(' ');
		tokens.forEach(token => token.trim());
		const lineType = tokens[0];
		
		switch(lineType) {
			case OBJ_FILE_KEYWORDS.COMMENT:
				// console.log('Parsing comment...');
				break;
			
			case OBJ_FILE_KEYWORDS.VERTEX:
				// console.log('Parsing vertex...');
				this.addVertex(tokens[1], tokens[2], tokens[3])
				break;

			case OBJ_FILE_KEYWORDS.TEXTURE_COORD:
				this.addTextureCoord(tokens[1], tokens[2]);
				break;
			
			case OBJ_FILE_KEYWORDS.VERTEX_NORMAL:
				// console.log('Parsing normal...');
				this.addNormal(tokens[1], tokens[2], tokens[3])
				break;
			
			case OBJ_FILE_KEYWORDS.VERTEX_PARAMETER:
				// console.log('Parsing parameter...');
				break;
			
			case OBJ_FILE_KEYWORDS.FACE:
				// console.log('Parsing face...');
				this.addFace(tokens.slice(1))
				break;
			
			case OBJ_FILE_KEYWORDS.LINE:
				// console.log('Parsing line...');
				break;
	
			case OBJ_FILE_KEYWORDS.DEFINE_MATERIAL:
				// console.log('Parsing define material...');
				break;
	
			case OBJ_FILE_KEYWORDS.USE_MATERIAL:
				// console.log('Parsing use material...');
				break;
			
			case OBJ_FILE_KEYWORDS.OBJECT:
				// console.log('Parsing object...');
				break;
	
			case OBJ_FILE_KEYWORDS.GROUP:
				// console.log('Parsing group...');
				break;
	
			case OBJ_FILE_KEYWORDS.SMOOTHING:
				// console.log('Parsing smoothing...');
				break;
		}
	}

	private addVertex(x: string, y: string, z: string) {
		this._vertexLists.position.list.push(
			[Number.parseFloat(x), Number.parseFloat(y), Number.parseFloat(z)]
		);
	}

	private addTextureCoord(u: string, v: string) {
		this._vertexLists.texCoord.list.push(
			[Number.parseFloat(u), 1 - Number.parseFloat(v)]
		);
	}

	private addNormal(x: string, y: string, z: string) {
		this._vertexLists.normal.list.push(
			[Number.parseFloat(x), Number.parseFloat(y), Number.parseFloat(z)]
		);
	}

	private addFace(indices: string[]): void {
		const numIndices: number = indices.length;
		let faceVertices: FaceVertex[] = indices.map((token: string) => {
			return this.parseFaceToken(token)
		});
		
		let triangles: FaceTriangle[] = [];
		if (numIndices < 3) {
			console.error('Face has less than 3 vertices!');
		} else if (numIndices === 3) {
			triangles.push({
				v0: faceVertices[0],
				v1: faceVertices[1],
				v2: faceVertices[2],
			});
		} else {
			triangles = this.triangulate(faceVertices);
		}

		triangles.forEach((tri: FaceTriangle) => {
			let faceIndices: number[] = new Array<number>();
			[tri.v0, tri.v1, tri.v2].forEach((vertex: FaceVertex) => {
				const vertexId: string = `${vertex.vertexIndex}/${vertex.textureCoordIndex}/${vertex.normalIndex}`;
				if (!this._globalVertexMap[vertexId]) {
					vertex.index = this._vertexCounter++;
					this._globalVertexMap[vertexId] = vertex;
					faceIndices.push(vertex.index);
				} else {
					faceIndices.push(this._globalVertexMap[vertexId].index);
				}
			});
			this._indices.push(...faceIndices);
		});
	}

	public triangulate(faceVertices: FaceVertex[]): FaceTriangle[] {
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

	private parseFaceToken(token: string): FaceVertex {
		const values: string[] = token.split('/');
		if (values.length < 3) {
			throw new Error('Face token not enough values to parse correctly!');
		}

		const vertexIndex: number = values[0] ? Number.parseFloat(values[0]) - 1 : undefined;
		const vertexData: vec3 = vertexIndex !== undefined 
			? this._vertexLists.position.list[vertexIndex] as vec3 
			: undefined;

		const textureIndex: number = values[1] ? Number.parseFloat(values[1]) - 1 : undefined;
		const textureData: vec2 = textureIndex !== undefined 
			? this._vertexLists.texCoord.list[textureIndex] as vec2 
			: undefined;

		const normalIndex: number = values[2] ? Number.parseFloat(values[2]) - 1 : undefined;
		const normalData: vec3 = normalIndex !== undefined 
			? this._vertexLists.normal.list[vertexIndex] as vec3 
			: undefined;

		const vertex: FaceVertex = {
			vertexIndex: vertexIndex,
			vertexData: vertexData,
			textureCoordIndex: textureIndex,
			textureCoordData: textureData,
			normalIndex: normalIndex,
			normalData: normalData,
			index: undefined,
		};

		return vertex;
	}

}


export { ObjFileReader }