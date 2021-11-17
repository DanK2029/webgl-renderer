import { vec4 } from 'gl-matrix';

import { SceneObject } from './Scene';

import { Colors, Vertex, VertexLayout } from './Types.d';

const colors: Colors = {
    purple: [0.557, 0.282, 0.937, 1],
    red:    [0.627, 0.173, 0.353, 1],
    green:  [0.514, 0.659, 0.302, 1],
    pink:   [0.922, 0.459, 0.698, 1],
    blue:   [0.124, 0.231, 0.873, 1],
}

function processVertices(vertices: Vertex[], layout: VertexLayout[]): number[] {
    const attributeNames = layout.map(attribute => attribute.name);
    return vertices.flatMap((vertex: Vertex) => {
        return attributeNames.flatMap(name => {
            return vertex[name];
        });
    });
}

function GenerateCube(gl: WebGL2RenderingContext, size: number) {
    let p = size/2;
    let n = -p;

    let vertices: Vertex[] = [
        {
            position: [p, p, p],
            color: colors.pink
        },
        {
            position: [p, n, p],
            color: colors.pink
        },
        {
            position: [n, n, p],
            color: colors.pink
        },
        {
            position: [n, p, p],
            color: colors.pink
        },
        {
            position: [p, p, n],
            color: colors.pink
        },
        {
            position: [p, n, n],
            color: colors.pink
        },
        {
            position: [n, n, n],
            color: colors.pink
        },
        {
            position: [n, p, n],
            color: colors.pink
        }
    ];

    let indices: Uint32Array = new Uint32Array([
        0, 1, 2, 
        0, 2, 3, 
        4, 5, 1, 
        4, 1, 0, 
        7, 6, 5, 
        7, 5, 4, 
        3, 2, 6, 
        3, 6, 7, 
        4, 3, 0, 
        4, 7, 3, 
        5, 2, 1, 
        5, 6, 2  
    ]);

    let layout = [
        {
            name: 'position',
            size: 3,
            type: gl.FLOAT,
            normalized: false
        },
        {
            name: 'color',
            size: 4,
            type: gl.FLOAT,
            normalized: false
        }
    ]

    return new SceneObject(
        gl, new Float32Array(processVertices(vertices, layout)),
        layout, indices, vec4.fromValues(1, 0.86, 0.75, 1)
    );
}

function GenerateTriangle(gl: WebGL2RenderingContext) {
    let vertices: Vertex[] = [
        {
            position: [0, 1, 0],
            color: colors.green,
        },
        {
            position: [1, -1, 0],
            color: colors.blue,
        },
        {
            position: [-1, -1, 0],
            color: colors.pink,
        }
    ];

    let layout: VertexLayout[] = [
        {
            name: 'position',
            size: 3,
            type: gl.FLOAT,
            normalized: false
        },
        {
            name: 'color',
            size: 4,
            type: gl.FLOAT,
            normalized: false
        }
    ]

    let indices: Uint32Array = new Uint32Array([
        2, 1, 0
    ]);

    return new SceneObject(
        gl, new Float32Array(processVertices(vertices, layout)),
        layout, indices, vec4.fromValues(1, 1, 1, 1)
    );
}

function GeneratePlane(gl: WebGL2RenderingContext, y: number) {
    const size = 1000;

    let vertices: Vertex[] = [
        {
            position: [-size, y, -size],
            color: colors.pink,
        },
        {
            position: [-size, y, size],
            color: [0.8, 0.8, 0.8, 1]
        },
        {
            position: [size, y, size],
            color: [0.8, 0.8, 0.8, 1]
        },
        {
            position: [size, y, -size],
            color: [0.8, 0.8, 0.8, 1]
        }       
    ]

    let layout: VertexLayout[] = [
        {
            name: 'position',
            size: 3,
            type: gl.FLOAT,
            normalized: false
        },
        {
            name: 'color',
            size: 4,
            type: gl.FLOAT,
            normalized: false
        }
    ]

    let indices: number[] = [
        0, 1, 2,
        0, 2, 3
    ]

    return { vertices: processVertices(vertices, layout), layout, indices };
}

export { GenerateCube, GenerateTriangle, GeneratePlane };