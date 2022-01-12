class VertexBuffer {

	private _vertices: Float32Array;
	private _buffer: WebGLBuffer;
	private _layout: VertexBufferLayout;
	private _created: boolean;

	constructor(vertices: Float32Array, layout: VertexBufferLayout) {
		this._vertices = vertices;
		this._layout = layout;
		this._created = false;
	}

	get vertices(): Float32Array {
		return this._vertices;
	}

	set vertices(vertices: Float32Array) {
		this._vertices = vertices;
	}

	get buffer(): WebGLBuffer {
		return this._buffer;
	}

	set buffer(buffer: WebGLBuffer) {
		this._buffer = buffer;
	}

	get layout(): VertexBufferLayout {
		return this._layout;
	}

	set layout(layout: VertexBufferLayout) {
		this._layout = layout;
	}

	get created(): boolean {
		return this._created;
	}

	set created(created: boolean) {
		this._created = created;
	}

	clone(): VertexBuffer {
		const clonedVertexLayout: VertexBufferLayout = this.layout.clone();
		let clonedVertexBuffer = new VertexBuffer(this.vertices, clonedVertexLayout);
		return clonedVertexBuffer;
	}
}

class IndexBuffer {

	private _indices: Uint32Array;
	private _buffer: WebGLBuffer;
	private _length: number;
	private _created: boolean;

	constructor(indices: Uint32Array) {
		this._indices = indices;
		this._length = indices.length;
		this._created = false;
	}

	get indices(): Uint32Array {
		return this._indices;
	}

	set indices(vertices: Uint32Array) {
		this._indices = vertices;
		this._length = vertices.length;
	}

	get buffer(): WebGLBuffer {
		return this._buffer;
	}

	set buffer(buffer: WebGLBuffer) {
		this._buffer = buffer;
	}

	get length(): number {
		return this._length;
	}

	get created(): boolean {
		return this._created;
	}

	set created(created: boolean) {
		this._created = created;
	}

	clone(): IndexBuffer {
		let clonedIndexBuffer = new IndexBuffer(this.indices);
		return clonedIndexBuffer;
	}
}

enum VertexTypes {
	FLOAT
}

interface VertexLayout {
	name: string,
	size: number,
	type: VertexTypes,
	normalized: boolean
}

class VertexBufferLayout {

	private _layout: VertexLayout[];
	private _created: boolean;

	constructor(layout: VertexLayout[]) {
		this._layout = layout;
		this._created = false;
	}

	get layout(): VertexLayout[] {
		return this._layout;
	}

	get created(): boolean {
		return this._created;
	}

	set created(created: boolean) {
		this._created = created;
	}

	clone(): VertexBufferLayout {
		let clonedVertexBufferLayout: VertexBufferLayout = new VertexBufferLayout(this.layout);
		return clonedVertexBufferLayout;
	}
}

export { VertexBuffer, IndexBuffer, VertexBufferLayout, VertexLayout, VertexTypes };