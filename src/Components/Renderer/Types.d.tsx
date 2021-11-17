import { vec3, vec4 } from 'gl-matrix';

import { SceneObject } from './Scene';
import { Camera } from './Camera';

type UpdateFunction = (time: number, object: SceneObject | Camera) => void;

interface Vertex {
    [index: string]: number[];
    position: [number, number, number];
    color?: [number, number, number, number];
}

interface Colors {
    [key: string]: [number, number, number, number];
}

interface VertexLayout {
    name: string,
    size: number,
    type: number,
    normalized?: boolean,
    offset?: number,
    stride?: number,
}

export { Vertex, VertexLayout, Colors, UpdateFunction };