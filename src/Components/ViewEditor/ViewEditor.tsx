import * as React from 'react';

import { Camera, Scene } from './../../Renderer/Scene';
import { Renderer } from './../../Renderer/Renderer';

import { SceneContext } from './../Context/SceneContext';

import './ViewEditor.scss'

interface Point {
	x: number;
	y: number;
}

interface MouseEventData {
	prevPos: Point;
	curPos: Point;
	isMousePressed: boolean;
	dragDist: number;
	dragVec: Point;
}

interface RendererProps {
	/**TODO  Fill out if necessary*/
}

export class ViewEditor extends React.Component<RendererProps> {

	private _gl: WebGL2RenderingContext;
	private _renderer: Renderer;
	private _scene: Scene;
	private _canvas: React.RefObject<HTMLCanvasElement>;
	private _container: React.RefObject<HTMLDivElement>;

	private _mouseData: MouseEventData;

	constructor(props: RendererProps) {
		super(props);
		this._canvas = React.createRef<HTMLCanvasElement>();
		this._container = React.createRef<HTMLDivElement>();
		this._mouseData = {
			prevPos: {x: 0, y: 0} as Point,
			curPos: {x: 0, y: 0} as Point,
			isMousePressed: false,
			dragDist: 0,
			dragVec: {x: 0, y: 0} as Point,
		} as MouseEventData;
	}

	componentDidMount(): void {
		this._gl = this._canvas.current.getContext('webgl2');
		if (!this._gl) {
			throw new Error('WebGL context not set!');
		}
		this._renderer = new Renderer(this._gl);
		this._scene = this.context;

		this._container.current.addEventListener('click', this.onClick.bind(this));
		this._container.current.addEventListener('mouseup', this.onMouseUp.bind(this));
		this._container.current.addEventListener('mousedown', this.onMouseDown.bind(this));
		this._container.current.addEventListener('mousemove', this.onMouseMove.bind(this));
		
		document.addEventListener('keydown', this.onKeyDown.bind(this));

		const { width, height } = this._container.current.getBoundingClientRect();
		this.resizeCanvas(width, height);		
		this._canvas.current.addEventListener('resize', this.onResize.bind(this));

		const scene: Scene = this.context;
		let camera: Camera = new Camera(width/height, 90, 0.001, 1000);
		camera.translation = [0, 0, 5];
		scene.camera = camera;
		scene.backgroundColor = [0.48, 0.54, 0.87, 1.0];

		this._renderer.setup(scene);
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

	normalizeMouseCoord(point: Point) {
		return {
			x: -(2 * point.x / this._canvas.current.width) - 1.0,
			y: -(2 * point.y / this._canvas.current.height) - 1.0,
		}
	}

	onClick(event: MouseEvent) {
	}
	
	onMouseDown(event: MouseEvent) {
		this._mouseData.isMousePressed = true;
		this._mouseData.curPos = this.normalizeMouseCoord(
			{x: event.x, y: event.y} as Point
		);
	}

	onMouseUp(event: MouseEvent) {
		this._mouseData.isMousePressed = false;
		const prevPos = this._mouseData.prevPos;
		const curPos = this._mouseData.curPos;
		this._mouseData.dragVec = {
			x: prevPos.x - curPos.y,
			y: prevPos.x - curPos.y
		} as Point;
		this._mouseData.dragDist = Math.sqrt(
			Math.pow(this._mouseData.dragVec.x, 2) + Math.pow(this._mouseData.dragVec.x, 2)
		);
		
		this._mouseData.dragDist = 0;
	}

	onMouseMove(event: MouseEvent) {
		const pos: Point = this.normalizeMouseCoord(
			{x: event.x, y: event.y} as Point
		);
		this._mouseData.curPos = pos;
		const prevPos = this._mouseData.prevPos;

		const curPos = this._mouseData.curPos;
		this._mouseData.dragVec = {
			x: prevPos.x - curPos.x,
			y: prevPos.y - curPos.y
		} as Point;

		this._mouseData.dragDist = Math.sqrt(
			Math.pow(this._mouseData.dragVec.x, 2) + Math.pow(this._mouseData.dragVec.x, 2)
		);

		if (this._mouseData.isMousePressed) {
			const s: number = 70;
			this._scene.camera.rotate(
				s * this._mouseData.dragVec.y, 
				s * this._mouseData.dragVec.x, 
				s * 0
			);
		}

		this._mouseData.prevPos = curPos;
	}

	onKeyDown(event: KeyboardEvent) {

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