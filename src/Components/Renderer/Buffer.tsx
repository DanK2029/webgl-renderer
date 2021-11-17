import { VertexLayout } from './Types.d'

class VertexBuffer {

    private _gl: WebGL2RenderingContext;
    private _buffer: WebGLBuffer;

    constructor(gl: WebGL2RenderingContext, vertices: Float32Array) {
        this._gl = gl;

        this._buffer = this._gl.createBuffer();

        this.bind();
        gl.bufferData(this._gl.ARRAY_BUFFER, vertices, this._gl.STATIC_DRAW);
        this.unbind();
    }

    bind(): void {
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this.buffer);
    }

    unbind(): void {
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
    }

    get buffer(): WebGLBuffer {
        return this._buffer;
    }
}

class VertexBufferLayout {

    private _gl: WebGL2RenderingContext;
    private _offset: number;
    private _layout: VertexLayout[];

    constructor(gl: WebGL2RenderingContext, layout: VertexLayout[]) {
        this._gl = gl;
        this._offset = 0;
        
        layout.forEach((attribute: VertexLayout) => {
            const { size, type } = attribute;
            attribute.offset = this._offset;
            this.offset += this.getTypeSize(type) * size;
        });

        layout.forEach((attribute) => {
            attribute.stride = this._offset;
        });

        this._layout = layout;
    }

    get layout(): VertexLayout[] {
        return this._layout;
    }

    set layout(layout: VertexLayout[]) {
        this._layout = layout;
    }

    get offset(): number {
        return this._offset;
    }

    set offset(offset: number) {
        this._offset = offset;
    }

    getTypeSize(type: number): number {
        switch (type) {
            case this._gl.BYTE:
                return 1;

            case this._gl.UNSIGNED_BYTE:
                return 1;

            case this._gl.SHORT:
                return 2;
                
            case this._gl.UNSIGNED_SHORT:
                return 2;

            case this._gl.HALF_FLOAT:
                return 2;

            case this._gl.FLOAT:
                return 4;

            default:
                return 0;
        }
    }

}

class IndexBuffer {

    private _gl: WebGL2RenderingContext;
    private _buffer: WebGLBuffer;
    private _length: number;

    constructor(gl: WebGL2RenderingContext, indices: Uint32Array) {
        this._gl = gl;
        this._length = indices.length;
        this._buffer = gl.createBuffer();
        
        this.bind();
        gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, indices, this._gl.STATIC_DRAW);
        this.unbind();
    }

    bind(): void {
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this.buffer);
    }

    unbind(): void {
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, null);
    }

    get length(): number {
        return this._length;
    }

    get buffer(): WebGLBuffer {
        return this._buffer;
    }
}

export { VertexBuffer, VertexBufferLayout, IndexBuffer };