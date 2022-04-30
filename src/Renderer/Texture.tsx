class Texture {

	private _texture: WebGLTexture;
	private _created: boolean;
	private _loaded: boolean;
	private _name: string;
	private _data: Uint8ClampedArray;
	private _width: number;
	private _height: number;

	constructor(data: Uint8ClampedArray, width: number, height: number) {
		this._created = false;
		this._loaded = false;
		this._data = data;
		this._width = width;
		this._height = height;
	}

	get texture(): WebGLTexture {
		return this._texture;
	}

	set texture(texture: WebGLTexture) {
		this._texture = texture;
	}

	get created(): boolean {
		return this._created;
	}

	set created(created: boolean) {
		this._created = created;
	}

	get loaded(): boolean {
		return this._loaded;
	}

	get name(): string {
		return this._name;
	}

	get data(): Uint8ClampedArray {
		return this._data;
	}

	get width(): number {
		return this._width;
	}

	get height(): number {
		return this._height;
	}
}

export { Texture }