import  { mat4, vec3, quat, glMatrix } from 'gl-matrix';
import { UpdateFunction } from './Types.d';

class Camera {

    private _canvas: HTMLCanvasElement;
    private _aspectRatio: number;
    private _perspectiveMatrix: mat4;

    private _translation: vec3;
    private _viewMatrix: mat4;
    private _rotation: quat;
    private _transform: mat4;

    private _updateFunction: UpdateFunction;

    constructor(canvas: HTMLCanvasElement, fovy: number, near: number, far: number) {
        this._canvas = canvas;
        fovy = glMatrix.toRadian(fovy);

        this._updateFunction = () => {};
        
        this._aspectRatio = this.aspectRatio;
        window.addEventListener('resize', () => {
            this._aspectRatio = this.aspectRatio;
            this._perspectiveMatrix = mat4.perspective(mat4.create(), fovy, this._aspectRatio, near, far);
        });
        
        this._perspectiveMatrix = mat4.perspective(mat4.create(), fovy, this._aspectRatio, near, far);

        this._translation = vec3.create();
        this._viewMatrix = mat4.create();
        this._rotation = quat.create();
        this._transform = mat4.create();
    }

    set updateFunction(updateFuntion: UpdateFunction) {
        this._updateFunction = updateFuntion;
    }

    get updateFunction(): UpdateFunction {
        return this._updateFunction;
    }

    get aspectRatio(): number {
        const { width, height } = this._canvas.getBoundingClientRect();
        return width / height;
    }

    get perspectiveMatrix(): mat4 {
        return this._perspectiveMatrix;
    }

    set translation(vec: vec3) {
        this._translation = vec3.fromValues(vec[0], vec[1], vec[2]);
    }

    set rotation(vec: vec3) {
        const x = vec[0], y = vec[1], z = vec[2];
        quat.rotateX(this._rotation, this._rotation, x);
        quat.rotateY(this._rotation, this._rotation, y);
        quat.rotateZ(this._rotation, this._rotation, z);
    }

    get viewMatrix() {
        mat4.fromRotationTranslation(this._transform, this._rotation, this._translation);
        return mat4.invert(this._viewMatrix, this._transform);
    }

    get transform() {
        return mat4.fromRotationTranslation(this._transform, this._rotation, this._translation);
    }
}

export { Camera };