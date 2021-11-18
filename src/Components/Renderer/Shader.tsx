enum ShaderType {
    VERTEX,
    FRAGMENT
}

class Shader {

    private _source: string;
    private _shader: WebGLShader;
    private _type: ShaderType;
    private _created: boolean;

    constructor(source: string, type: ShaderType) {
        this._source = source;
        this._type = type;
    }

    get source(): string {
        return this._source;
    }

    set source(source: string) {
        this._source = source;
    }

    get shader(): WebGLShader {
        return this._shader;
    }

    set shader(shader: WebGLShader) {
        this._shader = shader;
    }

    get type(): ShaderType {
        return this._type;
    }

    set type(type: ShaderType) {
        this._type = type;
    }

    get created(): boolean {
        return this._created;
    }

    set created(created: boolean) {
        this._created = created;
    }
}

class ShaderProgram {

    private _program: WebGLProgram;
    private _vertexShader: Shader;
    private _fragmentShader: Shader;
    private _created: boolean;

    constructor(vertexShader: Shader, fragmentShader: Shader) {
        this._vertexShader = vertexShader;
        this._fragmentShader = fragmentShader;
    }

    get program(): WebGLProgram {
        return this._program;
    }

    set program(program: WebGLProgram) {
        this._program = program;
    }

    get vertexShader(): Shader {
        return this._vertexShader;
    }

    set vertexShader(vertexShader: Shader) {
        this._vertexShader = vertexShader;
    }

    get fragmentShader(): Shader {
        return this._fragmentShader;
    }

    set fragmentShader(fragmentShader: Shader) {
        this._fragmentShader = fragmentShader;
    }

    get created(): boolean {
        return this._created;
    }

    set created(created: boolean) {
        this._created = created;
    }
}

export { Shader, ShaderProgram, ShaderType }