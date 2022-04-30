class Texture {

	private _texture: WebGLTexture;
	private _created: boolean;
	private _loaded: boolean;
	private _name: string;
	private _imageData: Uint8ClampedArray;
	private _width: number;
	private _height: number;

	constructor(imageData: Uint8ClampedArray, width: number, height: number) {
		this._created = false;
		this._loaded = false;
		this._imageData = imageData;
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

}

export { Texture }