import * as React from 'react';

import { Camera, Scene } from './../../Renderer/Scene';
import { Renderer } from './../../Renderer/Renderer';

import { SceneContext } from './../Context/SceneContext';

import './ViewEditor.scss'

interface RendererProps {
	/**TODO  Fill out if necessary*/
}

export class ViewEditor extends React.Component<RendererProps> {

	private _gl: WebGL2RenderingContext;
	private _renderer: Renderer;
	private _canvas: React.RefObject<HTMLCanvasElement>;
	private _container: React.RefObject<HTMLDivElement>;

	constructor(props: RendererProps) {
		super(props);
		this._canvas = React.createRef<HTMLCanvasElement>();
		this._container = React.createRef<HTMLDivElement>();
	}

	componentDidMount(): void {
		this._gl = this._canvas.current.getContext('webgl2');
		if (!this._gl) {
			throw new Error('WebGL context not set!');
		}
		this._renderer = new Renderer(this._gl);
		
		const { width, height } = this._container.current.getBoundingClientRect();
		this.resizeCanvas(width, height);		
		this._canvas.current.addEventListener('resize', this.onResize.bind(this));

		const scene: Scene = this.context;
		let camera: Camera = new Camera(width/height, 90, 0.001, 1000);
		scene.camera = camera;
		scene.backgroundColor = [0.48, 0.54, 0.87, 1.0];

		this._renderer.drawScene(scene);
	}

	onResize(event: Event): any {
		const width: number = this._container.current.clientWidth;
		const height: number = this._container.current.clientHeight;
		this.resizeCanvas(width, height);
	}

	resizeCanvas(width: number, height: number): void {
		this._canvas.current.width = width;
		this._canvas.current.height = height;
		this._renderer.setViewport(width, height);
	}

	render(): React.ReactNode {
		return (
			<div className='renderer' ref={this._container}>
				<canvas className='canvas' ref={this._canvas}></canvas>
			</div>
		)
	}

}
ViewEditor.contextType = SceneContext;