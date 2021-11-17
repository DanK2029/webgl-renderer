import * as React from 'react';

import './Canvas.scss'

import { vec3 } from 'gl-matrix';

import { Renderer } from './Renderer';
import { SceneObject } from './Scene';
import { Camera } from './Camera'
import RendererContext from './Context';

type EventCallback = (event: any) => void;

interface CanvasProps {
    eventCallback: EventCallback;
}

export default class Canvas extends React.Component<CanvasProps> {

    private _renderer: Renderer;
    private _canvas: React.RefObject<HTMLCanvasElement>;

    _eventCallback: EventCallback;

    constructor(props: any) {
        super(props);
        this._eventCallback = props.eventCallback;
        this._canvas = React.createRef<HTMLCanvasElement>();
    }

    handleEvent(event: any) {
        console.log(event);
    }

    componentDidMount() {
        const gl: WebGL2RenderingContext = this._canvas.current.getContext('webgl2');
        this._renderer = new Renderer(this._canvas.current, this.context);

        const cam: Camera = new Camera(this._canvas.current, 90, 0.001, 1000);
        cam.translation = vec3.fromValues(0, 0, 2);
        this._renderer.scene.camera = cam;

        this._renderer.drawScene();
    }

    render() {
        return (
            <canvas id="canvas" ref={this._canvas} width='800' height='600'></canvas>
        );
    }
}
Canvas.contextType = RendererContext;