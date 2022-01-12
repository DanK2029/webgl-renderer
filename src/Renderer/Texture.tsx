class Texture {

	private _texture: WebGLTexture;
	private _created: boolean;
	private _loaded: boolean;

	constructor(url: string) {
		this._created = false;
		this._loaded = false;

		var input = document.createElement('input');
		input.type = 'file';
		input.onchange = e => {
			console.log(e);
		}
		input.click();

		let image = new Image();
		image.src = url;
		image.addEventListener('load', () => {
			this._loaded = true;
			console.log(image);
		});
		image.addEventListener('error', (error) => {
			console.error(error);
			console.error(`Could not load image at ${url}`);
		})
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